"use client";

import React, { useEffect } from "react";
import {
  Settings,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  X,
  RotateCw,
  Sliders,
} from "lucide-react";
import { VisualizationSettings } from "../types/visualizations";

interface VisualizationControlsProps {
  settings: VisualizationSettings;
  onToggleEnabled: (id: string) => void;
  onToggleFullPage: (id: string) => void;
  onUpdateCustomSetting?: (
    id: string,
    settingKey: string,
    value: unknown
  ) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
}

const VisualizationControls: React.FC<VisualizationControlsProps> = ({
  settings,
  onToggleEnabled,
  onToggleFullPage,
  onUpdateCustomSetting,
  isOpen,
  onToggleOpen,
}) => {
  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onToggleOpen();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, onToggleOpen]);

  return (
    <div className="relative">
      <button
        onClick={onToggleOpen}
        className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-full shadow-lg shadow-purple-500/30 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-500/50"
        aria-label="Toggle visualization settings"
      >
        <Settings size={20} className="text-white" />
      </button>

      {isOpen && (
        <div className="absolute top-14 right-0 bg-black/90 backdrop-blur-lg rounded-xl p-6 border border-white/10 shadow-2xl min-w-80 z-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">
              Visualization Settings
            </h3>
            <button
              onClick={onToggleOpen}
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-white/20"
              aria-label="Close visualization settings"
              title="Close settings"
            >
              <X size={16} className="text-white" />
            </button>
          </div>

          <div className="space-y-4">
            {Object.values(settings).map((config) => (
              <div key={config.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-white">
                      {config.name}
                    </h4>
                    <p className="text-xs text-gray-400">
                      {config.description}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => onToggleEnabled(config.id)}
                      className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${
                        config.enabled
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-gray-600 hover:bg-gray-500"
                      }`}
                      aria-label={`${config.enabled ? "Disable" : "Enable"} ${config.name}`}
                      title={`${config.enabled ? "Disable" : "Enable"} ${config.name}`}
                    >
                      {config.enabled ? (
                        <Eye size={14} className="text-white" />
                      ) : (
                        <EyeOff size={14} className="text-white" />
                      )}
                    </button>

                    <button
                      onClick={() => onToggleFullPage(config.id)}
                      disabled={!config.enabled}
                      className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${
                        config.enabled
                          ? config.fullPage
                            ? "bg-blue-500 hover:bg-blue-600"
                            : "bg-gray-700 hover:bg-gray-600"
                          : "bg-gray-800 cursor-not-allowed opacity-50"
                      }`}
                      aria-label={`${config.fullPage ? "Exit" : "Enter"} full page for ${config.name}`}
                      title={`${config.fullPage ? "Exit" : "Enter"} full page for ${config.name}`}
                    >
                      {config.fullPage ? (
                        <Minimize2 size={14} className="text-white" />
                      ) : (
                        <Maximize2 size={14} className="text-white" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Galaxy-specific custom settings */}
                {config.id === "galaxyViz" &&
                  config.enabled &&
                  onUpdateCustomSetting && (
                    <div className="mt-3 pt-3 border-t border-gray-700">
                      <div className="space-y-3">
                        {/* Spin Enable/Disable */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <RotateCw size={14} className="text-cyan-400" />
                            <span className="text-xs font-medium text-white">
                              Spin
                            </span>
                          </div>
                          <button
                            onClick={() =>
                              onUpdateCustomSetting(
                                config.id,
                                "spinEnabled",
                                !(config.customSettings?.spinEnabled as boolean)
                              )
                            }
                            className={`w-10 h-5 rounded-full transition-colors relative ${
                              (config.customSettings?.spinEnabled as boolean)
                                ? "bg-cyan-500"
                                : "bg-gray-600"
                            }`}
                            aria-label={`${(config.customSettings?.spinEnabled as boolean) ? "Disable" : "Enable"} galaxy spin`}
                          >
                            <div
                              className={`w-4 h-4 bg-white rounded-full transition-transform absolute top-0.5 ${
                                (config.customSettings?.spinEnabled as boolean)
                                  ? "translate-x-5"
                                  : "translate-x-0.5"
                              }`}
                            />
                          </button>
                        </div>

                        {/* Spin Rate Slider */}
                        {(config.customSettings?.spinEnabled as boolean) && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Sliders
                                  size={14}
                                  className="text-purple-400"
                                />
                                <span className="text-xs font-medium text-white">
                                  Speed
                                </span>
                              </div>
                              <span className="text-xs text-gray-400">
                                {(
                                  (config.customSettings?.spinRate as number) ||
                                  1.0
                                ).toFixed(1)}
                                x
                              </span>
                            </div>
                            <input
                              type="range"
                              min="0.1"
                              max="3.0"
                              step="0.1"
                              value={
                                (config.customSettings?.spinRate as number) ||
                                1.0
                              }
                              onChange={(e) =>
                                onUpdateCustomSetting(
                                  config.id,
                                  "spinRate",
                                  parseFloat(e.target.value)
                                )
                              }
                              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                            />
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>0.1x</span>
                              <span>3.0x</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VisualizationControls;
