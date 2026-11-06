import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mundo de Alaia",
  description: "Animales, sonidos y juegos para Alaia.",
};

export default function AlaiaLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      data-profile-theme="alaia"
      className="min-h-dvh bg-background text-text-primary"
    >
      {children}
    </div>
  );
}
