import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { render } from "@/lib/test-utils";
import ProfileSelectionPage from "@/app/page";

describe("ProfileSelectionPage", () => {
  it("renders every family profile", () => {
    render(<ProfileSelectionPage />);

    for (const name of ["Hogar", "Rubén", "Alaia", "Coco"]) {
      expect(screen.getByText(name)).toBeDefined();
    }
  });

  it("does not render the removed Albany profile", () => {
    render(<ProfileSelectionPage />);

    expect(screen.queryByText("Albany")).toBeNull();
  });

  it("links Alaia to her scoped app", () => {
    render(<ProfileSelectionPage />);

    const alaia = screen.getByRole("link", { name: /entrar como alaia/i });
    expect(alaia.getAttribute("href")).toBe("/alaia");
  });

  it("keeps pending profiles disabled", () => {
    render(<ProfileSelectionPage />);

    for (const name of [/hogar pendiente/i, /rubén pendiente/i, /coco pendiente/i]) {
      expect((screen.getByRole("button", { name }) as HTMLButtonElement).disabled).toBe(true);
    }
  });
});
