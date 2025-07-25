/**
 * Audio utility functions for audio processing and analysis
 */

/**
 * Calculates the average volume from audio frequency data
 * @param data - Uint8Array containing frequency data from Web Audio API
 * @returns Average volume as a number between 0 and 255
 */
export const getAverageVolume = (data: Uint8Array): number => {
  if (data.length === 0) return 0;
  const sum = data.reduce((acc: number, val: number) => acc + val, 0);
  return sum / data.length;
};

/**
 * Converts volume to percentage (0-100)
 * @param volume - Volume value (0-255)
 * @returns Percentage value (0-100), capped at 100
 */
export const volumeToPercentage = (volume: number): number => {
  return Math.min(100, (volume / 255) * 100);
};

/**
 * Creates an AudioContext with cross-browser compatibility
 * @returns AudioContext instance
 */
export const createAudioContext = (): AudioContext => {
  const AudioContextClass =
    window.AudioContext ||
    (window as typeof window & { webkitAudioContext: typeof AudioContext })
      .webkitAudioContext;
  return new AudioContextClass();
};

/**
 * Type guard to check if AudioContext is available
 * @returns boolean indicating if AudioContext is supported
 */
export const isAudioContextSupported = (): boolean => {
  return !!(
    window.AudioContext ||
    (window as typeof window & { webkitAudioContext: typeof AudioContext })
      .webkitAudioContext
  );
};

/**
 * Initializes audio analysis setup
 * @param stream - MediaStream from getUserMedia
 * @returns Object containing AudioContext, AnalyserNode, and data array
 */
export const initializeAudioAnalysis = (
  stream: MediaStream
): {
  audioContext: AudioContext;
  analyser: AnalyserNode;
  dataArray: Uint8Array;
  source: MediaStreamAudioSourceNode;
} => {
  const audioContext = createAudioContext();
  const analyser = audioContext.createAnalyser();
  const source = audioContext.createMediaStreamSource(stream);

  source.connect(analyser);
  analyser.fftSize = 256;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  return {
    audioContext,
    analyser,
    dataArray,
    source,
  };
};
