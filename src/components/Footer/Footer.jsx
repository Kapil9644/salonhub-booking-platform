import FooterLogo from "./FooterLogo/FooterLogo";
import FooterLinks from "./FooterLinks/FooterLinks";
import FooterSocials from "./FooterSocials/FooterSocials";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-slate-900 pt-10 text-white lg:pt-20">
      <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-8 px-6 pb-10 sm:px-8 md:gap-12 md:px-12 md:pb-16 lg:grid-cols-4">
        {/* Logo */}
        <div className="col-span-2 lg:col-span-1">
          <FooterLogo />

          <FooterSocials />
        </div>

        {/* Links */}
        <FooterLinks />
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-700 py-6">
        <p className="text-center text-gray-400">
          © {new Date().getFullYear()} SalonHub. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
