import type { Metadata } from "next";
import { Box } from "@mantine/core";
import classes from "./layout.module.css";

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
    <Box data-app-shell="alaia" className={classes.root}>
      {children}
    </Box>
  );
}