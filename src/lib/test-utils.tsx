import type { ReactElement, ReactNode } from "react";
import { render as testingLibraryRender } from "@testing-library/react";
import { MantineProvider } from "@mantine/core";
import { theme } from "@/theme";

function TestWrapper({ children }: { children: ReactNode }) {
  return (
    <MantineProvider theme={theme} forceColorScheme="light" env="test">
      {children}
    </MantineProvider>
  );
}

export function render(ui: ReactElement) {
  return testingLibraryRender(ui, { wrapper: TestWrapper });
}
