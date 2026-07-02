import Logo from "./Logo/Logo";
import NavigationLinks from "./NavigationLinks/NavigationLinks";
import ActionButtons from "./ActionButtons/ActionButtons";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto flex h-24 max-w-[1400px] items-center justify-between px-12">
        <Logo />

        <NavigationLinks />

        <ActionButtons />
      </div>
    </nav>
  );
}