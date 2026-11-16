import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { render } from "@/lib/test-utils";
import AlaiaLayout from "@/app/alaia/layout";

describe("AlaiaLayout", () => {
  it("wraps the Alaia route tree in the shared app shell", () => {
    render(
      <AlaiaLayout>
        <span>Contenido Alaia</span>
      </AlaiaLayout>
    );

    const content = screen.getByText("Contenido Alaia");
    expect(content.parentElement?.getAttribute("data-app-shell")).toBe(
      "alaia"
    );
  });
});