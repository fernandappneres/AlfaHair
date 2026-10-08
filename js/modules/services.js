import { CONFIG } from '../config.js';
import { whatsappUrl, serviceMessage } from './whatsapp.js';

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

/** 90 -> "1h 30min", 40 -> "40min" */
function formatDuration(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (!h) return `${m}min`;
  return m ? `${h}h ${m}min` : `${h}h`;
}

function formatPrice(service) {
  const value = currency.format(service.price);
  return service.priceFrom ? `A partir de ${value}` : value;
}

function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

function serviceCard(service) {
  const name = escapeHtml(service.name);
  return `
    <li class="flex flex-col rounded-2xl border border-brand-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <h3 class="text-lg font-semibold text-ink">${name}</h3>
      <p class="mt-1 flex-1 text-sm text-ink-soft">${escapeHtml(service.description)}</p>
      <div class="mt-4 flex items-center justify-between text-sm">
        <span class="inline-flex items-center gap-1 text-ink-soft">
          <svg class="h-4 w-4 text-brand-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
          ${formatDuration(service.duration)}
        </span>
        <span class="font-semibold text-brand-700">${formatPrice(service)}</span>
      </div>
      <a href="${whatsappUrl(serviceMessage(service.name))}" target="_blank" rel="noopener"
         class="btn-primary mt-4 w-full" aria-label="Agendar ${name} pelo WhatsApp">
        Agendar
      </a>
    </li>`;
}

/**
 * Renderiza as abas de categoria e os cards de serviço a partir de data/services.json.
 * @param {HTMLElement} tabsEl  container do role="tablist"
 * @param {HTMLElement} panelEl container do role="tabpanel"
 */
export async function initServices(tabsEl, panelEl) {
  if (!tabsEl || !panelEl) return;

  let data;
  try {
    const res = await fetch(CONFIG.servicesUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    data = await res.json();
  } catch (err) {
    console.error('Erro ao carregar serviços:', err);
    panelEl.innerHTML = `
      <p class="rounded-2xl bg-white p-6 text-center text-ink-soft">
        Não foi possível carregar a lista de serviços agora.
        <a data-wa="default" class="font-semibold text-brand-600 underline" href="${whatsappUrl()}" target="_blank" rel="noopener">Fale conosco pelo WhatsApp</a>.
      </p>`;
    return;
  }

  const categories = data.categories.filter((cat) => data.services.some((s) => s.category === cat.id));

  tabsEl.innerHTML = categories
    .map(
      (cat, i) => `
      <button type="button" role="tab" id="tab-${cat.id}" class="tab-btn"
              aria-controls="${panelEl.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}"
              data-category="${cat.id}">${escapeHtml(cat.label)}</button>`
    )
    .join('');

  const tabs = [...tabsEl.querySelectorAll('[role="tab"]')];

  function select(tab, focus = false) {
    tabs.forEach((t) => {
      const active = t === tab;
      t.setAttribute('aria-selected', String(active));
      t.tabIndex = active ? 0 : -1;
    });
    panelEl.setAttribute('aria-labelledby', tab.id);
    const items = data.services.filter((s) => s.category === tab.dataset.category);
    panelEl.innerHTML = `<ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">${items.map(serviceCard).join('')}</ul>`;
    if (focus) tab.focus();
    // Mantém a aba ativa visível na barra rolável (mobile) sem rolar a página
    tabsEl.scrollTo({ left: tab.offsetLeft - tabsEl.offsetLeft - 16, behavior: 'smooth' });
  }

  tabsEl.addEventListener('click', (e) => {
    const tab = e.target.closest('[role="tab"]');
    if (tab) select(tab);
  });

  // Navegação por teclado entre abas (setas, Home, End)
  tabsEl.addEventListener('keydown', (e) => {
    const i = tabs.indexOf(document.activeElement);
    if (i < 0) return;
    const next = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    select(tabs[(next + tabs.length) % tabs.length], true);
  });

  if (tabs.length) select(tabs[0]);
}
