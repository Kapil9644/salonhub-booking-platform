import HeroContent from "./HeroContent/HeroContent";
import HeroImage from "./HeroImage/HeroImage";
import Container from "../../layouts/Container/Container"; 


export default function Hero() {
  return (
    <section className="bg-white">
      <Container>
        <div className="flex flex-col lg:flex-row items-center justify-between gap-20 py-10 lg:py-16">
          <HeroContent />
          <HeroImage />
        </div>
      </Container>
    </section>
  );
}