import HeroContent from "./HeroContent/HeroContent";
import HeroImage from "./HeroImage/HeroImage";
import Container from "../../layouts/Container/Container";

export default function Hero() {
  return (
    <section className="bg-white">
      <Container>
        <div className="flex flex-col items-center justify-between gap-4 py-4 sm:gap-5 sm:py-5 md:flex-row md:gap-5 lg:gap-6 lg:py-5">
          <div className="w-full lg:w-[50%]">
            <HeroContent />
          </div>
          <div className="w-full lg:w-[50%]">
            <HeroImage />
          </div>
        </div>
      </Container>
    </section>
  );
}
