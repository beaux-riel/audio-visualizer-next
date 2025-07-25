import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import AudioVisualizer from "../AudioVisualizer";

// Mock the audio utility functions
vi.mock("../../utils/audio", () => ({
  getAverageVolume: vi.fn((data: Uint8Array) => {
    if (data.length === 0) return 0;
    return data.reduce((acc, val) => acc + val, 0) / data.length;
  }),
  volumeToPercentage: vi.fn((volume: number) =>
    Math.min(100, (volume / 255) * 100)
  ),
  initializeAudioAnalysis: vi.fn(() => ({
    audioContext: {
      createAnalyser: vi.fn(),
      createMediaStreamSource: vi.fn(),
      close: vi.fn(),
    },
    analyser: {
      getByteFrequencyData: vi.fn(),
      frequencyBinCount: 128,
      fftSize: 256,
      connect: vi.fn(),
    },
    dataArray: new Uint8Array(128),
    source: {
      connect: vi.fn(),
      disconnect: vi.fn(),
    },
  })),
}));

// Mock Web APIs
Object.defineProperty(global.navigator, "mediaDevices", {
  value: {
    getUserMedia: vi.fn(),
  },
  writable: true,
  configurable: true,
});

Object.defineProperty(window, "requestAnimationFrame", {
  value: vi.fn((callback) => {
    setTimeout(callback, 16);
    return 1;
  }),
  writable: true,
});

Object.defineProperty(window, "cancelAnimationFrame", {
  value: vi.fn(),
  writable: true,
});

