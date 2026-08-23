export default function PartnerCTA() {
  const handleBecomePartner = () => {
    window.open("/salon-owner", "_blank", "noopener,noreferrer");
  };

  return (
    <div className="mt-8">
      <button
        onClick={handleBecomePartner}
        className="rounded-2xl bg-purple-600 px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:bg-purple-700 hover:shadow-xl"
      >
        Become a Partner
      </button>
    </div>
  );
}
