import type { Metadata } from "next";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "./globals.css";
import "@/styles/design-tokens.css";
import { theme } from "@/theme";

export const metadata: Metadata = {
  title: "SolanoZambrano - Calendario de Tensión",
  description:
    "Registra y visualiza tu tensión arterial y medicación diaria durante el embarazo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <ColorSchemeScript forceColorScheme="light" />
      </head>
      <body>
        <MantineProvider theme={theme} forceColorScheme="light">
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}