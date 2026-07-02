import { navigationLinks } from "../../../data/navigation";

export default function NavigationLinks() {
  return (
    <ul className="flex items-center gap-12">
      {navigationLinks.map((link) => (
        <li key={link.id}>
          <a
            href={link.path}
            className={`relative pb-2 font-medium transition-all duration-200
              ${
                link.title === "Home"
                  ? "text-purple-600"
                  : "text-gray-700 hover:text-purple-600"
              }`}
          >
            {link.title}

            {link.title === "Home" && (
              <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-purple-600"></span>
            )}
          </a>
        </li>
      ))}
    </ul>
  );
}