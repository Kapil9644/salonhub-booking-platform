export default function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="group rounded-2xl border border-gray-200 bg-white p-3 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-purple-500 hover:shadow-lg sm:p-4">
      <div className="mx-auto mb-2.5 flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 transition-all duration-300 group-hover:bg-purple-600">
        <Icon
          size={21}
          className="text-purple-600 transition-all duration-300 group-hover:text-white"
        />
      </div>

      <h3 className="text-sm font-bold leading-5 text-gray-900 sm:text-base">
        {title}
      </h3>

      <p className="mt-1.5 line-clamp-2 text-xs leading-4.5 text-gray-500 sm:text-sm">
        {description}
      </p>
    </div>
  );
}
