import {
  Scissors,
  Brush,
  Sparkles,
  Hand,
  Paintbrush,
  UserRound,
} from "lucide-react";

import { LiaPenSolid } from "react-icons/lia";

export const services = [
  {
    id: 1,
    title: "Haircut",
    description: "Professional haircut and grooming",
    detailedDescription:
      "Get a clean, stylish haircut tailored to your face shape, hair type and preferred look.",
    highlights: ["Hair consultation", "Professional haircut", "Neat finishing"],
    duration: "30–45 min",
    bestFor: "Everyday grooming",
    icon: Scissors,
  },

  {
    id: 2,
    title: "Beard Trim",
    description: "Sharp beard styling and shaping",
    detailedDescription:
      "Keep your beard clean and well-shaped with professional trimming, detailing and finishing.",
    highlights: ["Beard shaping", "Length trimming", "Edge detailing"],
    duration: "15–30 min",
    bestFor: "Regular beard grooming",
    icon: UserRound,
  },

  {
    id: 3,
    title: "Hair Color",
    description: "Professional hair coloring",
    detailedDescription:
      "Refresh your look with professional hair coloring options designed for your preferred shade and style.",
    highlights: [
      "Color consultation",
      "Professional application",
      "Finishing & styling",
    ],
    duration: "60–120 min",
    bestFor: "Color refresh & new looks",
    icon: Paintbrush,
  },

  {
    id: 4,
    title: "Facial",
    description: "Refreshing skincare and facial care",
    detailedDescription:
      "Enjoy a relaxing facial treatment designed to cleanse, refresh and leave your skin looking healthy and glowing.",
    highlights: ["Deep cleansing", "Facial treatment", "Relaxing finish"],
    duration: "45–60 min",
    bestFor: "Skin refresh & relaxation",
    icon: Sparkles,
  },

  {
    id: 5,
    title: "Manicure",
    description: "Complete hand and nail care",
    detailedDescription:
      "Give your hands and nails a clean, polished look with professional manicure and nail-care treatment.",
    highlights: ["Nail shaping", "Cuticle care", "Hand care"],
    duration: "30–45 min",
    bestFor: "Hand & nail grooming",
    icon: Hand,
  },

  {
    id: 6,
    title: "Styling",
    description: "Party, event and wedding styling",
    detailedDescription:
      "Create a polished look for parties, weddings and special occasions with professional styling tailored to your outfit and event.",
    highlights: [
      "Style consultation",
      "Professional styling",
      "Event-ready finishing",
    ],
    duration: "45–90 min",
    bestFor: "Events & special occasions",
    icon: Brush,
  },

  {
    id: 7,
    title: "Massage",
    description: "Relaxing massage and wellness care",
    detailedDescription:
      "Take time to relax with a professional massage experience focused on comfort, relaxation and overall wellness.",
    highlights: [
      "Relaxing massage",
      "Comfort-focused session",
      "Wellness experience",
    ],
    duration: "30–60 min",
    bestFor: "Relaxation & wellness",
    icon: Hand,
  },

  {
    id: 8,
    title: "Eyelash Extensions",
    description: "Beautiful and defined eyelash styling",
    detailedDescription:
      "Enhance your eye look with professionally applied eyelash extensions for a fuller and more defined appearance.",
    highlights: [
      "Lash consultation",
      "Professional application",
      "Detailed finishing",
    ],
    duration: "60–120 min",
    bestFor: "Enhanced eye looks",
    icon: Sparkles,
  },

  {
    id: 9,
    title: "Lip & Eyebrow Tinting",
    description: "Natural-looking lip and brow enhancement",
    detailedDescription:
      "Enhance the appearance of your lips and eyebrows with a subtle tint designed to complement your natural features.",
    highlights: [
      "Shade selection",
      "Precise application",
      "Natural-looking finish",
    ],
    duration: "30–45 min",
    bestFor: "Natural beauty enhancement",
    icon: LiaPenSolid,
  },

  {
    id: 10,
    title: "Nail Art",
    description: "Creative nail art and designs",
    detailedDescription:
      "Add personality to your nails with creative designs, patterns and decorative finishes for everyday or special occasions.",
    highlights: [
      "Design selection",
      "Creative nail detailing",
      "Finishing & styling",
    ],
    duration: "30–90 min",
    bestFor: "Creative & occasion looks",
    icon: Paintbrush,
  },
];
