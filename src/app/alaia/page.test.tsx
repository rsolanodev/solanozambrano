import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import AlaiaLauncherPage from "@/app/alaia/page";

describe("AlaiaLauncherPage", () => {
  it("renders the Alaia world launcher", () => {
    render(<AlaiaLauncherPage />);

    expect(
      screen.getByRole("heading", { name: "Mundo de Alaia" })
    ).toBeDefined();
    expect(screen.getByText("12 animales")).toBeDefined();
  });

  it("links Animales to its app route", () => {
    render(<AlaiaLauncherPage />);

    const link = screen.getByRole("link", { name: /entrar en animales/i });
    expect(link.getAttribute("href")).toBe("/alaia/animales");
    expect(screen.getAllByRole("link", { name: /entrar en/i })).toHaveLength(1);
  });

  it("links back to profile selection", () => {
    render(<AlaiaLauncherPage />);

    const link = screen.getByRole("link", { name: "Volver a perfiles" });
    expect(link.getAttribute("href")).toBe("/");
  });
});
