import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import AppsLauncherLink from "@/app/AppsLauncherLink";

describe("AppsLauncherLink", () => {
  it("links back to Albany apps launcher", () => {
    render(<AppsLauncherLink />);

    const link = screen.getByRole("link", { name: "Volver a apps" });
    expect(link.getAttribute("href")).toBe("/albany");
  });
});
