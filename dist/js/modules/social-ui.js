const socialIcons = {
  Instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle class="icon-fill" cx="17.4" cy="6.7" r="1"/></svg>',
  Facebook: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.2 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5h1.7V4a22 22 0 0 0-2.5-.1c-2.5 0-4.2 1.5-4.2 4.3V10H8v3h2.8v8h3.4Z"/></svg>',
  YouTube: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 8.1a3 3 0 0 0-2.1-2.2C17 5.4 12 5.4 12 5.4s-5 0-6.9.5A3 3 0 0 0 3 8.1 31 31 0 0 0 2.5 12 31 31 0 0 0 3 15.9a3 3 0 0 0 2.1 2.2c1.9.5 6.9.5 6.9.5s5 0 6.9-.5a3 3 0 0 0 2.1-2.2 31 31 0 0 0 .5-3.9 31 31 0 0 0-.5-3.9Z"/><path class="icon-cutout" d="m10 15.2 5.2-3.2L10 8.8v6.4Z"/></svg>',
  WhatsApp: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 11.7a8.4 8.4 0 0 1-12.4 7.4L3.5 20.5l1.4-4.4a8.4 8.4 0 1 1 15.6-4.4Z"/><path class="icon-cutout" d="M9.1 7.5c.2-.4.4-.4.7-.4h.4c.2 0 .4.1.5.4l.8 2c.1.3.1.5-.1.7l-.7.8c-.2.2-.1.4 0 .6.5.9 1.2 1.7 2.1 2.2.3.2.5.2.7 0l.8-1c.2-.2.4-.3.7-.2l2 .9c.3.1.4.3.4.5 0 .4-.2 1.4-1 2-.7.7-1.6.9-2.6.6-1-.3-2.4-.9-4-2.3-1.3-1.2-2.2-2.7-2.5-3.7-.3-1-.1-2.2.4-2.8l.4-.3Z"/></svg>'
};

export function renderSocialLinks(container, links) {
  if (!container) return;
  container.replaceChildren(...links.map(social => {
    const element = document.createElement(social.url ? "a" : "span");
    element.className = social.url ? "social-icon-link" : "social-icon-link social-placeholder";
    element.innerHTML = socialIcons[social.label] ?? `<span>${social.label.slice(0, 1)}</span>`;
    element.setAttribute("aria-label", social.url ? `Acessar ${social.label} da Eleven` : `${social.label} ainda não configurado`);
    element.title = social.url ? social.label : `${social.label} ainda não configurado`;
    if (social.url) {
      element.href = social.url;
      element.target = "_blank";
      element.rel = "noopener noreferrer";
    }
    return element;
  }));
}
