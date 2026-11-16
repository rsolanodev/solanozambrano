export type ProfileSlug = "hogar" | "ruben" | "alaia" | "coco";

export type Profile = {
  slug: ProfileSlug;
  name: string;
  initials: string;
  href?: string;
  theme: "family" | ProfileSlug;
  designDoc?: string;
  accent: string;
  accentSoft: string;
  icon: string;
};

export const profiles: Profile[] = [
  {
    slug: "hogar",
    name: "Hogar",
    initials: "HG",
    theme: "family",
    accent: "#FFB84D",
    accentSoft: "#FFF1C8",
    icon: "H",
  },

  {
    slug: "ruben",
    name: "Rubén",
    initials: "RB",
    theme: "ruben",
    accent: "#4A90D9",
    accentSoft: "#DDEEFF",
    icon: "R",
  },
  {
    slug: "alaia",
    name: "Alaia",
    initials: "AI",
    href: "/alaia",
    theme: "alaia",
    accent: "#9F7AEA",
    accentSoft: "#EEE7FF",
    icon: "A",
  },
  {
    slug: "coco",
    name: "Coco",
    initials: "CO",
    theme: "coco",
    accent: "#5BC8A8",
    accentSoft: "#DDF7EF",
    icon: "C",
  },
];
