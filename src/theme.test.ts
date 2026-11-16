import { describe, expect, it } from "vitest";
import { theme } from "@/theme";

describe("Mantine theme", () => {
  it("uses the global Crayon palette", () => {
    expect(theme.primaryColor).toBe("coral");
    expect(theme.primaryShade).toBe(6);
    expect(theme.colors?.coral?.[5]).toBe("#FF5833");
    expect(theme.colors?.coral?.[6]).toBe("#C23616");
    expect(theme.colors?.sun?.[5]).toBe("#FFCA24");
    expect(theme.colors?.grass?.[5]).toBe("#60AB59");
    expect(theme.colors?.sky?.[5]).toBe("#4A8ACA");
  });

  it("uses the shared typography, radii and shapes", () => {
    expect(theme.fontFamily).toBe("var(--font-text)");
    expect(theme.headings?.fontFamily).toBe("var(--font-display)");
    expect(theme.headings?.fontWeight).toBe("400");
    expect(theme.radius?.lg).toBe("32px");
    expect(theme.radius?.xl).toBe("999px");
    expect(theme.defaultRadius).toBe("md");
  });
});