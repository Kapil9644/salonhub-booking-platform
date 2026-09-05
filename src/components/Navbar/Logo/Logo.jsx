import { Link } from "react-router-dom";
import { Scissors } from "lucide-react";

export default function Logo({ onClick }) {
  return (
    <Link
      to="/"
      onClick={onClick}
      className="inline-flex shrink-0 items-center leading-none"
    >
      <div className="flex items-center gap-3">
        {/* Logo Icon */}
        <div className="relative flex h-[58px] w-[58px] items-center justify-center">
          {/* Soft golden circle */}
          <div className="absolute left-[7px] top-[7px] h-6 w-6 rounded-full border-[5px] border-[#D4B85A]" />

          {/* Scissors */}
          <Scissors
            size={48}
            strokeWidth={2.5}
            className="relative z-10 -rotate-[10deg] text-purple-700"
          />
        </div>

        {/* Brand */}
        <div className="flex flex-col">
          <h1 className="text-[30px] font-extrabold leading-none tracking-tight text-black sm:text-[34px]">
            Rupiva
          </h1>

          <p className="mt-1 text-[9px] font-medium tracking-[0.18em] text-gray-500 sm:text-[10px]">
            BOOK • STYLE • SHINE
          </p>
        </div>
      </div>
    </Link>
  );
}
