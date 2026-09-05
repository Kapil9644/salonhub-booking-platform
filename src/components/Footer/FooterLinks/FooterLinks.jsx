import { footerLinks } from "../../../data/footerLinks";
import FooterColumn from "../FooterColumn/FooterColumn";

export default function FooterLinks() {
  return (
    <>
      <FooterColumn title="Quick Links">
        {footerLinks.quickLinks.map((link) => (
          <a
            key={link.id}
            href={link.href}
            className="text-xs text-gray-300 transition-colors hover:text-purple-400 sm:text-sm"
          >
            {link.label}
          </a>
        ))}
      </FooterColumn>

      <FooterColumn title="Company">
        {footerLinks.company.map((link) => (
          <a
            key={link.id}
            href={link.href}
            className="text-xs text-gray-300 transition-colors hover:text-purple-400 sm:text-sm"
          >
            {link.label}
          </a>
        ))}
      </FooterColumn>

      <div className="hidden sm:block">
        <FooterColumn title="Support">
          {footerLinks.support.map((link) => (
            <a
              key={link.id}
              href={link.href}
              className="text-xs text-gray-300 transition-colors hover:text-purple-400 sm:text-sm"
            >
              {link.label}
            </a>
          ))}
        </FooterColumn>
      </div>
    </>
  );
}
