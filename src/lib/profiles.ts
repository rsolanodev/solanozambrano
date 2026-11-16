export type ProfileSlug = "hogar" | "ruben" | "alaia" | "coco";

export type Profile = {
  slug: ProfileSlug;
  name: string;
  initials: string;
  href?: string;
  accent: string;
  accentSoft: string;
  icon: string;
};

export const profiles: Profile[] = [
  {
    slug: "hogar",
    name: "Hogar",
    initials: "HG",
    accent: "#FFCA24",
    accentSoft: "#FFF1BF",
    icon: "H",
  },
  {
    slug: "ruben",
    name: "Rubén",
    initials: "RB",
    accent: "#4A8ACA",
    accentSoft: "#E0EDF9",
    icon: "R",
  },
  {
    slug: "alaia",
    name: "Alaia",
    initials: "AI",
    href: "/alaia",
    accent: "#FF5833",
    accentSoft: "#FFE3DA",
    icon: "A",
  },
  {
    slug: "coco",
    name: "Coco",
    initials: "CO",
    accent: "#60AB59",
    accentSoft: "#E2F2DF",
    icon: "C",
  },
];