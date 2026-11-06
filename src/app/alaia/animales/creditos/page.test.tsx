import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import AnimalCreditsPage from "@/app/alaia/animales/creditos/page";

const animalNames = [
  "Vaca",
  "Oveja",
  "Caballo",
  "Cerdo",
  "Gallo",
  "Pato",
  "Perro",
  "Gato",
  "León",
  "Elefante",
  "Mono",
  "Rana",
];

describe("AnimalCreditsPage", () => {
  it("lists all animals with video and audio credits", () => {
    render(<AnimalCreditsPage />);

    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(12);
    for (const name of animalNames) {
      expect(screen.getByRole("heading", { name })).toBeInTheDocument();
    }

    const videoLink = screen.getByRole("link", {
      name: /video de vaca en pexels/i,
    });
    expect(videoLink).toHaveAttribute("target", "_blank");
    expect(videoLink).toHaveAttribute("rel", "noreferrer");

    const audioLink = screen.getByRole("link", {
      name: /audio de vaca en wikimedia commons/i,
    });
    expect(audioLink).toHaveAttribute("target", "_blank");
    expect(audioLink).toHaveAttribute("rel", "noreferrer");
    expect(screen.getAllByText(/CC BY-SA 3\.0/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Secretlondon/).length).toBeGreaterThan(0);
  });

  it("marks every external source link as external", () => {
    render(<AnimalCreditsPage />);

    const externalLinks = screen
      .getAllByRole("link")
      .filter((link) => link.getAttribute("href")?.startsWith("https://"));

    expect(externalLinks.length).toBe(24);
    for (const link of externalLinks) {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noreferrer");
    }
  });

  it("links back to Animales", () => {
    render(<AnimalCreditsPage />);

    const back = screen.getByRole("link", { name: "Volver a Animales" });
    expect(back.getAttribute("href")).toBe("/alaia/animales");
  });
});
