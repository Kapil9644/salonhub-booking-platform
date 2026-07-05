import SearchBar from "../SearchBar/SearchBar";
import TrustedCustomers from "../TrustedCustomers/TrustedCustomers";

export default function HeroContent() {
  return (
    <div className="w-full max-w-xl text-center lg:text-left">
      <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight text-slate-900">
        Look Great
      </h1>

      <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight text-purple-600">
        Book Instantly
      </h1>

      <p className="mt-6 text-base sm:text-lg leading-7 sm:leading-8 text-slate-600">
        Find trusted salons near you and book your preferred
        time slot in seconds
      </p>

      <div className="mt-8 lg:mt-10">
        <SearchBar />
      </div>

      <div className="mt-6 lg:mt-8">
        <TrustedCustomers />
      </div>
    </div>
  );
}