import SearchBar from "../SearchBar/SearchBar";
import TrustedCustomers from "../TrustedCustomers/TrustedCustomers";

export default function HeroContent() {
  return (
    <div className="w-full">
      <h1 className="text-2xl font-extrabold leading-none tracking-tight text-slate-900 sm:text-4xl lg:text-4xl">
        Look Great
      </h1>

      <h1 className="text-2xl font-extrabold leading-none tracking-tight text-purple-700 sm:text-3xl lg:text-4xl">
        Book Instantly
      </h1>

      <p className="mt-1.5 max-w-xl text-xs leading-4.5 text-slate-600 sm:text-sm sm:leading-5">
        Find trusted salons near you and book your preferred time slot in
        seconds
      </p>

      <div className="mt-3 w-full">
        <SearchBar />
      </div>

      <div className="mt-2">
        <TrustedCustomers />
      </div>
    </div>
  );
}
