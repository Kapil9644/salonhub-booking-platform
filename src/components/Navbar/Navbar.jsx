import { Menu, X, Scissors } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <Scissors className="text-purple-600" size={28} />
          <h1 className="text-2xl font-bold text-purple-600">
            SalonHub
          </h1>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-8 text-gray-700 font-medium">
          <li className="hover:text-purple-600 cursor-pointer">Home</li>
          <li className="hover:text-purple-600 cursor-pointer">Salons</li>
          <li className="hover:text-purple-600 cursor-pointer">Services</li>
          <li className="hover:text-purple-600 cursor-pointer">
            Become a Partner
          </li>
        </ul>

        {/* Desktop Buttons */}
        <div className="hidden md:flex gap-3">
          <button className="px-5 py-2 border border-purple-600 rounded-lg text-purple-600 hover:bg-purple-50">
            Login
          </button>

          <button className="px-5 py-2 bg-purple-600 rounded-lg text-white hover:bg-purple-700">
            Sign Up
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t">

          <ul className="flex flex-col p-5 gap-5 font-medium">

            <li>Home</li>

            <li>Salons</li>

            <li>Services</li>

            <li>Become a Partner</li>

            <button className="border rounded-lg py-2 text-purple-600">
              Login
            </button>

            <button className="bg-purple-600 rounded-lg py-2 text-white">
              Sign Up
            </button>

          </ul>

        </div>
      )}
    </nav>
  );
}