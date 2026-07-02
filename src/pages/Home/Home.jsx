import Navbar from "../../components/Navbar/Navbar";
import Hero from "../../components/Hero/Hero";
import Services from "../../components/Services/Services";
import FeaturedSalons from "../../components/FeaturedSalons/FeaturedSalons";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Services />
      <FeaturedSalons />
    </>
  );
}