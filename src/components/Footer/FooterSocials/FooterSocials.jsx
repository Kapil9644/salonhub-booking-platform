import { footerLinks } from "../../../data/footerLinks";

export default function FooterSocials() {
  return (
    <div className="mt-3 flex gap-2.5">
      {footerLinks.socials.map((social) => {
        const Icon = social.icon;

        return (
          <a
            key={social.id}
            href={social.href}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-300 hover:scale-105 hover:bg-purple-600"
          >
            <Icon size={16} />
          </a>
        );
      })}
    </div>
  );
}
