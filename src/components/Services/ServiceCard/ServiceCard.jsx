export default function ServiceCard({ title, description, icon: Icon }) {
  return (
    <div className="group flex h-[140px] flex-col rounded-xl border border-gray-200 bg-white p-2.5 text-center shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-1 hover:border-purple-500 hover:shadow-md active:border-purple-500 active:ring-1 active:ring-purple-500 sm:h-[145px] sm:p-3">
      <div className="mx-auto mb-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple-100 transition group-hover:bg-purple-600">
        <Icon
          size={20}
          className="text-purple-600 transition group-hover:text-white"
        />
      </div>

      <h3 className="truncate text-sm font-bold leading-4 text-gray-900">
        {title}
      </h3>

      <p className="mt-1 line-clamp-2 min-h-[28px] text-[10px] leading-3.5 text-gray-500">
        {description}
      </p>

      <button className="mt-auto pt-1 text-[11px] font-semibold leading-4 text-purple-600 transition hover:translate-x-0.5">
        Learn More →
      </button>
    </div>
  );
}
