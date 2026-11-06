import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import AlaiaLayout from "@/app/alaia/layout";

describe("AlaiaLayout", () => {
  it("applies the Alaia profile theme to its route tree", () => {
    render(
      <AlaiaLayout>
        <span>Contenido Alaia</span>
      </AlaiaLayout>
    );

    const content = screen.getByText("Contenido Alaia");
    expect(content.parentElement?.getAttribute("data-profile-theme")).toBe(
      "alaia"
    );
  });
});
