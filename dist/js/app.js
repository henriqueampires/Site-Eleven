import { properties } from "./data/properties.js";
import {
  checkboxGroups,
  commercialFields,
  dealRanges,
  specialLabels,
  subtypeOptions,
  warehouseFields
} from "./config/filters.js";
import { socialLinks } from "./config/site.js";
import { renderSocialLinks } from "./modules/social-ui.js";
import { filterProperties } from "./modules/filter-engine.js";
import { populatePropertyDialog, renderCards } from "./modules/property-ui.js";

const filters = document.querySelector("#property-filters");
const keywordFilter = document.querySelector("#keyword-filter");
const regionFilter = document.querySelector("#region-filter");
const typeFilter = document.querySelector("#type-filter");
const subtypeFilter = document.querySelector("#subtype-filter");
const roomsFilter = document.querySelector("#rooms-filter");
const roomsToggle = document.querySelector("#rooms-toggle");
const roomsPopover = document.querySelector("#rooms-popover");
const roomsSummary = document.querySelector("#rooms-summary");
const priceMin = document.querySelector("#price-min");
const priceMax = document.querySelector("#price-max");
const priceMinOutput = document.querySelector("#price-min-output");
const priceMaxOutput = document.querySelector("#price-max-output");
const areaMin = document.querySelector("#area-min");
const areaMax = document.querySelector("#area-max");
const areaMinOutput = document.querySelector("#area-min-output");
const areaMaxOutput = document.querySelector("#area-max-output");
const advancedToggle = document.querySelector("#advanced-toggle");
const advancedFilters = document.querySelector("#advanced-filters");
const advancedCount = document.querySelector("#advanced-count");
const characteristicFilters = document.querySelector("#characteristic-filters");
const characteristicsContent = document.querySelector("#characteristics-content");
const activeFilters = document.querySelector("#active-filters");

const gridElements = {
  grid: document.querySelector("#property-grid"),
  count: document.querySelector("#results-count"),
  emptyState: document.querySelector("#empty-state")
};

const propertyDialog = document.querySelector("#property-dialog");
const contactDialog = document.querySelector("#contact-dialog");
const profileDialog = document.querySelector("#profile-dialog");
const fullscreenGalleryDialog = document.querySelector("#fullscreen-gallery-dialog");
const contactProperty = document.querySelector("#contact-property");
const detailElements = {
  image: document.querySelector("#detail-image"),
  coverOpen: document.querySelector("#detail-cover-open"),
  coverCta: document.querySelector("#detail-cover-cta"),
  miniGalleryCount: document.querySelector("#mini-gallery-count"),
  miniGalleryPrev: document.querySelector("#mini-gallery-prev"),
  miniGalleryNext: document.querySelector("#mini-gallery-next"),
  miniGalleryTrack: document.querySelector("#mini-gallery-track"),
  label: document.querySelector("#detail-label"),
  code: document.querySelector("#detail-code"),
  title: document.querySelector("#detail-title"),
  location: document.querySelector("#detail-location"),
  price: document.querySelector("#detail-price"),
  specs: document.querySelector("#detail-specs"),
  description: document.querySelector("#detail-description"),
  tourSlot: document.querySelector("#detail-tour-slot"),
  tourStatus: document.querySelector("#detail-tour-status"),
  tourCopy: document.querySelector("#detail-tour-copy"),
  floorPlanSlot: document.querySelector("#detail-floorplan-slot"),
  floorPlanStatus: document.querySelector("#detail-floorplan-status"),
  floorPlanCopy: document.querySelector("#detail-floorplan-copy"),
  technicalSheetSlot: document.querySelector("#detail-technical-sheet-slot"),
  technicalSheetStatus: document.querySelector("#detail-technical-sheet-status"),
  technicalSheetCopy: document.querySelector("#detail-technical-sheet-copy"),
  pointCloudSlot: document.querySelector("#detail-point-cloud-slot"),
  pointCloudStatus: document.querySelector("#detail-point-cloud-status"),
  pointCloudCopy: document.querySelector("#detail-point-cloud-copy"),
  dueDiligenceStatus: document.querySelector("#due-diligence-status"),
  dueDiligenceList: document.querySelector("#due-diligence-list"),
  contact: document.querySelector("#detail-contact")
};

