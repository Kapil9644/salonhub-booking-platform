import { useEffect, useMemo, useState } from "react";
import { getPublicSalons } from "../../services/salonService";
import { useLocation } from "../../context/LocationContext";
import { calculateDistance } from "../../utils/distance";
import SalonCard from "../common/SalonCard/SalonCard";

export default function SimilarSalons({ salon }) {
  const { location: userLocation } = useLocation();
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);

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
      })
      .slice(0, 4);
  }, [salon, salons, userLocation]);

  if (loading || similarSalons.length === 0) {
    return null;
  }

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

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {similarSalons.map((item) => (
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
    </section>
  );
}
