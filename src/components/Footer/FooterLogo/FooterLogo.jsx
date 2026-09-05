import { Scissors } from "lucide-react";
import { Link } from "react-router-dom";

export default function FooterLogo() {
  return (
    <div>
      <Link to="/" className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-600">
          <Scissors className="text-white" size={18} />
        </div>

        <h2 className="text-2xl font-bold text-white">Rupiva</h2>
      </Link>

      <p className="mt-3 max-w-sm text-xs leading-5 text-gray-300 sm:text-sm">
        Rupiva connects customers with trusted salons, making beauty and
        grooming appointments simple, fast and convenient.
      </p>
    </div>
  );
}
