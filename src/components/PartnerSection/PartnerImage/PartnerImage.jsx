import partnerImage from "../../../assets/images/hero-salon.jpg";

export default function PartnerImage() {
  return (
    <div className="flex justify-center">
      <img
        src={partnerImage}
        alt="Salon Partner"
        className="w-full max-w-lg rounded-3xl shadow-2xl object-cover"
      />
    </div>
  );
}