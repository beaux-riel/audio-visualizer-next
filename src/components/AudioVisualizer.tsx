"use client";

import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, X } from "lucide-react";
import {
  getAverageVolume,
  volumeToPercentage,
  initializeAudioAnalysis,
} from "../utils/audio";
import {
  loadVisualizationSettings,
  saveVisualizationSettings,
  toggleVisualizationEnabled,
  toggleVisualizationFullPage,
  updateVisualizationCustomSetting,
  getEnabledVisualizations,
  getFullPageVisualization,
} from "../utils/visualizations";
import Alert from "./Alert";
import VisualizationControls from "./VisualizationControls";
import VisualizationFactory from "./VisualizationFactory";
import { VisualizationSettings } from "../types/visualizations";

const AudioVisualizer: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [audioData, setAudioData] = useState(new Uint8Array(0));
  const [error, setError] = useState<string | null>(null);
  const [isMediaDevicesSupported, setIsMediaDevicesSupported] = useState(true);
  const [visualizationSettings, setVisualizationSettings] =
    useState<VisualizationSettings>(() => loadVisualizationSettings());
  const [isControlsOpen, setIsControlsOpen] = useState(false);
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

    if (typeof window !== "undefined") {
      animationRef.current = requestAnimationFrame(animate);
    }
  };

  // Visualization handlers
  const handleToggleEnabled = (id: string) => {
    const newSettings = toggleVisualizationEnabled(visualizationSettings, id);
    setVisualizationSettings(newSettings);
    saveVisualizationSettings(newSettings);
  };

  const handleToggleFullPage = (id: string) => {
    const newSettings = toggleVisualizationFullPage(visualizationSettings, id);
    setVisualizationSettings(newSettings);
    saveVisualizationSettings(newSettings);

    // Auto-close the controls modal when entering full-page mode
    if (newSettings[id]?.fullPage) {
      setIsControlsOpen(false);
    }
  };

  const handleUpdateCustomSetting = (
    id: string,
    settingKey: string,
    value: unknown
  ) => {
    const newSettings = updateVisualizationCustomSetting(
      visualizationSettings,
      id,
      settingKey,
      value
    );
    setVisualizationSettings(newSettings);
    saveVisualizationSettings(newSettings);
  };

  const handleCloseFullPage = () => {
    const fullPageViz = getFullPageVisualization(visualizationSettings);
    if (fullPageViz) {
      handleToggleFullPage(fullPageViz);
    }
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
  const enabledVisualizations = getEnabledVisualizations(visualizationSettings);
  const fullPageVisualization = getFullPageVisualization(visualizationSettings);

  // Common props for all visualizations
  const visualizationProps = {
    audioData,
    isListening,
    volumePercentage,
    averageVolume,
  };

  return (
    <>
      {/* Full-page visualization overlay */}
      {fullPageVisualization && (
        <div className="fixed inset-0 z-50">
          <button
            onClick={handleCloseFullPage}
            className="absolute top-6 right-6 z-50 flex items-center justify-center w-12 h-12 bg-black/80 hover:bg-black/90 rounded-full transition-colors focus:outline-none focus:ring-4 focus:ring-white/20"
            aria-label="Exit full-page view"
          >
            <X size={20} className="text-white" />
          </button>
          <VisualizationFactory
            type={fullPageVisualization}
            {...visualizationProps}
            customSettings={
              visualizationSettings[fullPageVisualization]?.customSettings
            }
            isFullPage={true}
          />
        </div>
      )}

      <div className="text-white">
        <div className="w-full">
          <header className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">
                Audio Visualizer
              </h1>
              {isListening && (
                <div className="ml-6">
                  <VisualizationControls
                    settings={visualizationSettings}
                    onToggleEnabled={handleToggleEnabled}
                    onToggleFullPage={handleToggleFullPage}
                    onUpdateCustomSetting={handleUpdateCustomSetting}
                    isOpen={isControlsOpen}
                    onToggleOpen={() => setIsControlsOpen(!isControlsOpen)}
                  />
                </div>
              )}
            </div>
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
                    <MicOff
                      size={32}
                      className="text-white"
                      aria-hidden="true"
                    />
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
                    feature requires a modern browser with Web Audio API
                    support.
                  </p>
                  <p className="text-sm">
                    Please try using Chrome, Firefox, Safari, or Edge for the
                    best experience.
                  </p>
                </Alert>
              )}

              {isListening && (
                <div className="space-y-8">
                  {enabledVisualizations.map((vizType) => (
                    <VisualizationFactory
                      key={vizType}
                      type={vizType}
                      {...visualizationProps}
                      customSettings={
                        visualizationSettings[vizType]?.customSettings
                      }
                      isFullPage={false}
                    />
                  ))}
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
    </>
  );
};

export default AudioVisualizer;
