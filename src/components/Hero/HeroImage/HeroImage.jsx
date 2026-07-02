import heroSalon from "../../../assets/images/hero-salon.jpg";

export default function HeroImage() {
  return (
    <div className="relative">
      <img
        src={heroSalon}
        alt="Luxury Salon"
        className="h-[550px] w-[650px] rounded-3xl object-cover shadow-2xl transition duration-300 hover:scale-[1.02]"
      />
    </div>
  );
}