const fullscreenGalleryElements = {
  image: document.querySelector("#fullscreen-gallery-image"),
  title: document.querySelector("#fullscreen-gallery-title"),
  location: document.querySelector("#fullscreen-gallery-location"),
  count: document.querySelector("#fullscreen-gallery-count"),
  prev: document.querySelector("#fullscreen-gallery-prev"),
  next: document.querySelector("#fullscreen-gallery-next"),
  thumbnails: document.querySelector("#fullscreen-gallery-thumbnails")
};

const activeGallery = { images: [], index: 0, propertyName: "", location: "" };

const toast = document.querySelector("#toast");

function showToast(message) {
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => { toast.hidden = true; }, 3800);
}

const compactCurrency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
  notation: "compact"
});

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function selectedDeal() {
  return filters.querySelector('[name="deal"]:checked').value;
}

function selectedQuantity(name) {
  return filters.querySelector(`[name="${name}"]:checked`)?.value ?? "all";
}

function updateRoomsSummary() {
  const parts = [];
  const bedrooms = selectedQuantity("bedrooms");
  const suites = selectedQuantity("suites");
  const parking = selectedQuantity("parking");
  if (bedrooms !== "all") parts.push(`${bedrooms}+ dorm.`);
  if (suites !== "all") parts.push(`${suites}+ suíte${suites === "1" ? "" : "s"}`);
  if (parking !== "all") parts.push(`${parking}+ vaga${parking === "1" ? "" : "s"}`);
  roomsSummary.textContent = parts.length ? parts.join(" · ") : "Dormitórios, suítes e vagas";
}

function formatRangeCurrency(value) {
  const amount = Number(value);
  if (amount === 0) return "R$ 0";
  return compactCurrency.format(amount).replace("mi", " mi").replace("mil", " mil");
}

function keepRangeOrdered(minInput, maxInput, changedInput) {
  if (Number(minInput.value) <= Number(maxInput.value)) return;
  if (changedInput === minInput) maxInput.value = minInput.value;
  else minInput.value = maxInput.value;
}

function updateRangeOutputs() {
  priceMinOutput.textContent = formatRangeCurrency(priceMin.value);
  priceMaxOutput.textContent = formatRangeCurrency(priceMax.value);
  areaMinOutput.textContent = `${Number(areaMin.value).toLocaleString("pt-BR")} m²`;
  areaMaxOutput.textContent = `${Number(areaMax.value).toLocaleString("pt-BR")} m²`;
}

function syncDealRange() {
  const range = dealRanges[selectedDeal()];
  [priceMin, priceMax].forEach(input => {
    input.min = range.min;
    input.max = range.max;
    input.step = range.step;
  });
  priceMin.value = range.min;
  priceMax.value = range.max;
  updateRangeOutputs();
}

function updateSubtypeOptions() {
  const options = subtypeOptions[typeFilter.value];
  if (!options) {
    subtypeFilter.innerHTML = '<option value="all">Escolha primeiro o tipo</option>';
    subtypeFilter.disabled = true;
    return;
  }
  subtypeFilter.innerHTML = options
    .map(([value, label]) => `<option value="${value}">${label}</option>`)
    .join("");
  subtypeFilter.disabled = false;
}

function renderCheckboxGroup(group) {
  return `
    <section class="characteristic-group">
      <h4>${group.title}</h4>
      <div class="checkbox-grid">
        ${group.items.map(([path, label]) => `
          <label><input type="checkbox" data-feature-path="${path}" data-feature-kind="boolean" /><span>${label}</span></label>
        `).join("")}
      </div>
    </section>
  `;
}

function renderTechnicalGroup(title, fields) {
  const controls = fields.filter(field => field.kind !== "boolean").map(field => {
    if (field.kind === "select") {
      return `
        <label class="technical-field">
          <span>${field.label}</span>
          <select data-feature-path="${field.path}" data-feature-kind="select">
            ${field.options.map(([value, label]) => `<option value="${value}">${label}</option>`).join("")}
          </select>
        </label>
      `;
    }
    return `
      <label class="technical-field">
        <span>${field.label}${field.suffix ? ` (${field.suffix})` : ""}</span>
        <input type="number" min="${field.min}" step="${field.step}" placeholder="Sem mínimo" data-feature-path="${field.path}" data-feature-kind="number" />
      </label>
    `;
  }).join("");

  const booleans = fields.filter(field => field.kind === "boolean").map(field => `
    <label><input type="checkbox" data-feature-path="${field.path}" data-feature-kind="boolean" /><span>${field.label}</span></label>
  `).join("");

  return `
    <section class="characteristic-group">
      <h4>${title}</h4>
      ${controls ? `<div class="technical-grid">${controls}</div>` : ""}
      ${booleans ? `<div class="checkbox-grid" style="margin-top:.75rem">${booleans}</div>` : ""}
    </section>
  `;
}

