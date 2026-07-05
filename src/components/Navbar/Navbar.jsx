import Logo from "./Logo/Logo";
import ActionButtons from "./ActionButtons/ActionButtons";
import { useState } from "react";
import DesktopMenu from "./DesktopMenu/DesktopMenu";
import MobileMenuButton from "./MobileMenuButton/MobileMenuButton";
import MobileMenu from "./MobileMenu/MobileMenu"; 

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto flex h-24 max-w-[1400px] items-center justify-between px-12">
        <Logo />

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
      <MobileMenu
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />
    </nav>
  );
}