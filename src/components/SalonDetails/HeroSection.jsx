import { MapPin, Star } from "lucide-react";

export default function HeroSection({ salon }) {
  return (
    <section>
      <img
        src={salon.image}
        alt={salon.name}
        className="h-[420px] w-full rounded-3xl object-cover"
      />

      <div className="mt-8">
        <h1 className="text-4xl font-bold">{salon.name}</h1>

        <div className="mt-4 flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <Star className="fill-yellow-400 text-yellow-400" size={20} />

            <span className="font-semibold">{salon.rating}</span>

            <span className="text-gray-500">({salon.reviews} reviews)</span>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <MapPin size={18} />
            {salon.location}
          </div>

          <span
            className={`rounded-full px-3 py-1 text-sm font-semibold text-white ${
              salon.isOpen ? "bg-green-600" : "bg-red-500"
            }`}
          >
            {salon.isOpen ? "Open Now" : "Closed"}
          </span>
        </div>

        <h2 className="mt-6 text-3xl font-bold text-purple-600">
          {salon.priceLabel}
        </h2>
      </div>
    </section>
  );
}
