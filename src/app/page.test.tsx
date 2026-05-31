import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ProfileSelectionPage from "@/app/page";

describe("ProfileSelectionPage", () => {
  it("renders every family profile", () => {
    render(<ProfileSelectionPage />);

    for (const name of ["Hogar", "Albany", "Rubén", "Alaia", "Coco"]) {
      expect(screen.getByText(name)).toBeDefined();
    }
  });

  it("links Albany to her scoped app", () => {
    render(<ProfileSelectionPage />);

    const albany = screen.getByRole("link", { name: /entrar como albany/i });
    expect(albany.getAttribute("href")).toBe("/albany");
  });

  it("keeps pending profiles disabled", () => {
    render(<ProfileSelectionPage />);

    for (const name of [/hogar pendiente/i, /rubén pendiente/i, /alaia pendiente/i, /coco pendiente/i]) {
      expect((screen.getByRole("button", { name }) as HTMLButtonElement).disabled).toBe(true);
    }
  });
});
