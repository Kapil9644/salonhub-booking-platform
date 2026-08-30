import { useEffect, useState } from "react";

import SalonCard from "../../common/SalonCard/SalonCard";
import { getPublicSalons } from "../../../services/salonService";

export default function SalonGrid() {
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFeaturedSalons = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getPublicSalons();

        setSalons((data.salons || []).slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch featured salons:", error);

        setError(
          error.response?.data?.message || "Failed to load featured salons.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedSalons();
  }, []);

  if (loading) {
    return (
      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-[480px] animate-pulse rounded-3xl border border-gray-200 bg-gray-100"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 rounded-3xl border border-red-200 bg-red-50 px-6 py-10 text-center">
        <p className="font-medium text-red-600">{error}</p>
      </div>
    );
  }

  if (salons.length === 0) {
    return (
      <div className="mt-8 rounded-3xl border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center">
        <p className="font-medium text-gray-500">
          No featured salons available right now.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
      {salons.map((salon) => (
        <SalonCard
          key={salon._id}
          {...salon}
          id={salon._id}
          image={salon.profileImage}
        />
      ))}
    </div>
  );
}