function renderCharacteristicFilters() {
  const groups = [];
  if (typeFilter.value === "casa" || typeFilter.value === "apartamento") {
    groups.push(renderCheckboxGroup(checkboxGroups.condo));
  }
  if (typeFilter.value === "casa") groups.push(renderCheckboxGroup(checkboxGroups.house));
  if (typeFilter.value === "comercial") groups.push(renderTechnicalGroup("Características comerciais", commercialFields));
  if (typeFilter.value === "comercial" && subtypeFilter.value === "galpao") {
    groups.push(renderTechnicalGroup("Características do galpão", warehouseFields));
  }

  characteristicsContent.innerHTML = groups.length ? `<div class="characteristic-groups">${groups.join("")}</div>` : "";
  characteristicFilters.hidden = groups.length === 0;
}

function readFeatureFilters() {
  return [...characteristicsContent.querySelectorAll("[data-feature-path]")].flatMap(input => {
    const kind = input.dataset.featureKind;
    if (kind === "boolean" && !input.checked) return [];
    if (kind === "number" && (input.value === "" || Number(input.value) <= 0)) return [];
    if (kind === "select" && input.value === "") return [];
    return [{ path: input.dataset.featurePath, kind, value: kind === "boolean" ? true : input.value }];
  });
}

function readFilterState() {
  return {
    deal: selectedDeal(),
    keyword: keywordFilter.value,
    region: regionFilter.value,
    type: typeFilter.value,
    subtype: subtypeFilter.disabled ? "all" : subtypeFilter.value,
    bedrooms: selectedQuantity("bedrooms"),
    suites: selectedQuantity("suites"),
    parking: selectedQuantity("parking"),
    priceMin: Number(priceMin.value),
    priceMax: Number(priceMax.value),
    areaMin: Number(areaMin.value),
    areaMax: Number(areaMax.value),
    specials: [...filters.querySelectorAll("[data-special]:checked")].map(input => input.dataset.special),
    featureFilters: readFeatureFilters()
  };
}

function advancedFilterCount(state) {
  const priceRange = dealRanges[state.deal];
  return state.specials.length
    + Number(state.priceMin > priceRange.min)
    + Number(state.priceMax < priceRange.max)
    + Number(state.areaMin > Number(areaMin.min))
    + Number(state.areaMax < Number(areaMax.max));
}

function filterLabel(select) {
  return select.options[select.selectedIndex]?.text ?? "";
}

function renderActiveFilterChips(state) {
  const chips = [`<span class="filter-chip"><strong>Finalidade:</strong>${state.deal === "buy" ? "Comprar" : "Alugar"}</span>`];
  if (state.keyword.trim()) chips.push(`<span class="filter-chip"><strong>Busca:</strong>${escapeHTML(state.keyword.trim())}</span>`);
  if (state.region !== "all") chips.push(`<span class="filter-chip">${filterLabel(regionFilter)}</span>`);
  if (state.type !== "all") chips.push(`<span class="filter-chip">${filterLabel(typeFilter)}</span>`);
  if (state.subtype !== "all") chips.push(`<span class="filter-chip">${filterLabel(subtypeFilter)}</span>`);
  if (state.bedrooms !== "all") chips.push(`<span class="filter-chip">${state.bedrooms}+ dormitórios</span>`);
  if (state.suites !== "all") chips.push(`<span class="filter-chip">${state.suites}+ suítes</span>`);
  if (state.parking !== "all") chips.push(`<span class="filter-chip">${state.parking}+ vagas</span>`);

  const currentPriceRange = dealRanges[state.deal];
  if (state.priceMin > currentPriceRange.min || state.priceMax < currentPriceRange.max) {
    chips.push(`<span class="filter-chip"><strong>Preço:</strong>${formatRangeCurrency(state.priceMin)} — ${formatRangeCurrency(state.priceMax)}</span>`);
  }
  if (state.areaMin > Number(areaMin.min) || state.areaMax < Number(areaMax.max)) {
    chips.push(`<span class="filter-chip"><strong>Área:</strong>${state.areaMin.toLocaleString("pt-BR")} — ${state.areaMax.toLocaleString("pt-BR")} m²</span>`);
  }
  state.specials.forEach(special => chips.push(`<span class="filter-chip">${specialLabels[special]}</span>`));
  if (state.featureFilters.length) chips.push(`<span class="filter-chip"><strong>Características:</strong>${state.featureFilters.length} selecionadas</span>`);

  chips.push('<button class="clear-all-filters" type="button" data-clear-all>Limpar tudo</button>');
  activeFilters.innerHTML = chips.join("");
  activeFilters.hidden = false;
}

