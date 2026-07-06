import Navbar from "../../components/Navbar/Navbar";
import Hero from "../../components/Hero/Hero";
import Services from "../../components/Services/Services";
import FeaturedSalons from "../../components/FeaturedSalons/FeaturedSalons";
import WhyChooseUs from "../../components/WhyChooseUs/WhyChooseUs";
import Testimonials from "../../components/Testimonials/Testimonials";
import HowItWorks from "../../components/HowItWorks/HowItWorks";
import PartnerSection from "../../components/PartnerSection/PartnerSection";
import Footer from "../../components/Footer/Footer";

export default function Home() {
  return (
    <>
      
      <Hero />
      <Services />
      <FeaturedSalons />
      <WhyChooseUs />
      <Testimonials />
      <HowItWorks />
      <PartnerSection />
      
    </>
  );
}