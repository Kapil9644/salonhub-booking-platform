import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
} from "react-icons/fa6";

export const footerLinks = {
  quickLinks: [
    { id: 1, label: "Home", href: "/" },
    { id: 2, label: "Salons", href: "/salons" },
    { id: 3, label: "Services", href: "/services" },
    { id: 4, label: "Offers", href: "/offers" },
  ],

  company: [
    { id: 1, label: "About Us", href: "/about" },
    { id: 2, label: "Become Partner", href: "/partner" },
    { id: 3, label: "Contact", href: "/contact" },
  ],

  support: [
    { id: 1, label: "FAQs", href: "/faqs" },
    { id: 2, label: "Privacy Policy", href: "/privacy" },
    { id: 3, label: "Terms & Conditions", href: "/terms" },
  ],

  socials: [
    {
      id: 1,
      icon: FaFacebookF,
      href: "#",
    },
    {
      id: 2,
      icon: FaInstagram,
      href: "#",
    },
    {
      id: 3,
      icon: FaLinkedinIn,
      href: "#",
    },
    {
      id: 4,
      icon: FaXTwitter,
      href: "#",
    },
  ],
};