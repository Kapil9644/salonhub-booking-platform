import partnerImage from "../../../assets/images/hero-salon.jpg";

export default function PartnerImage() {
  return (
    <div className="flex w-full justify-center">
      <img
        src={partnerImage}
        alt="Salon Partner"
        className="h-40 w-full max-w-md rounded-2xl object-cover shadow-lg sm:h-48 md:h-52 lg:h-56"
      />
    </div>
  );
}
