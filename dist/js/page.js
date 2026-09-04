import { partnerLinks, socialLinks } from "./config/site.js";
import { renderSocialLinks } from "./modules/social-ui.js";

renderSocialLinks(document.querySelector("#social-links"), socialLinks);

const partnerGrid = document.querySelector("#partner-grid");
const partnerStatus = document.querySelector("#partner-status");

if (partnerGrid) {
  partnerGrid.replaceChildren(...partnerLinks.map(partner => {
    const card = document.createElement(partner.url ? "a" : "button");
    card.className = `partner-card${partner.url ? "" : " is-pending"}`;

    const image = document.createElement("img");
    image.className = "partner-card-image";
    image.src = partner.image;
    image.alt = "";
    image.loading = "lazy";
    image.decoding = "async";
    image.style.objectFit = partner.fit ?? "cover";

    const content = document.createElement("span");
    content.className = "partner-card-content";

    const category = document.createElement("span");
    category.textContent = "EMPRESA PARCEIRA";

    const name = document.createElement("strong");
    name.textContent = partner.label;

    const action = document.createElement("small");
    action.textContent = partner.url ? "Visitar página ↗" : "Link em configuração";

    content.append(category, name, action);
    card.append(image, content);

    if (partner.url) {
      card.href = partner.url;
      card.target = "_blank";
      card.rel = "noopener noreferrer";
      card.setAttribute("aria-label", `Visitar o site da ${partner.label}`);
    } else {
      card.type = "button";
      card.setAttribute("aria-label", `${partner.label}: link ainda não configurado`);
      card.addEventListener("click", () => {
        if (partnerStatus) partnerStatus.textContent = `O link da ${partner.label} ainda será configurado.`;
      });
    }
    return card;
  }));
}

const menuButton = document.querySelector(".menu-button");
const mobileMenu = document.querySelector("#mobile-menu");

menuButton.addEventListener("click", () => {
  const expanded = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!expanded));
  mobileMenu.hidden = expanded;
});

mobileMenu.addEventListener("click", event => {
  if (!event.target.closest("a")) return;
  mobileMenu.hidden = true;
  menuButton.setAttribute("aria-expanded", "false");
});
