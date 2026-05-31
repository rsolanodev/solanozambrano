export type ProfileSlug = "hogar" | "albany" | "ruben" | "alaia" | "coco";

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
    slug: "albany",
    name: "Albany",
    initials: "AL",
    href: "/albany",
    theme: "albany",
    designDoc: "DESIGN_ALBANY.md",
    accent: "#FF8AA5",
    accentSoft: "#FFE0E8",
    icon: "A",
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
