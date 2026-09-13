import { useEffect, useState } from "react";
import { Heart, MapPin, Star, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  getFavoriteSalons,
  toggleFavoriteSalon,
} from "../../services/favoriteService";
import { calculateDistance } from "../../utils/distance";
import { useLocation } from "../../context/LocationContext";

const Favorites = () => {
  const navigate = useNavigate();
  const { location: userLocation } = useLocation();

  const [favoriteSalons, setFavoriteSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingSalon, setRemovingSalon] = useState("");

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);

        const data = await getFavoriteSalons();

        setFavoriteSalons(data.salons || []);
      } catch (error) {
        console.error("Failed to fetch favorite salons:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const handleRemoveFavorite = async (salonId) => {
    try {
      setRemovingSalon(salonId);

      const data = await toggleFavoriteSalon(salonId);

      if (data.success && !data.isFavorite) {
        setFavoriteSalons((currentSalons) =>
          currentSalons.filter(
            (salon) => String(salon._id) !== String(salonId),
          ),
        );
      }
    } catch (error) {
      console.error("Failed to remove favorite salon:", error);
    } finally {
      setRemovingSalon("");
    }
  };

  const getSalonDistance = (salon) => {
    if (
      userLocation?.latitude == null ||
      userLocation?.longitude == null ||
      salon.location?.latitude == null ||
      salon.location?.longitude == null
    ) {
      return null;
    }

    return calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      salon.location.latitude,
      salon.location.longitude,
    );
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="mx-auto w-full max-w-[1400px] px-4 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-8">
        {/* Page Header */}
        <div className="mb-5 flex items-center justify-between gap-3 sm:mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Heart
                size={22}
                className="text-red-500 sm:h-6 sm:w-6"
                fill="currentColor"
              />

              <h1 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl lg:text-3xl">
                Favorite Salons
              </h1>
            </div>

            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
              Your saved salons, all in one place.
            </p>
          </div>

          {!loading && favoriteSalons.length > 0 && (
            <span className="shrink-0 rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-700 sm:px-4 sm:py-1.5 sm:text-sm">
              {favoriteSalons.length}{" "}
              {favoriteSalons.length === 1 ? "Salon" : "Salons"}
            </span>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="rounded-2xl border border-gray-200 bg-white px-4 py-12 text-center shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Loading favorite salons...
            </p>
          </div>
        )}

        {/* Empty State */}
        {!loading && favoriteSalons.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-12 text-center shadow-sm sm:py-16">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
              <Heart size={27} className="text-red-400" fill="currentColor" />
            </div>

            <h2 className="mt-4 text-lg font-bold text-slate-900">
              No favorite salons yet
            </h2>

            <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-gray-500 sm:text-sm">
              Save your favorite salons to quickly find them whenever you need a
              booking.
            </p>

            <button
              type="button"
              onClick={() => navigate("/salons")}
              className="mt-5 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700"
            >
              Explore Salons
            </button>
          </div>
        )}

        {/* Favorite Salon Grid */}
        {!loading && favoriteSalons.length > 0 && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {favoriteSalons.map((salon) => {
              const distance = getSalonDistance(salon);

              return (
                <article
                  key={salon._id}
                  className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-purple-300 hover:shadow-md"
                >
                  {/* Image */}
                  <div className="relative h-40 overflow-hidden bg-gray-100 sm:h-44">
                    {salon.profileImage ? (
                      <img
                        src={salon.profileImage}
                        alt={`${salon.name} salon`}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="text-xs text-gray-400">
                          Image not available
                        </span>
                      </div>
                    )}

                    {/* Favorite / Remove */}
                    <button
                      type="button"
                      onClick={() => handleRemoveFavorite(salon._id)}
                      disabled={removingSalon === salon._id}
                      aria-label={`Remove ${salon.name} from favorites`}
                      title="Remove from favorites"
                      className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/70 bg-white/95 text-red-500 shadow-md backdrop-blur-sm transition hover:scale-105 hover:bg-white disabled:cursor-wait disabled:opacity-60"
                    >
                      <Trash2 size={16} strokeWidth={2} />
                    </button>
                  </div>

                  {/* Details */}
                  <div className="p-4">
                    <h2 className="truncate text-base font-bold text-slate-900">
                      {salon.name}
                    </h2>

                    <div className="mt-1.5 flex items-center gap-1.5 text-xs text-gray-500">
                      <MapPin size={14} className="shrink-0" />

                      <span className="truncate">
                        {salon.location?.area ||
                          salon.location?.city ||
                          "Location unavailable"}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star
                          size={15}
                          className="text-yellow-500"
                          fill="currentColor"
                        />

                        <span className="text-xs font-bold text-gray-700">
                          {salon.rating || "—"}
                        </span>
                      </div>

                      {distance !== null && (
                        <span className="text-xs font-medium text-gray-500">
                          {distance < 1
                            ? `${Math.round(distance * 1000)} m`
                            : `${distance.toFixed(1)} km`}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => navigate(`/salons/${salon._id}`)}
                      className="mt-4 w-full rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700"
                    >
                      View Salon
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
};

export default Favorites;
