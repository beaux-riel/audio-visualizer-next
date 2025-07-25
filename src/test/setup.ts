import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock Web Audio API
class MockAudioContext {
  createAnalyser = vi.fn(() => ({
    getByteFrequencyData: vi.fn(),
    frequencyBinCount: 128,
    fftSize: 256,
    connect: vi.fn(),
    disconnect: vi.fn(),
  }));

  createMediaStreamSource = vi.fn(() => ({
    connect: vi.fn(),
    disconnect: vi.fn(),
  }));

  close = vi.fn();

  state = "running";
  sampleRate = 44100;
}

// Mock Web Audio API globals
(global as typeof global & { AudioContext: typeof AudioContext }).AudioContext =
  MockAudioContext as typeof AudioContext;
(
  global as typeof global & { webkitAudioContext: typeof AudioContext }
).webkitAudioContext = MockAudioContext as typeof AudioContext;

// Mock MediaDevices API
const mockMediaDevices = {
  getUserMedia: vi.fn(),
};

Object.defineProperty(global.navigator, "mediaDevices", {
  value: mockMediaDevices,
  writable: true,
  configurable: true,
});

// Mock requestAnimationFrame and cancelAnimationFrame
global.requestAnimationFrame = vi.fn((callback) => {
  setTimeout(callback, 16);
  return 1;
});

global.cancelAnimationFrame = vi.fn();

// Mock MediaStream
class MockMediaStream {
  id = "test-stream";
  active = true;

  getTracks = vi.fn(() => [
    {
      stop: vi.fn(),
      enabled: true,
      kind: "audio",
      label: "test-audio-track",
    },
  ]);

  getAudioTracks = vi.fn(() => this.getTracks());
  getVideoTracks = vi.fn(() => []);
}

(
  global as typeof global & { MediaStream: typeof MockMediaStream }
).MediaStream = MockMediaStream;

// Mock DOMException for testing permission errors
(global as typeof global & { DOMException: typeof DOMException }).DOMException =
  class DOMException extends Error {
    name: string;

    constructor(message: string, name: string) {
      super(message);
      this.name = name;
    }
  };
