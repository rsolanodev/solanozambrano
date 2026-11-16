export type ProfileSlug = "albany" | "ruben" | "alaia" | "lucia" | "coco";

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
    slug: "albany",
    name: "Albany",
    initials: "AL",
    accent: "#FFCA24",
    accentSoft: "#FFF1BF",
    icon: "A",
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
    slug: "lucia",
    name: "Lucía",
    initials: "LC",
    accent: "#D48FC2",
    accentSoft: "#F4E6EE",
    icon: "L",
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