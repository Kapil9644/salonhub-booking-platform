import FooterLogo from "./FooterLogo/FooterLogo";
import FooterLinks from "./FooterLinks/FooterLinks";
import FooterSocials from "./FooterSocials/FooterSocials";

export default function Footer() {
  return (
    <footer className="bg-slate-900 pt-20 text-white">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-12 pb-16 md:grid-cols-2 lg:grid-cols-4">

        {/* Logo */}
        <div>
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