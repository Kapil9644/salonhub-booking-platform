// Normalize text for flexible search/filter matching
export const normalizeText = (value = "") => {
  return String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9₹.\s-]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
};

// Get all active services safely
export const getSalonServices = (salon) => {
  return Array.isArray(salon?.services) ? salon.services : [];
};

// Get all service names
export const getSalonServiceNames = (salon) => {
  return getSalonServices(salon)
    .map((service) => service?.name)
    .filter(Boolean);
};

// Get all service prices
export const getSalonServicePrices = (salon) => {
  return getSalonServices(salon)
    .map((service) => Number(service?.price))
    .filter((price) => Number.isFinite(price));
};

// Check whether salon has at least one service in price range
export const salonMatchesPriceRange = (
  salon,
  priceRange,
  selectedServices = [],
) => {
  if (!priceRange || priceRange === "Any Price") {
    return true;
  }

  const services = getSalonServices(salon);

  // If services are selected, price must be checked
  // only against those selected services.
  const normalizedSelectedServices = selectedServices.map((service) =>
    normalizeText(service),
  );

  const relevantServices =
    normalizedSelectedServices.length > 0
      ? services.filter((service) =>
          normalizedSelectedServices.includes(normalizeText(service?.name)),
        )
      : services;

  const prices = relevantServices
    .map((service) => Number(service?.price))
    .filter((price) => Number.isFinite(price));

  if (prices.length === 0) {
    return false;
  }

  switch (priceRange) {
    case "₹0 - ₹500":
      return prices.some((price) => price >= 0 && price <= 500);

    case "₹500 - ₹1000":
      return prices.some((price) => price > 500 && price <= 1000);

    case "₹1000+":
      return prices.some((price) => price >= 1000);

    default:
      return true;
  }
};

// Build searchable text from every useful public salon field
export const getSalonSearchFields = (salon) => {
  const location = salon?.location || {};

  return {
    name: normalizeText(salon?.name),
    about: normalizeText(salon?.about),

    address: normalizeText(location.address),
    area: normalizeText(location.area),
    city: normalizeText(location.city),
    state: normalizeText(location.state),
    pincode: normalizeText(location.pincode || location.postcode),

    services: getSalonServiceNames(salon).map(normalizeText),
  };
};

// Flexible relevance score.
//
// Examples:
// "hair spa bhopal"
// "look salon"
// "462001"
// "mp nagar"
// "hair"
export const getSalonSearchScore = (salon, searchText = "") => {
  const normalizedSearch = normalizeText(searchText);

  if (!normalizedSearch) {
    return 0;
  }

  const terms = normalizedSearch.split(/\s+/).filter(Boolean);

  const fields = getSalonSearchFields(salon);

  const searchableFields = [
    fields.name,
    fields.about,
    fields.address,
    fields.area,
    fields.city,
    fields.state,
    fields.pincode,
    ...fields.services,
  ].filter(Boolean);

  let score = 0;
  let matchedTerms = 0;

  terms.forEach((term) => {
    let matched = false;

    // Strong match: salon name
    if (fields.name.includes(term)) {
      score += 30;
      matched = true;
    }

    // Service name
    if (fields.services.some((service) => service.includes(term))) {
      score += 25;
      matched = true;
    }

    // Area/city/state/pincode
    if (
      fields.area.includes(term) ||
      fields.city.includes(term) ||
      fields.state.includes(term) ||
      fields.pincode.includes(term)
    ) {
      score += 20;
      matched = true;
    }

    // Address/about
    if (fields.address.includes(term) || fields.about.includes(term)) {
      score += 10;
      matched = true;
    }

    if (matched) {
      matchedTerms += 1;
    }
  });

  // Small bonus when all search words matched.
  if (terms.length > 1 && matchedTerms === terms.length) {
    score += 40;
  }

  // Do not return completely unrelated salons.
  if (matchedTerms === 0) {
    return -1;
  }

  return score;
};
