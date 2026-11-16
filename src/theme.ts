import { createTheme, type MantineColorsTuple } from "@mantine/core";

const coral: MantineColorsTuple = [
  "#FFF1EC",
  "#FFE3DA",
  "#FFC9B8",
  "#FFAE94",
  "#FF8A67",
  "#FF5833",
  "#C23616",
  "#A82C0F",
  "#8F240B",
  "#5D0045",
];

const sun: MantineColorsTuple = [
  "#FFFBEB",
  "#FFF1BF",
  "#FFE58A",
  "#FFDA55",
  "#FFD02F",
  "#FFCA24",
  "#E8B400",
  "#C99A00",
  "#A87F00",
  "#5D0045",
];

const grass: MantineColorsTuple = [
  "#F3FAF1",
  "#E2F2DF",
  "#C4E5BE",
  "#A1D599",
  "#7FC276",
  "#60AB59",
  "#4C9446",
  "#3C7C37",
  "#2E632A",
  "#5D0045",
];

const sky: MantineColorsTuple = [
  "#F1F7FD",
  "#E0EDF9",
  "#C2DCF4",
  "#9EC5EB",
  "#74AAE0",
  "#4A8ACA",
  "#3A74AE",
  "#2D5F91",
  "#224B74",
  "#5D0045",
];

/**
 * Sistema visual global "Crayon".
 *
 * Un único tema para todo el repositorio. Los colores, tipografías y formas
 * están documentados en `DESIGN.md`; los tokens CSS viven en
 * `src/styles/design-tokens.css`.
 */
export const theme = createTheme({
  white: "#FFFDF7",
  black: "#5D0045",
  primaryColor: "coral",
  primaryShade: 6,
  colors: {
    coral,
    sun,
    grass,
    sky,
  },
  autoContrast: true,
  luminanceThreshold: 0.35,
  fontFamily: "var(--font-text)",
  headings: {
    fontFamily: "var(--font-display)",
    fontWeight: "400",
    textWrap: "balance",
    sizes: {
      h1: {
        fontSize: "clamp(2.5rem, 6vw, 4.25rem)",
        lineHeight: "0.98",
        fontWeight: "400",
      },
      h2: {
        fontSize: "clamp(2rem, 4vw, 3rem)",
        lineHeight: "1.02",
        fontWeight: "400",
      },
      h3: {
        fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
        lineHeight: "1.1",
        fontWeight: "400",
      },
      h4: { fontSize: "1.25rem", lineHeight: "1.2", fontWeight: "400" },
      h5: { fontSize: "1.125rem", lineHeight: "1.25", fontWeight: "400" },
      h6: { fontSize: "1rem", lineHeight: "1.3", fontWeight: "400" },
    },
  },
  fontSizes: {
    xs: "12px",
    sm: "14px",
    md: "16px",
    lg: "18px",
    xl: "22px",
  },
  lineHeights: {
    xs: "16px",
    sm: "20px",
    md: "26px",
    lg: "28px",
    xl: "32px",
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
  },
  radius: {
    xs: "8px",
    sm: "12px",
    md: "20px",
    lg: "32px",
    xl: "999px",
  },
  defaultRadius: "md",
  fontWeights: {
    regular: "400",
    medium: "600",
    bold: "700",
  },
  shadows: {
    xs: "0 2px 8px rgba(93, 0, 69, 0.08)",
    sm: "0 6px 18px rgba(93, 0, 69, 0.10)",
    md: "0 12px 30px rgba(93, 0, 69, 0.12)",
    lg: "0 20px 45px rgba(93, 0, 69, 0.14)",
    xl: "0 28px 65px rgba(93, 0, 69, 0.18)",
  },
  defaultGradient: {
    from: "coral.5",
    to: "sun.5",
    deg: 35,
  },
  cursorType: "pointer",
  respectReducedMotion: true,
  components: {
    Button: {
      defaultProps: {
        radius: "xl",
        fw: 700,
        size: "md",
      },
    },
    Badge: {
      defaultProps: {
        radius: "xl",
        variant: "light",
        fw: 700,
        size: "md",
        tt: "none",
      },
    },
    ActionIcon: {
      defaultProps: {
        radius: "xl",
        variant: "default",
      },
    },
    Card: {
      defaultProps: {
        radius: "lg",
        padding: "lg",
      },
    },
    Paper: {
      defaultProps: {
        radius: "lg",
      },
    },
    Anchor: {
      defaultProps: {
        fw: 700,
      },
    },
  },
});