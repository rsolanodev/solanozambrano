import { describe, it, expect } from "vitest";
import { metadata } from "@/app/layout";

describe("RootLayout metadata", () => {
  it("uses the SolanoZambrano app name", () => {
    expect(metadata.title).toBe("SolanoZambrano - Calendario de Tensión");
  });
});