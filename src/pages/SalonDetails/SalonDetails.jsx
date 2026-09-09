import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useLocation } from "../../context/LocationContext";
import Container from "../../layouts/Container/Container";
import HeroSection from "../../components/SalonDetails/HeroSection";
import AboutSection from "../../components/SalonDetails/AboutSection";
import WorkingHours from "../../components/SalonDetails/WorkingHours";
import BookingCard from "../../components/SalonDetails/BookingCard";
import ServicesSection from "../../components/SalonDetails/ServicesSection";
import { calculateDistance } from "../../utils/distance";
import { getPublicSalonDetails } from "../../services/salonService";
import ReviewsSection from "../../components/SalonDetails/ReviewsSection";
import ContactSection from "../../components/SalonDetails/ContactSection";
import PoliciesSection from "../../components/SalonDetails/PoliciesSection";
import MapSection from "../../components/SalonDetails/MapSection";
import SimilarSalons from "../../components/SalonDetails/SimilarSalons";

export default function SalonDetails() {
  const { id } = useParams();
  const { location: userLocation } = useLocation();

  const [salon, setSalon] = useState(null);

  // Multiple selected services
  const [selectedServices, setSelectedServices] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSalonDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getPublicSalonDetails(id);

        if (!data.success || !data.salon) {
          throw new Error("Salon details not found.");
        }

        setSalon(data.salon);
      } catch (error) {
        console.error("Failed to fetch salon details:", error);

        setError(
          error.response?.data?.message ||
            error.message ||
            "Failed to load salon details.",
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSalonDetails();
    }
  }, [id]);

  const salonLatitude = salon?.location?.latitude;
  const salonLongitude = salon?.location?.longitude;

  const hasUserLocation =
    userLocation?.latitude != null && userLocation?.longitude != null;

  const hasSalonLocation = salonLatitude != null && salonLongitude != null;

  const salonDistance =
    hasUserLocation && hasSalonLocation
      ? calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          salonLatitude,
          salonLongitude,
        )
      : null;

  if (loading) {
    return (
      <Container>
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-lg font-semibold text-gray-500">
            Loading salon details...
          </p>
        </div>
      </Container>
    );
  }

  if (error || !salon) {
    return (
      <Container>
        <div className="py-20 text-center">
          <h1 className="text-3xl font-bold text-slate-900">Salon not found</h1>

          <p className="mt-3 text-gray-500">
            {error || "Unable to load salon details."}
          </p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <HeroSection
        salon={salon}
        userLocation={userLocation}
        distance={salonDistance}
      />
      <div className="mt-3 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AboutSection about={salon.about} />

          <ServicesSection
            services={salon.services || []}
            selectedServices={selectedServices}
            setSelectedServices={setSelectedServices}
          />

          <WorkingHours workingHours={salon.workingHours} />
          <ReviewsSection salonId={salon._id} />
          <PoliciesSection />
          <MapSection salon={salon} />
          <ContactSection salon={salon} />
          <SimilarSalons salon={salon} />
        </div>

        <div>
          <BookingCard salon={salon} selectedServices={selectedServices} />
        </div>
      </div>
    </Container>
  );
}
