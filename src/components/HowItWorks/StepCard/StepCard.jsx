export default function StepCard({ icon: Icon, title, description }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-3 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-purple-500 hover:shadow-lg sm:p-4">
      <div className="mx-auto mb-2.5 flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
        <Icon size={21} className="text-purple-600" />
      </div>

      <h3 className="mb-1.5 text-sm font-bold leading-5 text-gray-900 sm:text-base">
        {title}
      </h3>

      <p className="line-clamp-2 text-xs leading-4.5 text-gray-600 sm:text-sm">
        {description}
      </p>
    </div>
  );
}
