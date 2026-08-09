import { Link } from "react-router-dom";

export default function Logo({ onClick }) {
  return (
    <Link
      to="/"
      onClick={onClick}
      className="ml-4 inline-block shrink-0 leading-none sm:ml-6 lg:ml-8"
    >
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          SalonHub
        </h1>

        <p className="mt-1 text-[10px] font-medium tracking-wide text-gray-500 sm:text-xs">
          Book • Style • Shine
        </p>
      </div>
    </Link>
  );
}
