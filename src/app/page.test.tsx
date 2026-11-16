import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { render } from "@/lib/test-utils";
import ProfileSelectionPage from "@/app/page";

describe("ProfileSelectionPage", () => {
  it("renders every family profile", () => {
    render(<ProfileSelectionPage />);

    for (const name of ["Albany", "Rubén", "Alaia", "Lucía", "Coco"]) {
      expect(screen.getByText(name)).toBeDefined();
    }
  });

  it("does not render the removed Hogar profile", () => {
    render(<ProfileSelectionPage />);

    expect(screen.queryByText("Hogar")).toBeNull();
  });

  it("places Lucía right after Alaia", () => {
    render(<ProfileSelectionPage />);

    const names = screen
      .getAllByText(/^(Albany|Rubén|Alaia|Lucía|Coco)$/)
      .map((name) => name.textContent);

    expect(names).toEqual(["Albany", "Rubén", "Alaia", "Lucía", "Coco"]);
  });

  it("links Alaia to her scoped app", () => {
    render(<ProfileSelectionPage />);

    const alaia = screen.getByRole("link", { name: /entrar como alaia/i });
    expect(alaia.getAttribute("href")).toBe("/alaia");
  });

  it("keeps pending profiles disabled", () => {
    render(<ProfileSelectionPage />);

    for (const name of [
      /albany pendiente/i,
      /rubén pendiente/i,
      /lucía pendiente/i,
      /coco pendiente/i,
    ]) {
      expect((screen.getByRole("button", { name }) as HTMLButtonElement).disabled).toBe(true);
    }
  });
});
