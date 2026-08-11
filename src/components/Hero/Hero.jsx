import HeroContent from "./HeroContent/HeroContent";
import HeroImage from "./HeroImage/HeroImage";
import Container from "../../layouts/Container/Container";

export default function Hero() {
  return (
    <section className="pb-5 bg-white">
      <Container>
        <div className="flex flex-col items-center justify-between gap-10 py-8 lg:flex-row lg:gap-14 lg:py-12">
          <HeroContent />
          <HeroImage />
        </div>
      </Container>
    </section>
  );
}
