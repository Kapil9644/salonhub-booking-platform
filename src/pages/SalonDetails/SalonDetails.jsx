import { useState } from "react";
import { useParams } from "react-router-dom";
import Container from "../../layouts/Container/Container";
import { salons } from "../../data/salons";
import HeroSection from "../../components/SalonDetails/HeroSection";
import AboutSection from "../../components/SalonDetails/AboutSection";
import WorkingHours from "../../components/SalonDetails/WorkingHours";
import BookingCard from "../../components/SalonDetails/BookingCard";
import ServicesSection from "../../components/SalonDetails/ServicesSection";

export default function SalonDetails() {
  const { id } = useParams();
  const salon = salons.find((salon) => salon.id === Number(id));
  const [selectedService, setSelectedService] = useState(null);

  if (!salon) {
    return (
      <Container>
        <div className="py-20 text-center">
          <h1 className="text-3xl font-bold">Salon not found</h1>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <HeroSection salon={salon} />

      <div className="mt-12 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AboutSection about={salon.about} />

          <ServicesSection
            services={salon.services}
            selectedService={selectedService}
            setSelectedService={setSelectedService}
          />

          <WorkingHours workingHours={salon.workingHours} />
        </div>

        <div>
          <BookingCard salon={salon} selectedService={selectedService} />
        </div>
      </div>
    </Container>
  );
}
