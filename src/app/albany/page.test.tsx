import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import AlbanyAppsPage from "@/app/albany/page";

describe("AlbanyAppsPage", () => {
  it("renders Albany apps launcher", () => {
    render(<AlbanyAppsPage />);

    expect(screen.getByRole("heading", { name: "Apps" })).toBeDefined();
    expect(screen.getByText("Tensiómetro")).toBeDefined();
  });

  it("links Tensiómetro to its app route", () => {
    render(<AlbanyAppsPage />);

    const link = screen.getByRole("link", { name: /entrar en tensiómetro/i });
    expect(link.getAttribute("href")).toBe("/albany/tensiometro");
  });

  it("links back to profile selection", () => {
    render(<AlbanyAppsPage />);

    const link = screen.getByRole("link", { name: "Perfiles" });
    expect(link.getAttribute("href")).toBe("/");
  });

  it("does not render removed pending apps", () => {
    render(<AlbanyAppsPage />);

    expect(screen.queryByText("Embarazo")).toBeNull();
    expect(screen.queryByText("Citas")).toBeNull();
    expect(screen.queryByText("Notas")).toBeNull();
  });
});
