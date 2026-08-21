import SearchBar from "../SearchBar/SearchBar";
import TrustedCustomers from "../TrustedCustomers/TrustedCustomers";

export default function HeroContent() {
  return (
    <div>
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-black-400">
        Look Great
      </h1>

      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-purple-700">
        Book Instantly
      </h1>

      <p className="mt-4 text-base sm:text-lg leading-7 sm:leading-8 text-slate-600">
        Find trusted salons near you and book your preferred time slot in
        seconds
      </p>

      <div className="mt-4">
        <SearchBar />
      </div>

      <div className="mt-5">
        <TrustedCustomers />
      </div>
    </div>
  );
}
