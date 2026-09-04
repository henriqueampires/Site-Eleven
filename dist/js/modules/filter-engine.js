function normalize(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function getByPath(object, path) {
  return path.split(".").reduce((value, key) => value?.[key], object);
}

function matchesKeyword(property, keyword) {
  if (!keyword) return true;
  const searchable = [
    property.name,
    property.code,
    property.neighborhood,
    property.city,
    property.state,
    property.regionLabel,
    property.typeLabel
  ].map(normalize).join(" ");
  return searchable.includes(normalize(keyword));
}

function matchesMinimum(value, selected) {
  if (selected === "all") return true;
  return Number(value ?? 0) >= Number(selected);
}

function matchesFeatureFilters(property, featureFilters) {
  return featureFilters.every(filter => {
    const propertyValue = getByPath(property.features, filter.path);
    if (filter.kind === "boolean") return propertyValue === true;
    if (filter.kind === "number") return Number(propertyValue ?? 0) >= Number(filter.value);
    if (filter.kind === "select") return propertyValue === filter.value;
    return true;
  });
}

export function filterProperties(properties, state) {
  return properties.filter(property => {
    const regionMatches = state.region === "all" || property.region === state.region;
    const typeMatches = state.type === "all" || property.type === state.type;
    const subtypeMatches = state.subtype === "all" || property.subtype === state.subtype;
    const dealMatches = property.deal === state.deal;
    const priceMatches = property.price >= state.priceMin && property.price <= state.priceMax;
    const areaMatches = property.area >= state.areaMin && property.area <= state.areaMax;
    const specialsMatch = state.specials.every(special => property.specials?.[special]);

    return dealMatches
      && matchesKeyword(property, state.keyword)
      && regionMatches
      && typeMatches
      && subtypeMatches
      && matchesMinimum(property.bedrooms, state.bedrooms)
      && matchesMinimum(property.suites, state.suites)
      && matchesMinimum(property.parking, state.parking)
      && priceMatches
      && areaMatches
      && specialsMatch
      && matchesFeatureFilters(property, state.featureFilters);
  });
}