function applyFilters() {
  const state = readFilterState();
  const items = filterProperties(properties, state);
  renderCards(items, gridElements);
  renderActiveFilterChips(state);
  const count = advancedFilterCount(state);
  advancedCount.textContent = count;
  advancedCount.hidden = count === 0;
}

function resetAdvancedFilters() {
  syncDealRange();
  areaMin.value = areaMin.min;
  areaMax.value = areaMax.max;
  filters.querySelectorAll("[data-special]").forEach(input => { input.checked = false; });
  updateRangeOutputs();
}

function resetAllFilters() {
  filters.reset();
  keywordFilter.value = "";
  updateSubtypeOptions();
  updateRoomsSummary();
  renderCharacteristicFilters();
  resetAdvancedFilters();
  applyFilters();
}

function openProperty(id) {
  const property = properties.find(item => item.id === Number(id));
  if (!property) return;
  activeGallery.images = populatePropertyDialog(property, detailElements);
  activeGallery.index = 0;
  activeGallery.propertyName = property.name;
  activeGallery.location = `${property.neighborhood} · ${property.city}, ${property.state}`;
  propertyDialog.showModal();
  document.body.style.overflow = "hidden";
}

function closeProperty() {
  propertyDialog.close();
  document.body.style.overflow = "";
}

function openContact(propertyName = "") {
  if (propertyDialog.open) propertyDialog.close();
  contactProperty.value = propertyName;
  const message = contactDialog.querySelector("textarea");
  if (propertyName) message.value = `Tenho interesse no imóvel ${propertyName}.`;
  contactDialog.showModal();
  document.body.style.overflow = "hidden";
}

function setProfileTab(tabName) {
  document.querySelectorAll("[data-profile-tab]").forEach(button => {
    button.setAttribute("aria-selected", String(button.dataset.profileTab === tabName));
  });
  document.querySelector("#profile-login").hidden = tabName !== "login";
  document.querySelector("#profile-register").hidden = tabName !== "register";
}

function openProfile() {
  setProfileTab("login");
  profileDialog.showModal();
  document.body.style.overflow = "hidden";
}

function renderFullscreenGallery() {
  const image = activeGallery.images[activeGallery.index];
  fullscreenGalleryElements.image.src = image;
  fullscreenGalleryElements.image.alt = `${activeGallery.propertyName} — foto ${activeGallery.index + 1}`;
  fullscreenGalleryElements.title.textContent = activeGallery.propertyName;
  fullscreenGalleryElements.location.textContent = activeGallery.location;
  fullscreenGalleryElements.count.textContent = `${activeGallery.index + 1} / ${activeGallery.images.length}`;
  fullscreenGalleryElements.prev.hidden = activeGallery.images.length < 2;
  fullscreenGalleryElements.next.hidden = activeGallery.images.length < 2;
  fullscreenGalleryElements.thumbnails.querySelectorAll("[data-fullscreen-gallery-index]").forEach(button => {
    const isActive = Number(button.dataset.fullscreenGalleryIndex) === activeGallery.index;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-current", String(isActive));
  });
}

function openFullscreenGallery(index = 0) {
  if (!activeGallery.images.length) return;
  activeGallery.index = index;
  fullscreenGalleryElements.thumbnails.innerHTML = activeGallery.images.map((image, imageIndex) => `
    <button type="button" data-fullscreen-gallery-index="${imageIndex}" aria-label="Ver foto ${imageIndex + 1}">
      <img src="${image}" alt="" />
    </button>
  `).join("");
  renderFullscreenGallery();
  fullscreenGalleryDialog.showModal();
  document.body.style.overflow = "hidden";
}

