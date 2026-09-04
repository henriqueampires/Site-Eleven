import { specialLabels } from "../config/filters.js";

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0
});

export function propertyAddress(property) {
  return `${property.neighborhood} · ${property.city}, ${property.state}`;
}

export function formatPropertyPrice(property) {
  return `${currency.format(property.price)}${property.deal === "rent" ? " / mês" : ""}`;
}

function galleryFor(property) {
  if (property.gallery?.length) return property.gallery;
  return property.image ? [property.image] : [];
}

function specsFor(property) {
  const specs = [`${property.area.toLocaleString("pt-BR")} m²`];
  if (property.bedrooms) specs.push(`${property.bedrooms} dorm.`);
  if (property.suites) specs.push(`${property.suites} suíte${property.suites > 1 ? "s" : ""}`);
  if (property.parking) specs.push(`${property.parking} vaga${property.parking > 1 ? "s" : ""}`);
  return specs;
}

function propertyImage(property) {
  const cover = galleryFor(property)[0];
  if (cover) {
    return `<img src="${cover}" alt="${property.name}, ${propertyAddress(property)}" loading="lazy" />`;
  }
  return `<div class="brand-placeholder" aria-label="Imagem do imóvel em atualização"><strong>ELEVEN</strong><small>${property.typeLabel.toUpperCase()}</small></div>`;
}

function specialBadges(property) {
  const badges = Object.entries(property.specials ?? {})
    .filter(([, enabled]) => enabled)
    .slice(0, 2)
    .map(([key]) => `<span>${specialLabels[key]}</span>`)
    .join("");
  return badges ? `<div class="special-badges">${badges}</div>` : "";
}

export function renderCards(items, elements) {
  elements.grid.innerHTML = items.map(property => {
    const photoCount = galleryFor(property).length;
    return `
    <article class="property-card">
      <a class="property-card-link" href="#imovel-${property.id}" data-property-id="${property.id}" aria-label="Abrir detalhes de ${property.name}">
        <div class="property-image">
          ${propertyImage(property)}
          <span class="badge">${property.featured ? "Destaque · " : ""}${property.regionLabel}</span>
          <span class="card-photo-count">${photoCount ? `${photoCount} ${photoCount === 1 ? "foto" : "fotos"}` : "Fotos em breve"}</span>
        </div>
        <div class="property-body">
          <div class="property-meta"><span>${property.typeLabel}</span><span>${property.deal === "buy" ? "Venda" : "Locação"} · ${property.code}</span></div>
          <h3>${property.name}</h3>
          <p class="property-address">${propertyAddress(property)}</p>
          <div class="property-specs">${specsFor(property).map(spec => `<span>${spec}</span>`).join("")}</div>
          ${specialBadges(property)}
          <div class="property-footer">
            <strong class="property-price">${formatPropertyPrice(property)}</strong>
            <span class="card-arrow" aria-hidden="true">↗</span>
          </div>
        </div>
      </a>
    </article>
  `;
  }).join("");

  elements.count.textContent = `${items.length} ${items.length === 1 ? "imóvel encontrado" : "imóveis encontrados"}`;
  elements.emptyState.hidden = items.length !== 0;
  elements.grid.hidden = items.length === 0;
}

