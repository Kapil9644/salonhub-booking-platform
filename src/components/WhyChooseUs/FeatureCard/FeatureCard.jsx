export default function FeatureCard({
  icon: Icon,
  title,
  description,
}) {
  return (
    <div className="group rounded-3xl bg-white p-8 text-center shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-purple-100 transition-all duration-300 group-hover:bg-purple-600">
        <Icon
          size={36}
          className="text-purple-600 transition-all duration-300 group-hover:text-white"
        />
      </div>

      <h3 className="text-2xl font-bold text-gray-900">
        {title}
      </h3>

      <p className="mt-4 text-gray-500">
        {description}
      </p>
    </div>
  );
}