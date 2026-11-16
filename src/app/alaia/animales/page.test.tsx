import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "@/lib/test-utils";
import AnimalsPage from "@/app/alaia/animales/page";

const playMock = vi.mocked(HTMLMediaElement.prototype.play);
const pauseMock = vi.mocked(HTMLMediaElement.prototype.pause);

beforeEach(() => {
  vi.resetAllMocks();
  playMock.mockResolvedValue(undefined);
  window.history.replaceState(null, "", "/alaia/animales");
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("AnimalsPage", () => {
  it("renders 22 accessible animal cards without autoplaying audio", () => {
    render(<AnimalsPage />);

    expect(
      screen.getAllByRole("button", { name: /^Escuchar/ })
    ).toHaveLength(22);
    expect(
      screen.getByRole("button", { name: "Escuchar a la vaca" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Escuchar al caballo" })
    ).toBeInTheDocument();
    expect(playMock).not.toHaveBeenCalled();
  });

  it("opens the player and plays the sound from the user gesture", async () => {
    const user = userEvent.setup();
    render(<AnimalsPage />);

    await user.click(screen.getByRole("button", { name: "Escuchar a la vaca" }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Vaca" })).toBeInTheDocument();
    expect(within(screen.getByRole("dialog")).getByText("¡Muuu!")).toBeInTheDocument();
    expect(screen.getByText("1 de 22")).toBeInTheDocument();
    expect(playMock).toHaveBeenCalledTimes(1);

    const audio = document.querySelector("audio");
    expect(audio?.getAttribute("src")).toBe("/alaia/animales/audio/vaca.mp3");

    const video = document.querySelector("video");
    expect(video).toHaveAttribute("autoplay");
    expect(video).toHaveAttribute("loop");
    expect(video).toHaveAttribute("playsinline");
    expect(video).toHaveAttribute("poster", "/alaia/animales/poster/vaca.jpg");
    expect(video?.muted).toBe(true);
    expect(
      screen.getByRole("button", { name: "Cerrar reproductor" })
    ).toHaveFocus();
  });

  it("repeats the sound without remounting the video", async () => {
    const user = userEvent.setup();
    render(<AnimalsPage />);

    await user.click(screen.getByRole("button", { name: "Escuchar a la vaca" }));
    const video = document.querySelector("video");
    playMock.mockClear();

    await user.click(screen.getByRole("button", { name: "Otra vez" }));

    expect(playMock).toHaveBeenCalledTimes(1);
    expect(document.querySelector("video")).toBe(video);
    expect(document.querySelector("audio")?.getAttribute("src")).toBe(
      "/alaia/animales/audio/vaca.mp3"
    );
  });

  it("shows the LSE sign and returns to the animal video", async () => {
    const user = userEvent.setup();
    render(<AnimalsPage />);

    await user.click(screen.getByRole("button", { name: "Escuchar a la vaca" }));
    await user.click(
      screen.getByRole("button", {
        name: "Ver signo en Lengua de Signos Española",
      })
    );

    expect(document.querySelector("video")).toBeNull();
    expect(
      screen.getByRole("img", { name: /signo de vaca en lengua de signos/i })
    ).toHaveAttribute("src", "/alaia/animales/signos/vaca.jpg");
    expect(screen.getByText(/así se dice en lse/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Ver el animal" })
    ).toHaveAttribute("aria-pressed", "true");

    await user.click(screen.getByRole("button", { name: "Ver el animal" }));

    expect(document.querySelector("video")).not.toBeNull();
    expect(
      screen.queryByRole("img", { name: /signo de vaca en lengua de signos/i })
    ).not.toBeInTheDocument();
  });

  it("returns to the animal view when navigating to another animal", async () => {
    const user = userEvent.setup();
    render(<AnimalsPage />);

    await user.click(screen.getByRole("button", { name: "Escuchar a la vaca" }));
    await user.click(
      screen.getByRole("button", {
        name: "Ver signo en Lengua de Signos Española",
      })
    );
    await user.click(screen.getByRole("button", { name: "Animal siguiente" }));

    expect(screen.getByRole("heading", { name: "Oveja" })).toBeInTheDocument();
    expect(document.querySelector("video")).not.toBeNull();
    expect(
      screen.getByRole("button", {
        name: "Ver signo en Lengua de Signos Española",
      })
    ).toHaveAttribute("aria-pressed", "false");
  });

  it("navigates to the next and previous animal with wrap-around", async () => {
    const user = userEvent.setup();
    render(<AnimalsPage />);

    await user.click(screen.getByRole("button", { name: "Escuchar a la vaca" }));
    await user.click(screen.getByRole("button", { name: "Animal siguiente" }));

    expect(screen.getByRole("heading", { name: "Oveja" })).toBeInTheDocument();
    expect(screen.getByText("2 de 22")).toBeInTheDocument();
    expect(document.querySelector("audio")?.getAttribute("src")).toBe(
      "/alaia/animales/audio/oveja.mp3"
    );

    await user.click(screen.getByRole("button", { name: "Animal anterior" }));
    expect(screen.getByRole("heading", { name: "Vaca" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Animal anterior" }));
    expect(screen.getByRole("heading", { name: "Abeja" })).toBeInTheDocument();
    expect(screen.getByText("22 de 22")).toBeInTheDocument();
  });

  it("closes the player, pauses the audio and restores focus", async () => {
    const user = userEvent.setup();
    render(<AnimalsPage />);

    const card = screen.getByRole("button", { name: "Escuchar a la vaca" });
    await user.click(card);
    pauseMock.mockClear();

    await user.click(screen.getByRole("button", { name: "Cerrar reproductor" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(pauseMock).toHaveBeenCalled();
    await waitFor(() => expect(card).toHaveFocus());
  });

  it("closes with Escape", async () => {
    const user = userEvent.setup();
    render(<AnimalsPage />);

    await user.click(screen.getByRole("button", { name: "Escuchar a la vaca" }));
    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes when the browser back button is used", async () => {
    const user = userEvent.setup();
    render(<AnimalsPage />);

    await user.click(screen.getByRole("button", { name: "Escuchar a la vaca" }));
    window.dispatchEvent(new PopStateEvent("popstate"));

    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    );
  });

  it("navigates with the arrow keys", async () => {
    const user = userEvent.setup();
    render(<AnimalsPage />);

    await user.click(screen.getByRole("button", { name: "Escuchar a la vaca" }));
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("heading", { name: "Oveja" })).toBeInTheDocument();

    await user.keyboard("{ArrowLeft}");
    expect(screen.getByRole("heading", { name: "Vaca" })).toBeInTheDocument();
  });

  it("traps focus inside the dialog", async () => {
    const user = userEvent.setup();
    render(<AnimalsPage />);

    await user.click(screen.getByRole("button", { name: "Escuchar a la vaca" }));
    const next = screen.getByRole("button", { name: "Animal siguiente" });
    next.focus();
    await user.tab();

    expect(
      screen.getByRole("button", { name: "Cerrar reproductor" })
    ).toHaveFocus();
  });

  it("shows a retry action when audio playback fails", async () => {
    playMock.mockRejectedValueOnce(new Error("Not allowed"));
    const user = userEvent.setup();
    render(<AnimalsPage />);

    await user.click(screen.getByRole("button", { name: "Escuchar a la vaca" }));

    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "Toca para escuchar" })
      ).toBeInTheDocument()
    );
    expect(
      screen.getByText("No se pudo reproducir. Toca para escuchar.")
    ).toBeInTheDocument();
  });

  it("falls back to the poster when the video fails", async () => {
    const user = userEvent.setup();
    render(<AnimalsPage />);

    await user.click(screen.getByRole("button", { name: "Escuchar a la vaca" }));
    const video = document.querySelector("video");
    expect(video).not.toBeNull();

    fireEvent.error(video as HTMLVideoElement);

    expect(
      await screen.findByRole("img", { name: "Vaca en su hábitat" })
    ).toHaveAttribute("src", "/alaia/animales/poster/vaca.jpg");
  });

  it("shows the poster instead of the video when reduced motion is requested", async () => {
    vi.stubGlobal("matchMedia", (query: string) => ({
      matches: query.includes("prefers-reduced-motion"),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const user = userEvent.setup();
    render(<AnimalsPage />);

    await user.click(screen.getByRole("button", { name: "Escuchar a la vaca" }));

    expect(document.querySelector("video")).toBeNull();
    expect(
      screen.getByRole("img", { name: "Vaca en su hábitat" })
    ).toHaveAttribute("src", "/alaia/animales/poster/vaca.jpg");
  });

  it("exposes the player as an accessible modal", async () => {
    const user = userEvent.setup();
    render(<AnimalsPage />);

    await user.click(screen.getByRole("button", { name: "Escuchar a la vaca" }));

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("aria-labelledby", "animal-player-title");
    expect(screen.getByText("1 de 22")).toHaveAttribute("aria-live", "polite");
    expect(
      screen.getByRole("button", { name: "Cerrar reproductor" })
    ).toHaveFocus();
  });

  it("keeps the main flow free of external links", () => {
    render(<AnimalsPage />);

    for (const link of screen.getAllByRole("link")) {
      expect(link.getAttribute("href")).not.toMatch(/^https?:\/\//);
    }
  });
});