function moveFullscreenGallery(direction) {
  const total = activeGallery.images.length;
  if (!total) return;
  activeGallery.index = (activeGallery.index + direction + total) % total;
  renderFullscreenGallery();
}

filters.addEventListener("submit", event => {
  event.preventDefault();
  applyFilters();
});

filters.addEventListener("change", event => {
  if (event.target.name === "deal") syncDealRange();
  if (event.target === typeFilter) {
    updateSubtypeOptions();
    renderCharacteristicFilters();
  }
  if (event.target === subtypeFilter) renderCharacteristicFilters();
  if (["bedrooms", "suites", "parking"].includes(event.target.name)) updateRoomsSummary();
  if (event.target.matches('input[type="range"]')) {
    if (event.target === priceMin || event.target === priceMax) keepRangeOrdered(priceMin, priceMax, event.target);
    if (event.target === areaMin || event.target === areaMax) keepRangeOrdered(areaMin, areaMax, event.target);
    updateRangeOutputs();
  }
  applyFilters();
});

[priceMin, priceMax, areaMin, areaMax].forEach(input => input.addEventListener("input", () => {
  if (input === priceMin || input === priceMax) keepRangeOrdered(priceMin, priceMax, input);
  else keepRangeOrdered(areaMin, areaMax, input);
  updateRangeOutputs();
}));

let keywordTimer;
keywordFilter.addEventListener("input", () => {
  clearTimeout(keywordTimer);
  keywordTimer = setTimeout(applyFilters, 220);
});

advancedToggle.addEventListener("click", () => {
  const expanded = advancedToggle.getAttribute("aria-expanded") === "true";
  roomsToggle.setAttribute("aria-expanded", "false");
  roomsPopover.hidden = true;
  advancedToggle.setAttribute("aria-expanded", String(!expanded));
  advancedFilters.hidden = expanded;
});

roomsToggle.addEventListener("click", () => {
  const expanded = roomsToggle.getAttribute("aria-expanded") === "true";
  advancedToggle.setAttribute("aria-expanded", "false");
  advancedFilters.hidden = true;
  roomsToggle.setAttribute("aria-expanded", String(!expanded));
  roomsPopover.hidden = expanded;
});

document.querySelector("#rooms-done").addEventListener("click", () => {
  roomsToggle.setAttribute("aria-expanded", "false");
  roomsPopover.hidden = true;
  roomsToggle.focus();
});

document.addEventListener("click", event => {
  if (!roomsFilter.contains(event.target)) {
    roomsToggle.setAttribute("aria-expanded", "false");
    roomsPopover.hidden = true;
  }
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && !roomsPopover.hidden) {
    roomsToggle.setAttribute("aria-expanded", "false");
    roomsPopover.hidden = true;
    roomsToggle.focus();
  }
});

document.querySelector("#apply-advanced").addEventListener("click", () => {
  applyFilters();
  advancedToggle.setAttribute("aria-expanded", "false");
  advancedFilters.hidden = true;
  document.querySelector("#catalogo").scrollIntoView({ behavior: "smooth", block: "start" });
});

document.querySelector("#clear-advanced").addEventListener("click", () => {
  resetAdvancedFilters();
  applyFilters();
});

activeFilters.addEventListener("click", event => {
  if (event.target.closest("[data-clear-all]")) resetAllFilters();
});

document.querySelector("#empty-reset").addEventListener("click", resetAllFilters);

gridElements.grid.addEventListener("click", event => {
  const cardLink = event.target.closest("[data-property-id]");
  if (!cardLink) return;
  event.preventDefault();
  openProperty(cardLink.dataset.propertyId);
});

