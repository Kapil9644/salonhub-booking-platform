export default function PartnerBenefitCard({
  icon: Icon,
  title,
  description,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition duration-300">
      <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center mb-4">
        <Icon size={28} className="text-purple-600" />
      </div>

      <h3 className="text-xl font-bold text-slate-900 mb-2">
        {title}
      </h3>

      <p className="text-slate-600">
        {description}
      </p>
    </div>
  );
}