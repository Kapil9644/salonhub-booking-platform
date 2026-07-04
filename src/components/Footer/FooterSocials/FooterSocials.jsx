import { footerLinks } from "../../../data/footerLinks";

export default function FooterSocials() {
  return (
    <div className="flex gap-4 mt-6">
      {footerLinks.socials.map((social) => {
        const Icon = social.icon;

        return (
          <a
            key={social.id}
            href={social.href}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-300 hover:bg-purple-600 hover:scale-110"
          >
            <Icon size={20} />
          </a>
        );
      })}
    </div>
  );
}