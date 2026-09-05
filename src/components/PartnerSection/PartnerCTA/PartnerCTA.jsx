export default function PartnerCTA() {
  const handleBecomePartner = () => {
    window.open("/salon-owner", "_blank", "noopener,noreferrer");
  };

  return (
    <div className="mt-4">
      <button
        onClick={handleBecomePartner}
        className="rounded-lg bg-purple-600 px-5 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-purple-700 hover:shadow-md"
      >
        Become a Partner
      </button>
    </div>
  );
}
