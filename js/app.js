import { bindWhatsappLinks } from './modules/whatsapp.js';
import { initServices } from './modules/services.js';
import { initCarousel } from './modules/gallery.js';

function initMobileMenu() {
  const toggle = document.querySelector('[data-menu-toggle]');
  const menu = document.getElementById('mobile-menu');
  if (!toggle || !menu) return;

  const setOpen = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('hidden', !open);
  };

  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  menu.addEventListener('click', (e) => {
    if (e.target.closest('a')) setOpen(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false);
  });
}

function initOfferBanner() {
  const banner = document.getElementById('offer-banner');
  const close = banner?.querySelector('[data-offer-close]');
  if (!banner || !close) return;

  const dismiss = () => {
    banner.remove();
    document.body.classList.remove('has-offer', 'pb-20');
  };

  try {
    if (sessionStorage.getItem('offer-dismissed')) dismiss();
  } catch {
    /* storage indisponível: mantém o banner */
  }

  close.addEventListener('click', () => {
    dismiss();
    try {
      sessionStorage.setItem('offer-dismissed', '1');
    } catch {
      /* ignore */
    }
  });
}

bindWhatsappLinks();
initMobileMenu();
initOfferBanner();
initCarousel(document.querySelector('[data-carousel]'));
initServices(document.getElementById('service-tabs'), document.getElementById('service-panel'));

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();
