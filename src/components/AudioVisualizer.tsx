"use client";

import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff } from "lucide-react";
import {
  getAverageVolume,
  volumeToPercentage,
  initializeAudioAnalysis,
} from "../utils/audio";
import Alert from "./Alert";

const AudioVisualizer: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [audioData, setAudioData] = useState(new Uint8Array(0));
  const [error, setError] = useState<string | null>(null);
  const [isMediaDevicesSupported, setIsMediaDevicesSupported] = useState(true);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationRef = useRef<number | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleToggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleToggleListening();
    }
  };

  const startListening = async (): Promise<void> => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError("Media devices are not supported in this browser.");
        setIsMediaDevicesSupported(false);
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const { audioContext, analyser, dataArray, source } =
        initializeAudioAnalysis(stream);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      sourceRef.current = source;
      dataArrayRef.current = dataArray;

      setIsListening(true);
      setError(null);
      animate();
    } catch (err: unknown) {
      let errorMessage = "An unknown error occurred";

      if (err instanceof DOMException) {
        switch (err.name) {
          case "NotAllowedError":
            errorMessage =
              "Microphone access denied. Please allow microphone access to use this feature.";
            break;
          case "NotFoundError":
            errorMessage =
              "No microphone found. Please connect a microphone and try again.";
            break;
          case "NotReadableError":
            errorMessage =
              "Microphone is already in use by another application.";
            break;
          case "OverconstrainedError":
            errorMessage = "Microphone does not meet the required constraints.";
            break;
          case "SecurityError":
            errorMessage =
              "Microphone access blocked due to security restrictions.";
            break;
          default:
            errorMessage = `Microphone error: ${err.message}`;
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      console.error("Error accessing microphone:", err);
    }
  };

  const stopListening = (): void => {
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    dataArrayRef.current = null;
    setIsListening(false);
  };

  const animate = (): void => {
    if (!analyserRef.current || !dataArrayRef.current) return;

    analyserRef.current.getByteFrequencyData(dataArrayRef.current);
    setAudioData(new Uint8Array(dataArrayRef.current));

    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    // Check for media devices support on component mount
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setIsMediaDevicesSupported(false);
      setError(
        "Media devices are not supported in this browser. Please use a modern browser that supports microphone access."
      );
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const averageVolume = getAverageVolume(audioData);
  const volumePercentage = volumeToPercentage(averageVolume);

  return (
    <div className="text-white">
      <div className="w-full">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">
            Audio Visualizer
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Experience your voice through dynamic visualizations. Enable your
            microphone to see real-time audio graphics.
          </p>
        </header>

        <div className="max-w-4xl mx-auto">
          <div className="bg-black/30 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/10">
            <div className="flex flex-col items-center justify-center mb-8">
              <button
                ref={buttonRef}
                onClick={handleToggleListening}
                onKeyDown={handleKeyDown}
                disabled={!isMediaDevicesSupported}
                aria-label={
                  isListening
                    ? "Stop microphone listening"
                    : "Start microphone listening"
                }
                aria-pressed={isListening}
                className={`flex items-center justify-center w-20 h-20 rounded-full mb-6 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-cyan-500/50 ${
                  !isMediaDevicesSupported
                    ? "bg-gray-500 cursor-not-allowed opacity-50"
                    : isListening
                      ? "bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30"
                      : "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 shadow-lg shadow-cyan-500/30"
                }`}
              >
                {isListening ? (
                  <MicOff size={32} className="text-white" aria-hidden="true" />
                ) : (
                  <Mic size={32} className="text-white" aria-hidden="true" />
                )}
              </button>

              <div className="text-center">
                <h2 className="text-2xl font-semibold mb-2">
                  {isListening ? "Listening..." : "Microphone Off"}
                </h2>
                <p className="text-gray-300">
                  {isListening
                    ? "Speak into your microphone to see visualizations"
                    : "Click the button to enable microphone"}
                </p>
              </div>
            </div>

            {error && (
              <Alert type="error" title="Microphone Error" className="mb-6">
                {error}
              </Alert>
            )}

            {!isMediaDevicesSupported && (
              <Alert
                type="warning"
                title="Browser Not Supported"
                className="mb-6"
              >
                <p className="mb-2">
                  Your browser doesn&apos;t support microphone access. This
                  feature requires a modern browser with Web Audio API support.
                </p>
                <p className="text-sm">
                  Please try using Chrome, Firefox, Safari, or Edge for the best
                  experience.
                </p>
              </Alert>
            )}

            {isListening && (
              <div className="space-y-8">
                {/* Volume Meter */}
                <div className="bg-black/20 rounded-xl p-6">
                  <h3 className="text-xl font-semibold mb-4 text-center">
                    Volume Level
                  </h3>
                  <div className="flex items-center justify-center">
                    <div className="w-full max-w-md h-6 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 transition-all duration-100 ease-out"
                        style={{ width: `${volumePercentage}%` }}
                      ></div>
                    </div>
                    <span className="ml-4 text-lg font-mono">
                      {Math.round(volumePercentage)}%
                    </span>
                  </div>
                </div>

                {/* Frequency Bars Visualization */}
                <div className="bg-black/20 rounded-xl p-6">
                  <h3 className="text-xl font-semibold mb-4 text-center">
                    Frequency Spectrum
                  </h3>
                  <div className="flex items-end justify-center h-48 gap-1">
                    {Array.from(audioData).map((value, index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-t from-cyan-500 to-purple-500 rounded-t-sm transition-all duration-75 ease-out"
                        style={{
                          height: `${Math.max(4, (value / 255) * 100)}%`,
                          width: "18px",
                          opacity: 0.8 + (value / 255) * 0.2,
                        }}
                      ></div>
                    ))}
                  </div>
                </div>

                {/* Circular Visualization */}
                <div className="bg-black/20 rounded-xl p-6">
                  <h3 className="text-xl font-semibold mb-4 text-center">
                    Circular Waveform
                  </h3>
                  <div className="flex justify-center">
                    <div className="relative w-64 h-64">
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="rgba(255,255,255,0.1)"
                          strokeWidth="0.5"
                        />
                        {Array.from(audioData)
                          .slice(0, 64)
                          .map((value, index) => {
                            const angle = (index / 64) * 2 * Math.PI;
                            const length = 5 + (value / 255) * 30;
                            const x1 = 50 + Math.cos(angle) * 40;
                            const y1 = 50 + Math.sin(angle) * 40;
                            const x2 = 50 + Math.cos(angle) * (40 + length);
                            const y2 = 50 + Math.sin(angle) * (40 + length);

                            return (
                              <line
                                key={index}
                                x1={x1}
                                y1={y1}
                                x2={x2}
                                y2={y2}
                                stroke={`hsl(${(index * 6) % 360}, 70%, 60%)`}
                                strokeWidth="0.8"
                                opacity={0.7 + (value / 255) * 0.3}
                              />
                            );
                          })}
                        <circle
                          cx="50"
                          cy="50"
                          r={10 + (volumePercentage / 100) * 15}
                          fill="rgba(139, 92, 246, 0.3)"
                          stroke="rgba(139, 92, 246, 0.8)"
                          strokeWidth="1"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Particle Visualization */}
                <div className="bg-black/20 rounded-xl p-6">
                  <h3 className="text-xl font-semibold mb-4 text-center">
                    Particle Field
                  </h3>
                  <div className="relative h-64 overflow-hidden rounded-lg bg-black/30">
                    {Array.from({ length: 50 }, (_, i) => {
                      const value = audioData[i % audioData.length];
                      const size = 2 + (value / 255) * 8;
                      const left = (i * 13) % 100;
                      const top = (i * 7) % 100;
                      const hue = (i * 10) % 360;

                      return (
                        <div
                          key={i}
                          className="absolute rounded-full transition-all duration-150 ease-out"
                          style={{
                            left: `${left}%`,
                            top: `${top}%`,
                            width: `${size}px`,
                            height: `${size}px`,
                            backgroundColor: `hsl(${hue}, 70%, 60%)`,
                            opacity: 0.3 + (value / 255) * 0.7,
                            transform: `scale(${1 + (value / 255) * 2})`,
                            boxShadow: `0 0 ${size}px hsl(${hue}, 70%, 60%)`,
                          }}
                        ></div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="text-center text-gray-400">
            <p>
              Enable your microphone to experience real-time audio
              visualizations
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioVisualizer;
