import {
  Heart,
  MapPin,
  Star,
  Navigation,
  ArrowLeft,
  Share2,
  Check,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  getFavoriteSalons,
  toggleFavoriteSalon,
} from "../../services/favoriteService";

export default function HeroSection({ salon, distance }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadFavoriteStatus = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/favorites", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) return;

        const data = await response.json();

        const favorite = (data.salons || []).some(
          (item) => String(item._id) === String(salon._id),
        );

        setIsFavorite(favorite);
      } catch (error) {
        console.error("Failed to load favorite status:", error);
      }
    };

    const token = localStorage.getItem("token");

    if (token && salon?._id) {
      loadFavoriteStatus();
    }
  }, [salon?._id]);

  const handleFavorite = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    try {
      setFavoriteLoading(true);

      const data = await toggleFavoriteSalon(salon._id);

      if (data.success) {
        setIsFavorite(data.isFavorite);
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    } finally {
      setFavoriteLoading(false);
    }
  };

  const copyLink = async () => {
    const shareUrl = window.location.href;

    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      const textArea = document.createElement("textarea");

      textArea.value = shareUrl;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";

      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      document.execCommand("copy");
      textArea.remove();
    }

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;

    if (typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: `Check out ${salon?.name || "this salon"} on Rupiva`,
          text: `Check out ${salon?.name || "this salon"} on Rupiva.`,
          url: shareUrl,
        });

        return;
      } catch (error) {
        if (error?.name === "AbortError") {
          return;
        }

        console.error("Native share failed:", error);
      }
    }

    await copyLink();
  };
  const location = salon.location || {};

  const locationText = [location.area, location.city, location.state]
    .filter(Boolean)
    .join(", ");

  const latitude = location.latitude;
  const longitude = location.longitude;

  const hasCoordinates =
    latitude !== null &&
    latitude !== undefined &&
    longitude !== null &&
    longitude !== undefined;

  const directionsUrl = hasCoordinates
    ? `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`
    : "";

  return (
    <section>
      <a
        href="/salons"
        className="mb-3 inline-flex items-center gap-1.5 text-sm font-semibold text-purple-600 transition hover:text-purple-700"
      >
        <ArrowLeft size={16} />
        Back to Salons
      </a>
      {/* Salon Image */}

      <div className="relative overflow-hidden rounded-2xl">
        {salon.profileImage ? (
          <img
            src={salon.profileImage}
            alt={`${salon.name} salon`}
            className="h-[180px] w-full object-cover sm:h-[240px] lg:h-[280px]"
          />
        ) : (
          <div className="flex h-[180px] w-full items-center justify-center bg-gray-100 sm:h-[240px] lg:h-[280px]">
            <span className="px-4 text-center text-lg font-semibold text-gray-400">
              Salon image not available
            </span>
          </div>
        )}

        {/* Image Actions */}
        <div className="absolute right-3 top-3 flex items-center gap-2">
          {/* Favorite */}
          <button
            type="button"
            onClick={handleFavorite}
            disabled={favoriteLoading}
            aria-label={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            className={`flex h-8 w-8 items-center justify-center rounded-full border border-white/70 bg-white/90 shadow-md backdrop-blur-sm transition hover:scale-105 sm:h-9 sm:w-9 lg:h-10 lg:w-10 ${
              favoriteLoading ? "cursor-wait opacity-60" : ""
            }`}
          >
            <Heart
              size={16}
              strokeWidth={2}
              className="sm:h-[17px] sm:w-[17px] lg:h-[19px] lg:w-[19px]"
              fill={isFavorite ? "#ef4444" : "none"}
              stroke={isFavorite ? "#ef4444" : "currentColor"}
            />
          </button>

          {/* Share */}
          <button
            type="button"
            onClick={handleShare}
            aria-label="Share salon"
            title={copied ? "Link copied" : "Share salon"}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/70 bg-white/90 text-gray-700 shadow-md backdrop-blur-sm transition hover:scale-105 hover:text-purple-600 sm:h-9 sm:w-9 lg:h-10 lg:w-10"
          >
            {copied ? (
              <Check
                size={16}
                className="sm:h-[17px] sm:w-[17px] lg:h-[19px] lg:w-[19px]"
              />
            ) : (
              <Share2
                size={16}
                className="sm:h-[17px] sm:w-[17px] lg:h-[19px] lg:w-[19px]"
              />
            )}
          </button>
        </div>
      </div>

      {/* Salon Information */}
      <div className="mt-3 sm:mt-5">
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2.5">
            <h1 className="truncate text-2xl font-bold leading-tight text-slate-900 sm:text-2xl lg:text-2xl">
              {salon.name}
            </h1>

            <span
              className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold leading-4 text-white ${
                salon.isOpen ? "bg-green-600" : "bg-red-500"
              }`}
            >
              {salon.isOpen ? "Open Now" : "Closed"}
            </span>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            <Star size={16} className="fill-yellow-400 text-yellow-400" />

            <span className="text-sm font-bold text-slate-900">
              {salon.rating || "New"}
            </span>

            <span className="text-xs text-gray-1000">
              {salon.reviews || 0} Reviews
            </span>
          </div>
        </div>
        {/* Salon Quick Information */}
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
          {/* Location */}
          <div className="flex min-w-0 items-center gap-2 text-gray-600">
            <MapPin size={17} className="shrink-0 text-purple-600" />

            <span className="min-w-0 truncate text-sm">
              {locationText || "Location not available"}
            </span>
          </div>

          {/* Distance */}
          {distance !== null && distance !== undefined && (
            <span className="shrink-0 text-xs font-semibold text-purple-600">
              {distance.toFixed(1)} km away
            </span>
          )}

          {/* Get Directions */}
          {hasCoordinates && (
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-purple-200 bg-purple-50 px-2.5 py-1.5 text-xs font-semibold text-purple-700 transition hover:border-purple-300 hover:bg-purple-100"
            >
              <Navigation size={14} />
              Get Directions
            </a>
          )}

          {/* Starting Price */}
          <span className="shrink-0 font-semibold text-gray-900 text-sm  bg-amber-300 px-2 py-1 rounded-lg">
            Starting price {salon.priceLabel || "Price unavailable"}
          </span>
        </div>
      </div>
    </section>
  );
}
