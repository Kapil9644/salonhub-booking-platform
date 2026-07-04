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
            className="text-gray-300 hover:text-purple-400 transition-colors"
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
            className="text-gray-300 hover:text-purple-400 transition-colors"
          >
            {link.label}
          </a>
        ))}
      </FooterColumn>

      <FooterColumn title="Support">
        {footerLinks.support.map((link) => (
          <a
            key={link.id}
            href={link.href}
            className="text-gray-300 hover:text-purple-400 transition-colors"
          >
            {link.label}
          </a>
        ))}
      </FooterColumn>
    </>
  );
}