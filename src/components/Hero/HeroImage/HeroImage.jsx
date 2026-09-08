import heroSalon from "../../../assets/images/hero-salon.jpg";

export default function HeroImage() {
  return (
    <div className="flex w-full justify-end">
      <div className="w-full max-w-md overflow-hidden rounded-2xl shadow-lg">
        <img
          src={heroSalon}
          alt="Luxury Salon"
          className="h-40 w-full object-cover transition-transform duration-300 hover:scale-[1.02] sm:h-46 md:h-52 lg:h-56"
        />
      </div>
    </div>
  );
}
