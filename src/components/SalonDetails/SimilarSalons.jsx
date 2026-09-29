import { useEffect, useMemo, useRef, useState } from "react";
import { getPublicSalons } from "../../services/salonService";
import { useLocation } from "../../context/LocationContext";
import { calculateDistance } from "../../utils/distance";
import SalonCard from "../common/SalonCard/SalonCard";

export default function SimilarSalons({ salon }) {
  const { location: userLocation } = useLocation();

  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(0);

  const triggerRef = useRef(null);

  useEffect(() => {
    const fetchSalons = async () => {
      try {
        const data = await getPublicSalons();
        setSalons(data.salons || []);
      } catch (error) {
        console.error("Failed to fetch similar salons:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSalons();
  }, []);

  const similarSalons = useMemo(() => {
    if (!salon) return [];

    const currentSalonId = String(salon._id);

    const currentServiceNames = new Set(
      (salon.services || []).map((service) =>
        service.name?.trim().toLowerCase(),
      ),
    );

    return salons
      .filter((item) => String(item._id) !== currentSalonId)
      .map((item) => {
        const itemServiceNames = (item.services || []).map((service) =>
          service.name?.trim().toLowerCase(),
        );

        const matchingServices = itemServiceNames.filter((serviceName) =>
          currentServiceNames.has(serviceName),
        ).length;

        const salonLatitude = item.location?.latitude;
        const salonLongitude = item.location?.longitude;

        const hasDistance =
          userLocation?.latitude != null &&
          userLocation?.longitude != null &&
          salonLatitude != null &&
          salonLongitude != null;

        const distance = hasDistance
          ? calculateDistance(
              userLocation.latitude,
              userLocation.longitude,
              salonLatitude,
              salonLongitude,
            )
          : null;

        return {
          ...item,
          matchingServices,
          calculatedDistance: distance,
        };
      })
      .sort((a, b) => {
        if (b.matchingServices !== a.matchingServices) {
          return b.matchingServices - a.matchingServices;
        }

        if (a.calculatedDistance !== null && b.calculatedDistance !== null) {
          return a.calculatedDistance - b.calculatedDistance;
        }

        if (a.calculatedDistance !== null) return -1;
        if (b.calculatedDistance !== null) return 1;

        return 0;
      });
  }, [salon, salons, userLocation]);

  /*
   * Determine how many salons belong to one row.
   *
   * Mobile:  2 salons per row
   * iPad/Desktop: 3 salons per row
   */
  const getSalonsPerRow = () => {
    return window.innerWidth < 640 ? 2 : 3;
  };

  /*
   * Set the initial visible salons after the sorted list is ready.
   * This means the first visible batch is exactly one row.
   */
  useEffect(() => {
    if (similarSalons.length === 0) {
      setVisibleCount(0);
      return;
    }

    const salonsPerRow = getSalonsPerRow();

    setVisibleCount((currentCount) => {
      if (currentCount > 0) return currentCount;

      return Math.min(salonsPerRow, similarSalons.length);
    });
  }, [similarSalons.length]);

  /*
   * Infinite scroll trigger.
   *
   * Every trigger loads exactly ONE additional row:
   * Mobile       -> +2 salons
   * iPad/Desktop -> +3 salons
   */
  useEffect(() => {
    const trigger = triggerRef.current;

    if (!trigger) return;
    if (visibleCount >= similarSalons.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (!entry.isIntersecting) return;

        const salonsPerRow = getSalonsPerRow();

        setVisibleCount((currentCount) =>
          Math.min(currentCount + salonsPerRow, similarSalons.length),
        );
      },
      {
        root: null,
        rootMargin: "200px",
        threshold: 0,
      },
    );

    observer.observe(trigger);

    return () => {
      observer.disconnect();
    };
  }, [visibleCount, similarSalons.length]);

  if (loading || similarSalons.length === 0) {
    return null;
  }

  const visibleSalons = similarSalons.slice(0, visibleCount);

  return (
    <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:mt-7 sm:rounded-3xl sm:p-5">
      <div className="mb-4">
        <h2 className="text-lg font-bold leading-6 text-slate-900 sm:text-xl">
          Similar Salons
        </h2>

        <p className="mt-1 text-xs text-gray-500 sm:text-sm">
          Explore other salons offering similar services.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {visibleSalons.map((item) => (
          <SalonCard
            key={item._id}
            {...item}
            id={item._id}
            image={item.profileImage}
            distance={
              item.calculatedDistance !== null
                ? `${item.calculatedDistance.toFixed(1)} km`
                : item.distance
            }
          />
        ))}
      </div>

      {/* Infinite scroll trigger */}
      {visibleCount < similarSalons.length && (
        <div ref={triggerRef} className="h-10 w-full" aria-hidden="true" />
      )}
    </section>
  );
}
