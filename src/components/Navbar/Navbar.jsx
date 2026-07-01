import { navigationLinks } from "../../constants/navigation";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* Logo */}
        <h1 className="text-2xl font-bold text-purple-600">
          SalonHub
        </h1>

        {/* Navigation Links */}
        <ul className="flex gap-8">
          {navigationLinks.map((link) => (
            <li key={link.id}>
              <a
                href={link.path}
                className="text-gray-700 hover:text-purple-600 transition-colors"
              >
                {link.title}
              </a>
            </li>
          ))}
        </ul>

      </div>
    </nav>
  );
}