import FooterLogo from "./FooterLogo/FooterLogo";
import FooterLinks from "./FooterLinks/FooterLinks";
import FooterSocials from "./FooterSocials/FooterSocials";

export default function Footer() {
  return (
    <footer className="bg-slate-900 pt-6 text-white sm:pt-7 lg:pt-8">
      <div className="mx-auto grid w-full max-w-[1400px] grid-cols-2 gap-4 px-4 pb-6 sm:gap-5 sm:px-6 sm:pb-7 lg:grid-cols-4 lg:gap-6 lg:px-8 lg:pb-8">
        {/* Logo */}
        <div className="col-span-2 lg:col-span-1">
          <FooterLogo />

          <FooterSocials />
        </div>

        {/* Links */}
        <FooterLinks />
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-700 py-3">
        <p className="text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Rupiva. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
