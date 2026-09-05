export default function PartnerBenefitCard({ icon: Icon, title, description }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition duration-300 hover:shadow-md sm:p-4">
      <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-purple-100">
        <Icon size={18} className="text-purple-600" />
      </div>

      <h3 className="mb-1 text-sm font-bold leading-5 text-slate-900 sm:text-base">
        {title}
      </h3>

      <p className="line-clamp-2 text-xs leading-4.5 text-slate-600 sm:text-sm">
        {description}
      </p>
    </div>
  );
}
