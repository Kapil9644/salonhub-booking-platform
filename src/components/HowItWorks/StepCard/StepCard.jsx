export default function StepCard({
  icon: Icon,
  title,
  description,
}) {
  return (
    <div className="rounded-3xl bg-white p-8 text-center shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-purple-100">
        <Icon size={40} className="text-purple-600" />
      </div>

      <h3 className="mb-4 text-2xl font-bold text-gray-900">
        {title}
      </h3>

      <p className="leading-7 text-gray-600">
        {description}
      </p>
    </div>
  );
}