describe("AudioVisualizer", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Reset navigator.mediaDevices to default state if it exists
    if (global.navigator.mediaDevices) {
      global.navigator.mediaDevices.getUserMedia = vi.fn();
    } else {
      Object.defineProperty(global.navigator, "mediaDevices", {
        value: {
          getUserMedia: vi.fn(),
        },
        writable: true,
        configurable: true,
      });
    }
  });

  it("renders without crashing", () => {
    render(<AudioVisualizer />);
    expect(screen.getByText(/audio visualizer/i)).toBeInTheDocument();
  });

  it("displays initial UI elements correctly", () => {
    render(<AudioVisualizer />);

    // Check for main title
    expect(screen.getByText(/audio visualizer/i)).toBeInTheDocument();

    // Check for description
    expect(
      screen.getByText(/experience your voice through dynamic visualizations/i)
    ).toBeInTheDocument();

    // Check for microphone button
    const micButton = screen.getByRole("button");
    expect(micButton).toBeInTheDocument();

    // Check initial state text
    expect(screen.getByText(/microphone off/i)).toBeInTheDocument();
    expect(
      screen.getByText(/click the button to enable microphone/i)
    ).toBeInTheDocument();
  });

  it("shows microphone permission request when button is clicked", async () => {
    const mockGetUserMedia = vi.fn().mockResolvedValue({
      getTracks: () => [{ stop: vi.fn() }],
    });
    (navigator.mediaDevices
      .getUserMedia as typeof navigator.mediaDevices.getUserMedia) =
      mockGetUserMedia;

    render(<AudioVisualizer />);

    const micButton = screen.getByRole("button");
    fireEvent.click(micButton);

    expect(mockGetUserMedia).toHaveBeenCalledWith({ audio: true });
  });

  it("handles microphone access denial gracefully", async () => {
    const mockGetUserMedia = vi
      .fn()
      .mockRejectedValue(new Error("Permission denied"));
    (navigator.mediaDevices
      .getUserMedia as typeof navigator.mediaDevices.getUserMedia) =
      mockGetUserMedia;

    render(<AudioVisualizer />);

    const micButton = screen.getByRole("button");
    fireEvent.click(micButton);

    await waitFor(() => {
      expect(screen.getByText("Permission denied")).toBeInTheDocument();
      expect(screen.getByText("Microphone Error")).toBeInTheDocument();
    });
  });

  it("displays visualization components when listening", async () => {
    const mockGetUserMedia = vi.fn().mockResolvedValue({
      getTracks: () => [{ stop: vi.fn() }],
    });
    (navigator.mediaDevices
      .getUserMedia as typeof navigator.mediaDevices.getUserMedia) =
      mockGetUserMedia;

    render(<AudioVisualizer />);

    const micButton = screen.getByRole("button");
    fireEvent.click(micButton);

    await waitFor(() => {
      expect(screen.getByText(/listening.../i)).toBeInTheDocument();
    });

    // Check for visualization sections
    expect(screen.getByText(/volume level/i)).toBeInTheDocument();
    expect(screen.getByText(/frequency spectrum/i)).toBeInTheDocument();
    expect(screen.getByText(/circular waveform/i)).toBeInTheDocument();
    expect(screen.getByText(/particle field/i)).toBeInTheDocument();
  });

  it("stops listening when stop button is clicked", async () => {
    const mockGetUserMedia = vi.fn().mockResolvedValue({
      getTracks: () => [{ stop: vi.fn() }],
    });
    (navigator.mediaDevices
      .getUserMedia as typeof navigator.mediaDevices.getUserMedia) =
      mockGetUserMedia;

    render(<AudioVisualizer />);

    const micButton = screen.getByRole("button");

    // Start listening
    fireEvent.click(micButton);

    await waitFor(() => {
      expect(screen.getByText(/listening.../i)).toBeInTheDocument();
    });

    // Stop listening
    fireEvent.click(micButton);

    await waitFor(() => {
      expect(screen.getByText(/microphone off/i)).toBeInTheDocument();
    });
  });

  it("displays proper instructions based on state", async () => {
    render(<AudioVisualizer />);

    // Initial state
    expect(
      screen.getByText(/click the button to enable microphone/i)
    ).toBeInTheDocument();

    const mockGetUserMedia = vi.fn().mockResolvedValue({
      getTracks: () => [{ stop: vi.fn() }],
    });
    (navigator.mediaDevices
      .getUserMedia as typeof navigator.mediaDevices.getUserMedia) =
      mockGetUserMedia;

    const micButton = screen.getByRole("button");
    fireEvent.click(micButton);

    await waitFor(() => {
      expect(
        screen.getByText(/speak into your microphone to see visualizations/i)
      ).toBeInTheDocument();
    });
  });

  it("applies correct CSS classes based on listening state", async () => {
    const mockGetUserMedia = vi.fn().mockResolvedValue({
      getTracks: () => [{ stop: vi.fn() }],
    });
    (navigator.mediaDevices
      .getUserMedia as typeof navigator.mediaDevices.getUserMedia) =
      mockGetUserMedia;

    render(<AudioVisualizer />);

    const micButton = screen.getByRole("button");

    // Check initial button styles (should have blue gradient)
    expect(micButton).toHaveClass(/from-cyan-500/);

    fireEvent.click(micButton);

    await waitFor(() => {
      // Check listening button styles (should have red background)
      expect(micButton).toHaveClass(/bg-red-500/);
    });
  });

  it("cleans up resources on unmount", () => {
    const { unmount } = render(<AudioVisualizer />);

    // Should not throw any errors when unmounting
    expect(() => unmount()).not.toThrow();
  });

  it("has proper accessibility attributes on microphone button", () => {
    render(<AudioVisualizer />);

    const micButton = screen.getByRole("button");

    // Check aria-label
    expect(micButton).toHaveAttribute(
      "aria-label",
      "Start microphone listening"
    );

    // Check aria-pressed
    expect(micButton).toHaveAttribute("aria-pressed", "false");
  });

  it("updates aria-label and aria-pressed when listening state changes", async () => {
    const mockGetUserMedia = vi.fn().mockResolvedValue({
      getTracks: () => [{ stop: vi.fn() }],
    });
    (navigator.mediaDevices
      .getUserMedia as typeof navigator.mediaDevices.getUserMedia) =
      mockGetUserMedia;

    render(<AudioVisualizer />);

    const micButton = screen.getByRole("button");

    // Initial state
    expect(micButton).toHaveAttribute(
      "aria-label",
      "Start microphone listening"
    );
    expect(micButton).toHaveAttribute("aria-pressed", "false");

    // Click to start listening
    fireEvent.click(micButton);

    await waitFor(() => {
      expect(micButton).toHaveAttribute(
        "aria-label",
        "Stop microphone listening"
      );
      expect(micButton).toHaveAttribute("aria-pressed", "true");
    });
  });

  it("handles keyboard navigation (Space and Enter keys)", async () => {
    const mockGetUserMedia = vi.fn().mockResolvedValue({
      getTracks: () => [{ stop: vi.fn() }],
    });
    (navigator.mediaDevices
      .getUserMedia as typeof navigator.mediaDevices.getUserMedia) =
      mockGetUserMedia;

    render(<AudioVisualizer />);

    const micButton = screen.getByRole("button");

    // Test Space key
    fireEvent.keyDown(micButton, { key: " " });

    await waitFor(() => {
      expect(screen.getByText(/listening.../i)).toBeInTheDocument();
    });

    // Test Enter key to stop
    fireEvent.keyDown(micButton, { key: "Enter" });

    await waitFor(() => {
      expect(screen.getByText(/microphone off/i)).toBeInTheDocument();
    });
  });

  it("displays proper error message for unsupported browser", () => {
    // Mock navigator.mediaDevices as undefined
    Object.defineProperty(global.navigator, "mediaDevices", {
      value: undefined,
      writable: true,
    });

    render(<AudioVisualizer />);

    // Should show browser not supported warning
    expect(screen.getByText("Browser Not Supported")).toBeInTheDocument();
    expect(
      screen.getByText(/doesn't support microphone access/)
    ).toBeInTheDocument();

    // Button should be disabled
    const micButton = screen.getByRole("button");
    expect(micButton).toBeDisabled();
  });

  it("handles different types of media device errors", async () => {
    // Test NotFoundError
    const notFoundError = new DOMException(
      "No microphone found",
      "NotFoundError"
    );
    const mockGetUserMedia = vi.fn().mockRejectedValue(notFoundError);
    (navigator.mediaDevices
      .getUserMedia as typeof navigator.mediaDevices.getUserMedia) =
      mockGetUserMedia;

    render(<AudioVisualizer />);

    const micButton = screen.getByRole("button");
    fireEvent.click(micButton);

    await waitFor(() => {
      expect(screen.getByText(/No microphone found/)).toBeInTheDocument();
    });
  });

  it("icons have aria-hidden attribute for accessibility", () => {
    render(<AudioVisualizer />);

    const micButton = screen.getByRole("button");
    const icon = micButton.querySelector("svg");

    expect(icon).toHaveAttribute("aria-hidden", "true");
  });

  it("error alerts have proper accessibility attributes", async () => {
    const mockGetUserMedia = vi.fn().mockRejectedValue(new Error("Test error"));
    (navigator.mediaDevices
      .getUserMedia as typeof navigator.mediaDevices.getUserMedia) =
      mockGetUserMedia;

    render(<AudioVisualizer />);

    const micButton = screen.getByRole("button");
    fireEvent.click(micButton);

    await waitFor(() => {
      const alert = screen.getByRole("alert");
      expect(alert).toHaveAttribute("aria-live", "polite");
      expect(alert).toBeInTheDocument();
    });
  });
});
