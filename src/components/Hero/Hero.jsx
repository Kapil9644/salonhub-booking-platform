import HeroContent from "./HeroContent/HeroContent";
import HeroImage from "./HeroImage/HeroImage";

export default function Hero() {
  return (
    <section className="bg-white">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-12 py-16">
        <HeroContent />
        <HeroImage />
      </div>
    </section>
  );
}