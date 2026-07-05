import heroSalon from "../../../assets/images/hero-salon.jpg";

export default function HeroImage() {
  return (
    <div className="w-full lg:w-1/2 flex justify-center">
      <img
        src={heroSalon}
        alt="Luxury Salon"
        className="w-full max-w-md lg:max-w-2xl h-auto rounded-3xl object-cover shadow-2xl transition-transform duration-300 hover:scale-[1.02]"
      />
    </div>
  );
}