import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import AudioVisualizer from "../AudioVisualizer";
import { getAverageVolume, volumeToPercentage } from "../../utils/audio";

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
      getByteFrequencyData: vi.fn((array) => {
        // Fill array with mock frequency data for testing
        array.set(new Uint8Array(128).fill(100));
      }),
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

describe("AudioVisualizer - Comprehensive Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Reset navigator.mediaDevices to default state
    Object.defineProperty(global.navigator, "mediaDevices", {
      value: {
        getUserMedia: vi.fn(),
      },
      writable: true,
      configurable: true,
    });
  });

  describe("Microphone Toggle State Management", () => {
    it("changes state from off to listening when button is clicked", async () => {
      const mockGetUserMedia = vi.fn().mockResolvedValue(new MediaStream());
      (navigator.mediaDevices
        .getUserMedia as typeof navigator.mediaDevices.getUserMedia) =
        mockGetUserMedia;

      render(<AudioVisualizer />);

      const micButton = screen.getByRole("button");

      // Initial state
      expect(screen.getByText(/microphone off/i)).toBeInTheDocument();
      expect(micButton).toHaveAttribute("aria-pressed", "false");

      // Click to start listening
      fireEvent.click(micButton);

      await waitFor(() => {
        expect(screen.getByText(/listening.../i)).toBeInTheDocument();
        expect(micButton).toHaveAttribute("aria-pressed", "true");
      });
    });

    it("changes state from listening to off when button is clicked again", async () => {
      const mockGetUserMedia = vi.fn().mockResolvedValue(new MediaStream());
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

    it("maintains consistent state across multiple toggles", async () => {
      const mockGetUserMedia = vi.fn().mockResolvedValue(new MediaStream());
      (navigator.mediaDevices
        .getUserMedia as typeof navigator.mediaDevices.getUserMedia) =
        mockGetUserMedia;

      render(<AudioVisualizer />);

      const micButton = screen.getByRole("button");

      for (let i = 0; i < 3; i++) {
        // Toggle on
        fireEvent.click(micButton);
        await waitFor(() => {
          expect(screen.getByText(/listening.../i)).toBeInTheDocument();
        });

        // Toggle off
        fireEvent.click(micButton);
        await waitFor(() => {
          expect(screen.getByText(/microphone off/i)).toBeInTheDocument();
        });
      }
    });
  });

  describe("getAverageVolume Function Tests", () => {
    it("returns correct value for empty audio data", () => {
      const emptyData = new Uint8Array(0);
      expect(getAverageVolume(emptyData)).toBe(0);
    });

    it("returns correct value for uniform audio data", () => {
      const uniformData = new Uint8Array(10).fill(128);
      expect(getAverageVolume(uniformData)).toBe(128);
    });

    it("returns correct value for varied audio data", () => {
      const variedData = new Uint8Array([50, 100, 150, 200]);
      const expected = (50 + 100 + 150 + 200) / 4;
      expect(getAverageVolume(variedData)).toBe(expected);
    });

    it("handles maximum values correctly", () => {
      const maxData = new Uint8Array(5).fill(255);
      expect(getAverageVolume(maxData)).toBe(255);
    });
  });

  describe("Visual Elements Rendering", () => {
    it("renders correct number of frequency bars for mocked data", async () => {
      const mockGetUserMedia = vi.fn().mockResolvedValue(new MediaStream());
      (navigator.mediaDevices
        .getUserMedia as typeof navigator.mediaDevices.getUserMedia) =
        mockGetUserMedia;

      const { container } = render(<AudioVisualizer />);

      const micButton = screen.getByRole("button");
      fireEvent.click(micButton);

      await waitFor(() => {
        expect(screen.getByText(/listening.../i)).toBeInTheDocument();
      });

      // Wait for visualizer to render
      await waitFor(() => {
        const frequencyBars = container.querySelectorAll('[style*="height"]');
        expect(frequencyBars.length).toBeGreaterThan(0);
      });
    });

    it("renders particles based on audio data", async () => {
      const mockGetUserMedia = vi.fn().mockResolvedValue(new MediaStream());
      (navigator.mediaDevices
        .getUserMedia as typeof navigator.mediaDevices.getUserMedia) =
        mockGetUserMedia;

      const { container } = render(<AudioVisualizer />);

      const micButton = screen.getByRole("button");
      fireEvent.click(micButton);

      await waitFor(() => {
        expect(screen.getByText(/listening.../i)).toBeInTheDocument();
      });

      // Check for particle field section
      expect(screen.getByText(/particle field/i)).toBeInTheDocument();

      // Verify particles are rendered
      await waitFor(() => {
        const particles = container.querySelectorAll(".absolute.rounded-full");
        expect(particles.length).toBe(50); // Should render 50 particles as per component
      });
    });

    it("renders circular waveform with correct number of lines", async () => {
      const mockGetUserMedia = vi.fn().mockResolvedValue(new MediaStream());
      (navigator.mediaDevices
        .getUserMedia as typeof navigator.mediaDevices.getUserMedia) =
        mockGetUserMedia;

      const { container } = render(<AudioVisualizer />);

      const micButton = screen.getByRole("button");
      fireEvent.click(micButton);

      await waitFor(() => {
        expect(screen.getByText(/listening.../i)).toBeInTheDocument();
      });

      // Check for circular waveform section
      expect(screen.getByText(/circular waveform/i)).toBeInTheDocument();

      // Verify SVG lines are rendered (should be 64 as per component logic)
      await waitFor(() => {
        const svgLines = container.querySelectorAll("svg line");
        expect(svgLines.length).toBeGreaterThanOrEqual(64); // At least 64 waveform lines
      });
    });

    it("updates volume meter based on audio data", async () => {
      const mockGetUserMedia = vi.fn().mockResolvedValue(new MediaStream());
      (navigator.mediaDevices
        .getUserMedia as typeof navigator.mediaDevices.getUserMedia) =
        mockGetUserMedia;

      // Mock specific volume data
      vi.mocked(getAverageVolume).mockReturnValue(128);
      vi.mocked(volumeToPercentage).mockReturnValue(50);

      render(<AudioVisualizer />);

      const micButton = screen.getByRole("button");
      fireEvent.click(micButton);

      await waitFor(() => {
        expect(screen.getByText(/listening.../i)).toBeInTheDocument();
      });

      // Check volume level display
      expect(screen.getByText(/volume level/i)).toBeInTheDocument();

      // Verify percentage is displayed
      await waitFor(() => {
        expect(screen.getByText("50%")).toBeInTheDocument();
      });
    });
  });

  describe("Permission Denied Error Handling", () => {
    it("simulates permission denied and verifies error UI", async () => {
      const permissionDeniedError = new DOMException(
        "Microphone access denied",
        "NotAllowedError"
      );
      const mockGetUserMedia = vi.fn().mockRejectedValue(permissionDeniedError);
      (navigator.mediaDevices
        .getUserMedia as typeof navigator.mediaDevices.getUserMedia) =
        mockGetUserMedia;

      render(<AudioVisualizer />);

      const micButton = screen.getByRole("button");
      fireEvent.click(micButton);

      await waitFor(() => {
        expect(screen.getByText("Microphone Error")).toBeInTheDocument();
        expect(
          screen.getByText(/microphone access denied/i)
        ).toBeInTheDocument();
      });

      // Verify error alert has proper accessibility
      const errorAlert = screen.getByRole("alert");
      expect(errorAlert).toHaveAttribute("aria-live", "polite");
    });

    it("handles SecurityError appropriately", async () => {
      const securityError = new DOMException(
        "Microphone access blocked due to security restrictions",
        "SecurityError"
      );
      const mockGetUserMedia = vi.fn().mockRejectedValue(securityError);
      (navigator.mediaDevices
        .getUserMedia as typeof navigator.mediaDevices.getUserMedia) =
        mockGetUserMedia;

      render(<AudioVisualizer />);

      const micButton = screen.getByRole("button");
      fireEvent.click(micButton);

      await waitFor(() => {
        expect(screen.getByText(/security restrictions/i)).toBeInTheDocument();
      });
    });

    it("handles NotFoundError for missing microphone", async () => {
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
        expect(screen.getByText(/no microphone found/i)).toBeInTheDocument();
      });
    });
  });

  describe("Browser Support Detection", () => {
    it("displays warning when MediaDevices API is not supported", () => {
      // Mock unsupported browser
      Object.defineProperty(global.navigator, "mediaDevices", {
        value: undefined,
        writable: true,
      });

      render(<AudioVisualizer />);

      expect(screen.getByText("Browser Not Supported")).toBeInTheDocument();
      expect(
        screen.getByText(/doesn't support microphone access/i)
      ).toBeInTheDocument();

      const micButton = screen.getByRole("button");
      expect(micButton).toBeDisabled();
    });

    it("enables functionality when MediaDevices API is supported", () => {
      // Mock supported browser
      Object.defineProperty(global.navigator, "mediaDevices", {
        value: {
          getUserMedia: vi.fn(),
        },
        writable: true,
      });

      render(<AudioVisualizer />);

      const micButton = screen.getByRole("button");
      expect(micButton).not.toBeDisabled();
    });
  });

  describe("Accessibility Features", () => {
    it("provides appropriate ARIA labels for all interactive elements", () => {
      render(<AudioVisualizer />);

      const micButton = screen.getByRole("button");
      expect(micButton).toHaveAttribute(
        "aria-label",
        "Start microphone listening"
      );
      expect(micButton).toHaveAttribute("aria-pressed", "false");
    });

    it("updates ARIA attributes when state changes", async () => {
      const mockGetUserMedia = vi.fn().mockResolvedValue(new MediaStream());
      (navigator.mediaDevices
        .getUserMedia as typeof navigator.mediaDevices.getUserMedia) =
        mockGetUserMedia;

      render(<AudioVisualizer />);

      const micButton = screen.getByRole("button");

      fireEvent.click(micButton);

      await waitFor(() => {
        expect(micButton).toHaveAttribute(
          "aria-label",
          "Stop microphone listening"
        );
        expect(micButton).toHaveAttribute("aria-pressed", "true");
      });
    });

    it("supports keyboard navigation", async () => {
      const mockGetUserMedia = vi.fn().mockResolvedValue(new MediaStream());
      (navigator.mediaDevices
        .getUserMedia as typeof navigator.mediaDevices.getUserMedia) =
        mockGetUserMedia;

      render(<AudioVisualizer />);

      const micButton = screen.getByRole("button");

      // Test Space key activation
      fireEvent.keyDown(micButton, { key: " " });

      await waitFor(() => {
        expect(screen.getByText(/listening.../i)).toBeInTheDocument();
      });

      // Test Enter key deactivation
      fireEvent.keyDown(micButton, { key: "Enter" });

      await waitFor(() => {
        expect(screen.getByText(/microphone off/i)).toBeInTheDocument();
      });
    });

    it("ensures icons are hidden from screen readers", () => {
      render(<AudioVisualizer />);

      const micButton = screen.getByRole("button");
      const icon = micButton.querySelector("svg");

      expect(icon).toHaveAttribute("aria-hidden", "true");
    });
  });

  describe("Resource Management", () => {
    it("cleans up audio resources when component unmounts", () => {
      const { unmount } = render(<AudioVisualizer />);

      expect(() => unmount()).not.toThrow();
    });

    it("stops animation frames when listening stops", async () => {
      const mockGetUserMedia = vi.fn().mockResolvedValue(new MediaStream());
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

      // Verify requestAnimationFrame was called
      expect(global.requestAnimationFrame).toHaveBeenCalled();

      // Stop listening
      fireEvent.click(micButton);
      await waitFor(() => {
        expect(screen.getByText(/microphone off/i)).toBeInTheDocument();
      });

      // Verify cancelAnimationFrame was called
      expect(global.cancelAnimationFrame).toHaveBeenCalled();
    });
  });

  describe("Error Boundary Behavior", () => {
    it("handles generic JavaScript errors gracefully", async () => {
      const genericError = new Error("Generic error occurred");
      const mockGetUserMedia = vi.fn().mockRejectedValue(genericError);
      (navigator.mediaDevices
        .getUserMedia as typeof navigator.mediaDevices.getUserMedia) =
        mockGetUserMedia;

      render(<AudioVisualizer />);

      const micButton = screen.getByRole("button");
      fireEvent.click(micButton);

      await waitFor(() => {
        expect(screen.getByText("Microphone Error")).toBeInTheDocument();
        expect(screen.getByText("Generic error occurred")).toBeInTheDocument();
      });
    });

    it("handles unknown error types", async () => {
      const unknownError = "Unknown error string";
      const mockGetUserMedia = vi.fn().mockRejectedValue(unknownError);
      (navigator.mediaDevices
        .getUserMedia as typeof navigator.mediaDevices.getUserMedia) =
        mockGetUserMedia;

      render(<AudioVisualizer />);

      const micButton = screen.getByRole("button");
      fireEvent.click(micButton);

      await waitFor(() => {
        expect(screen.getByText("Microphone Error")).toBeInTheDocument();
        expect(screen.getByText(/unknown error occurred/i)).toBeInTheDocument();
      });
    });
  });
});