document.querySelector("[data-close-dialog]").addEventListener("click", closeProperty);
detailElements.coverOpen.addEventListener("click", () => openFullscreenGallery(0));
detailElements.miniGalleryPrev.addEventListener("click", () => detailElements.miniGalleryTrack.scrollBy({ left: -260, behavior: "smooth" }));
detailElements.miniGalleryNext.addEventListener("click", () => detailElements.miniGalleryTrack.scrollBy({ left: 260, behavior: "smooth" }));
detailElements.miniGalleryTrack.addEventListener("click", event => {
  const thumbnail = event.target.closest("[data-open-gallery-index]");
  if (thumbnail) openFullscreenGallery(Number(thumbnail.dataset.openGalleryIndex));
});
document.querySelector(".property-media-grid").addEventListener("click", event => {
  const material = event.target.closest("[data-material-key]");
  if (!material) return;
  const url = material.dataset.materialUrl;
  if (!url) {
    showToast("Este material ainda não foi anexado ao imóvel.");
    return;
  }
  window.open(url, "_blank", "noopener,noreferrer");
});
fullscreenGalleryElements.prev.addEventListener("click", () => moveFullscreenGallery(-1));
fullscreenGalleryElements.next.addEventListener("click", () => moveFullscreenGallery(1));
fullscreenGalleryElements.thumbnails.addEventListener("click", event => {
  const thumbnail = event.target.closest("[data-fullscreen-gallery-index]");
  if (!thumbnail) return;
  activeGallery.index = Number(thumbnail.dataset.fullscreenGalleryIndex);
  renderFullscreenGallery();
});
document.querySelector("#fullscreen-gallery-close").addEventListener("click", () => fullscreenGalleryDialog.close());
detailElements.contact.addEventListener("click", event => openContact(event.currentTarget.dataset.propertyName));
document.querySelectorAll("[data-open-contact]").forEach(button => button.addEventListener("click", () => openContact()));
document.querySelector("[data-close-contact]").addEventListener("click", () => {
  contactDialog.close();
  document.body.style.overflow = "";
});

document.querySelector("#contact-form").addEventListener("submit", event => {
  event.preventDefault();
  contactDialog.close();
  document.body.style.overflow = "";
  showToast("Pedido registrado na demonstração.");
  event.currentTarget.reset();
});

document.querySelectorAll("[data-open-profile]").forEach(button => button.addEventListener("click", openProfile));
document.querySelector("[data-close-profile]").addEventListener("click", () => profileDialog.close());
document.querySelectorAll("[data-profile-tab]").forEach(button => {
  button.addEventListener("click", () => setProfileTab(button.dataset.profileTab));
});
document.querySelector("#profile-login").addEventListener("submit", event => {
  event.preventDefault();
  profileDialog.close();
  event.currentTarget.reset();
  showToast("Acesso demonstrativo concluído. A autenticação real será conectada na próxima etapa.");
});
document.querySelector("#profile-register").addEventListener("submit", event => {
  event.preventDefault();
  profileDialog.close();
  event.currentTarget.reset();
  showToast("Cadastro demonstrativo preenchido. Nenhum dado foi armazenado.");
});

[propertyDialog, contactDialog, profileDialog].forEach(dialog => {
  dialog.addEventListener("click", event => {
    if (event.target === dialog) {
      dialog.close();
      document.body.style.overflow = "";
    }
  });
  dialog.addEventListener("close", () => { document.body.style.overflow = ""; });
});

fullscreenGalleryDialog.addEventListener("click", event => {
  if (event.target === fullscreenGalleryDialog) fullscreenGalleryDialog.close();
});
fullscreenGalleryDialog.addEventListener("close", () => {
  document.body.style.overflow = propertyDialog.open ? "hidden" : "";
});

document.addEventListener("keydown", event => {
  if (!fullscreenGalleryDialog.open) return;
  if (event.key === "ArrowLeft") moveFullscreenGallery(-1);
  if (event.key === "ArrowRight") moveFullscreenGallery(1);
});

const menuButton = document.querySelector(".menu-button");
const mobileMenu = document.querySelector("#mobile-menu");
menuButton.addEventListener("click", () => {
  const expanded = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!expanded));
  mobileMenu.hidden = expanded;
});

mobileMenu.addEventListener("click", event => {
  if (event.target.matches("a, button")) {
    mobileMenu.hidden = true;
    menuButton.setAttribute("aria-expanded", "false");
  }
});

updateSubtypeOptions();
updateRoomsSummary();
renderCharacteristicFilters();
syncDealRange();
updateRangeOutputs();
renderSocialLinks(document.querySelector("#social-links"), socialLinks);
applyFilters();

const requestedDialog = new URLSearchParams(window.location.search).get("dialog");
if (requestedDialog === "profile") openProfile();
if (requestedDialog === "contact") openContact();
if (requestedDialog) window.history.replaceState({}, "", `${window.location.pathname}${window.location.hash}`);
