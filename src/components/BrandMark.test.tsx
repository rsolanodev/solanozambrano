import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { render } from "@/lib/test-utils";
import { BrandMark } from "@/components/BrandMark";

describe("BrandMark", () => {
  it("renders the SolanoZambrano wordmark as the home link", () => {
    render(<BrandMark />);

    const brand = screen.getByRole("link", {
      name: /solanozambrano, ir al inicio/i,
    });

    expect(brand.getAttribute("href")).toBe("/");
    expect(brand.textContent).toContain("SolanoZambrano");
    expect(screen.queryByText("materna")).toBeNull();
  });
});