export function populatePropertyDialog(property, elements) {
  const gallery = galleryFor(property);
  const cover = gallery[0];
  elements.image.className = cover ? "detail-image" : "detail-image brand-detail";
  elements.image.style.backgroundImage = cover
    ? `linear-gradient(0deg, rgba(2,22,45,.22), rgba(2,22,45,.03)), url('${cover}')`
    : "";
  elements.image.textContent = cover ? "" : "ELEVEN";
  elements.image.setAttribute("aria-label", cover ? `${property.name} — foto de capa` : "Fotos do imóvel em atualização");
  elements.coverOpen.disabled = gallery.length === 0;
  elements.coverOpen.setAttribute("aria-label", gallery.length ? `Abrir galeria de ${property.name}` : "Fotos do imóvel em atualização");
  elements.coverCta.innerHTML = gallery.length ? 'Abrir galeria <span aria-hidden="true">↗</span>' : "Fotos em atualização";
  elements.miniGalleryCount.textContent = gallery.length ? `${gallery.length} ${gallery.length === 1 ? "foto" : "fotos"}` : "Nenhuma foto";
  elements.miniGalleryPrev.hidden = gallery.length < 2;
  elements.miniGalleryNext.hidden = gallery.length < 2;
  elements.miniGalleryTrack.innerHTML = gallery.length ? gallery.map((image, index) => `
    <button type="button" data-open-gallery-index="${index}" aria-label="Ampliar foto ${index + 1} de ${property.name}">
      <img src="${image}" alt="" loading="lazy" />
    </button>
  `).join("") : '<div class="mini-gallery-empty"><strong>Fotos em atualização</strong><span>As imagens deste imóvel serão adicionadas em breve.</span></div>';
  elements.label.textContent = `${property.typeLabel} · ${property.regionLabel} · ${property.deal === "buy" ? "Venda" : "Locação"}`;
  elements.code.textContent = property.code;
  elements.title.textContent = property.name;
  elements.location.textContent = propertyAddress(property);
  elements.price.textContent = formatPropertyPrice(property);
  elements.description.textContent = property.description;
  elements.dueDiligenceStatus.textContent = "ANÁLISE PRELIMINAR";
  elements.dueDiligenceList.innerHTML = property.dueDiligence.map(item => `<li>${item}</li>`).join("");

  const materialItems = [
    {
      slot: elements.tourSlot,
      status: elements.tourStatus,
      copy: elements.tourCopy,
      url: property.materials?.virtualTour,
      advertised: Boolean(property.specials?.virtualTour),
      availableCopy: "Abrir a experiência 360° deste imóvel.",
      waitingCopy: "Disponível durante o atendimento; anexe o link para abrir aqui."
    },
    {
      slot: elements.floorPlanSlot,
      status: elements.floorPlanStatus,
      copy: elements.floorPlanCopy,
      url: property.materials?.floorPlan,
      advertised: Boolean(property.specials?.floorPlan),
      availableCopy: "Abrir a planta completa deste imóvel.",
      waitingCopy: "Disponível durante o atendimento; anexe o arquivo para abrir aqui."
    },
    {
      slot: elements.technicalSheetSlot,
      status: elements.technicalSheetStatus,
      copy: elements.technicalSheetCopy,
      url: property.materials?.technicalSheet,
      advertised: false,
      availableCopy: "Abrir especificações, medidas e informações técnicas.",
      waitingCopy: "Anexe um PDF, imagem ou apresentação para disponibilizar."
    },
    {
      slot: elements.pointCloudSlot,
      status: elements.pointCloudStatus,
      copy: elements.pointCloudCopy,
      url: property.materials?.pointCloud,
      advertised: false,
      availableCopy: "Abrir o arquivo ou visualização tridimensional.",
      waitingCopy: "Anexe o arquivo ou link da visualização tridimensional."
    }
  ];

  materialItems.forEach(material => {
    const hasFile = Boolean(material.url);
    const isAvailable = hasFile || material.advertised;
    material.slot.dataset.materialUrl = material.url ?? "";
    material.slot.classList.toggle("is-available", isAvailable);
    material.slot.classList.toggle("is-unavailable", !isAvailable);
    material.slot.classList.toggle("has-file", hasFile);
    material.slot.setAttribute("aria-label", hasFile ? "Abrir material em nova aba" : "Material ainda não anexado");
    material.status.textContent = hasFile ? "Abrir arquivo" : isAvailable ? "Sob consulta" : "Em atualização";
    material.copy.textContent = hasFile ? material.availableCopy : material.waitingCopy;
  });

  const specs = [
    [property.area.toLocaleString("pt-BR") + " m²", "Área útil"],
    [property.land ? property.land.toLocaleString("pt-BR") + " m²" : "—", "Área do terreno"],
    [property.bedrooms || "—", "Dormitórios"],
    [property.suites || "—", "Suítes"],
    [property.bathrooms || "—", "Banheiros"],
    [property.parking || "—", "Vagas"]
  ];

  elements.specs.innerHTML = specs
    .map(([value, label]) => `<div><strong>${value}</strong><small>${label}</small></div>`)
    .join("");
  elements.contact.dataset.propertyName = property.name;
  return gallery;
}
