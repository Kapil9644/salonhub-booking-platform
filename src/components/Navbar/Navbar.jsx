import { useState } from "react";
import Logo from "./Logo/Logo";
import ActionButtons from "./ActionButtons/ActionButtons";
import DesktopMenu from "./DesktopMenu/DesktopMenu";
import MobileMenuButton from "./MobileMenuButton/MobileMenuButton";
import MobileMenu from "./MobileMenu/MobileMenu";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex min-h-20 w-full max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
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
      <MobileMenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
    </nav>
  );
}
