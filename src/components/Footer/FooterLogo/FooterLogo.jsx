import { Scissors } from "lucide-react";

export default function FooterLogo() {
  return (
    <div>
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-600">
          <Scissors className="text-white" size={24} />
        </div>

        <h2 className="text-3xl font-bold text-white">
          SalonHub
        </h2>
      </div>

      <p className="mt-5 max-w-sm leading-7 text-gray-300">
        SalonHub connects customers with trusted salons,
        making beauty and grooming appointments simple,
        fast and convenient.
      </p>
    </div>
  );
}