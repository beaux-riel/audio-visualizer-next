/**
 * Tests for audio utility functions
 */

import {
  getAverageVolume,
  volumeToPercentage,
  createAudioContext,
  isAudioContextSupported,
  initializeAudioAnalysis,
} from "../audio";
import { vi, beforeEach } from "vitest";

describe("Audio Utility Functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAverageVolume", () => {
    it("should return 0 for empty array", () => {
      const emptyArray = new Uint8Array(0);
      expect(getAverageVolume(emptyArray)).toBe(0);
    });

    it("should calculate correct average for single value", () => {
      const singleValue = new Uint8Array([100]);
      expect(getAverageVolume(singleValue)).toBe(100);
    });

    it("should calculate correct average for multiple values", () => {
      const multipleValues = new Uint8Array([100, 200, 50, 150]);
      const expectedAverage = (100 + 200 + 50 + 150) / 4;
      expect(getAverageVolume(multipleValues)).toBe(expectedAverage);
    });

    it("should handle maximum value (255)", () => {
      const maxValues = new Uint8Array([255, 255, 255]);
      expect(getAverageVolume(maxValues)).toBe(255);
    });

    it("should handle minimum value (0)", () => {
      const minValues = new Uint8Array([0, 0, 0]);
      expect(getAverageVolume(minValues)).toBe(0);
    });

    it("should return correct value for realistic audio data", () => {
      // Simulate realistic audio frequency data
      const audioData = new Uint8Array([
        10, 25, 50, 75, 100, 80, 60, 40, 30, 20,
      ]);
      const expected = (10 + 25 + 50 + 75 + 100 + 80 + 60 + 40 + 30 + 20) / 10;
      expect(getAverageVolume(audioData)).toBe(expected);
    });

    it("should handle large arrays efficiently", () => {
      const largeArray = new Uint8Array(1024).fill(128);
      expect(getAverageVolume(largeArray)).toBe(128);
    });
  });

  describe("volumeToPercentage", () => {
    it("should convert 0 volume to 0%", () => {
      expect(volumeToPercentage(0)).toBe(0);
    });

    it("should convert 255 volume to 100%", () => {
      expect(volumeToPercentage(255)).toBe(100);
    });

    it("should convert 127.5 volume to 50%", () => {
      expect(volumeToPercentage(127.5)).toBe(50);
    });

    it("should cap percentage at 100%", () => {
      expect(volumeToPercentage(300)).toBe(100);
    });

    it("should handle decimal input correctly", () => {
      expect(volumeToPercentage(51)).toBeCloseTo(20, 1);
    });

    it("should handle edge cases properly", () => {
      expect(volumeToPercentage(-10)).toBeCloseTo(-3.92, 2); // Negative values
      expect(volumeToPercentage(255.5)).toBe(100); // Values slightly above 255
    });

    it("should provide consistent results for boundary values", () => {
      expect(volumeToPercentage(1)).toBeCloseTo(0.39, 2);
      expect(volumeToPercentage(254)).toBeCloseTo(99.61, 2);
    });
  });

  describe("createAudioContext", () => {
    it("should create an AudioContext instance", () => {
      const context = createAudioContext();
      expect(context).toBeDefined();
      expect(typeof context).toBe("object");
      expect(context.createAnalyser).toBeDefined();
      expect(context.createMediaStreamSource).toBeDefined();
      expect(context.close).toBeDefined();
    });

    it("should use webkitAudioContext as fallback when AudioContext is not available", () => {
      // Temporarily remove AudioContext
      const originalAudioContext = (
        window as typeof window & { AudioContext?: typeof AudioContext }
      ).AudioContext;
      delete (window as typeof window & { AudioContext?: typeof AudioContext })
        .AudioContext;

      const context = createAudioContext();
      expect(context).toBeDefined();
      expect(typeof context).toBe("object");

      // Restore AudioContext
      (
        window as typeof window & { AudioContext?: typeof AudioContext }
      ).AudioContext = originalAudioContext;
    });
  });

  describe("isAudioContextSupported", () => {
    it("should return true when AudioContext is available", () => {
      expect(isAudioContextSupported()).toBe(true);
    });

    it("should return true when webkitAudioContext is available", () => {
      // Temporarily remove AudioContext
      const originalAudioContext = (
        window as typeof window & { AudioContext?: typeof AudioContext }
      ).AudioContext;
      delete (window as typeof window & { AudioContext?: typeof AudioContext })
        .AudioContext;

      expect(isAudioContextSupported()).toBe(true);

      // Restore AudioContext
      (
        window as typeof window & { AudioContext?: typeof AudioContext }
      ).AudioContext = originalAudioContext;
    });

    it("should return false when neither AudioContext nor webkitAudioContext is available", () => {
      // Temporarily remove both
      const originalAudioContext = (
        window as typeof window & { AudioContext?: typeof AudioContext }
      ).AudioContext;
      const originalWebkitAudioContext = (
        window as typeof window & { webkitAudioContext?: typeof AudioContext }
      ).webkitAudioContext;

      delete (window as typeof window & { AudioContext?: typeof AudioContext })
        .AudioContext;
      delete (
        window as typeof window & { webkitAudioContext?: typeof AudioContext }
      ).webkitAudioContext;

      expect(isAudioContextSupported()).toBe(false);

      // Restore both
      (
        window as typeof window & { AudioContext?: typeof AudioContext }
      ).AudioContext = originalAudioContext;
      (
        window as typeof window & { webkitAudioContext?: typeof AudioContext }
      ).webkitAudioContext = originalWebkitAudioContext;
    });
  });

  describe("initializeAudioAnalysis", () => {
    it("should initialize audio analysis components correctly", () => {
      const mockStream = new MediaStream() as MediaStream;
      const result = initializeAudioAnalysis(mockStream);

      expect(result).toHaveProperty("audioContext");
      expect(result).toHaveProperty("analyser");
      expect(result).toHaveProperty("dataArray");
      expect(result).toHaveProperty("source");

      // Verify the data array is properly sized
      expect(result.dataArray).toBeInstanceOf(Uint8Array);
      expect(result.dataArray.length).toBe(128); // frequencyBinCount from our mock
    });

    it("should connect source to analyser", () => {
      const mockStream = new MediaStream() as MediaStream;
      const result = initializeAudioAnalysis(mockStream);

      // Verify that connect was called on the source
      expect(result.source.connect).toHaveBeenCalledWith(result.analyser);
    });

    it("should set correct analyser properties", () => {
      const mockStream = new MediaStream() as MediaStream;
      const result = initializeAudioAnalysis(mockStream);

      // Verify analyser settings
      expect(result.analyser.fftSize).toBe(256);
    });
  });
});
