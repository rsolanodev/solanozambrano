import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import TensiometroLayout from "@/app/albany/tensiometro/layout";

describe("TensiometroLayout", () => {
  it("keeps space for the fixed bottom navigation", () => {
    render(
      <TensiometroLayout>
        <span>Contenido Tensiómetro</span>
      </TensiometroLayout>
    );

    const content = screen.getByText("Contenido Tensiómetro");
    expect(content.parentElement?.className).toContain("pb-[72px]");
  });
});
