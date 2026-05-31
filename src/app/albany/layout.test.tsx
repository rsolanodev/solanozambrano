import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import AlbanyLayout from "@/app/albany/layout";

describe("AlbanyLayout", () => {
  it("applies the Albany profile theme to its route tree", () => {
    render(
      <AlbanyLayout>
        <span>Contenido Albany</span>
      </AlbanyLayout>
    );

    const content = screen.getByText("Contenido Albany");
    expect(content.parentElement?.getAttribute("data-profile-theme")).toBe(
      "albany"
    );
  });
});
