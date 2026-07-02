import SearchBar from "../SearchBar/SearchBar";
import TrustedCustomers from "../TrustedCustomers/TrustedCustomers";

export default function HeroContent() {
  return (
    <div className="max-w-xl">
      <h1 className="text-6xl font-extrabold leading-tight text-gray-900">
        Look Great.
      </h1>

      <h1 className="text-6xl font-extrabold leading-tight text-purple-600">
        Book Instantly.
      </h1>

      <p className="mt-6 text-lg leading-8 text-gray-600">
        Find trusted salons near you and book your preferred
        time slot in seconds.
      </p>

      <div className="mt-10">
        <SearchBar />
      </div>

      <div className="mt-8">
        <TrustedCustomers />
      </div>
    </div>
  );
}