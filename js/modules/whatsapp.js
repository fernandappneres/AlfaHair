import { CONFIG } from '../config.js';

/** Monta a URL do WhatsApp com a mensagem pré-formatada. */
export function whatsappUrl(message = CONFIG.messages.default) {
  return `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

/** Mensagem de agendamento para um serviço específico. */
export function serviceMessage(serviceName) {
  return `${CONFIG.messages.service}${serviceName}`;
}

/**
 * Preenche o href de todos os links com [data-wa].
 * Valor do atributo: "default", "welcomeOffer" (chaves de CONFIG.messages) ou um texto livre.
 */
export function bindWhatsappLinks(root = document) {
  root.querySelectorAll('[data-wa]').forEach((link) => {
    const key = link.dataset.wa;
    const message = CONFIG.messages[key] ?? (key || CONFIG.messages.default);
    link.href = whatsappUrl(message);
    link.target = '_blank';
    link.rel = 'noopener';
  });
}
