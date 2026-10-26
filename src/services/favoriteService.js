import api from "./api";

// Salon cards can mount together. Share one in-flight/cached request so the
// favourites endpoint is not called once for every visible card.
let favoritesCache = null;
let favoritesRequest = null;
let cachedToken = null;

const clearFavoritesCache = () => {
  favoritesCache = null;
  favoritesRequest = null;
};

export const getFavoriteSalons = async () => {
  const token = localStorage.getItem("token");

  // Never reuse one user's favourites after the authenticated user changes.
  if (token !== cachedToken) {
    clearFavoritesCache();
    cachedToken = token;
  }

  if (!token) {
    clearFavoritesCache();
    return { salons: [] };
  }

  if (favoritesCache) return favoritesCache;
  if (favoritesRequest) return favoritesRequest;

  favoritesRequest = api
    .get("/favorites")
    .then((response) => {
      favoritesCache = response.data;
      return favoritesCache;
    })
    .catch((error) => {
      // Allow a later attempt if the request failed.
      clearFavoritesCache();
      throw error;
    })
    .finally(() => {
      favoritesRequest = null;
    });

  return favoritesRequest;
};

export const toggleFavoriteSalon = async (salonId) => {
  try {
    const response = await api.post(`/favorites/${salonId}/toggle`);
    return response.data;
  } finally {
    // The server may have changed the list; the next read should be fresh.
    clearFavoritesCache();
  }
};
