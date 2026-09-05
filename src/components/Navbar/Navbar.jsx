import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Logo from "./Logo/Logo";
import ActionButtons from "./ActionButtons/ActionButtons";
import DesktopMenu from "./DesktopMenu/DesktopMenu";
import MobileMenuButton from "./MobileMenuButton/MobileMenuButton";
import MobileMenu from "./MobileMenu/MobileMenu";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();

  return (
    <nav className="sticky top-0 z-50 w-full bg-white px-3 py-3 sm:px-5 sm:py-4 lg:px-8 lg:py-5">
      <div className="mx-auto flex min-h-[76px] w-full max-w-[1280px] items-center justify-between rounded-[24px] border border-[#a98cf8] bg-white px-4 shadow-[0_10px_30px_rgba(15,23,42,0.12)] sm:min-h-[84px] sm:rounded-[28px] sm:px-6 lg:px-7">
        {/* Logo */}
        <Logo onClick={() => setIsMenuOpen(false)} />

        {/* Desktop Navigation */}
        <DesktopMenu />

        {/* Desktop Action Buttons */}
        <div className="hidden lg:flex">
          <ActionButtons />
        </div>

        {/* Mobile Menu Button */}
        <MobileMenuButton
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
        />
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        key={`${isMenuOpen}-${user?.id ?? "guest"}`}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />
    </nav>
  );
}
