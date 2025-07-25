"use client";

import React from "react";
import { VisualizationProps } from "../../types/visualizations";

const FrequencySpectrum: React.FC<VisualizationProps> = ({
  audioData,
  isFullPage = false,
}) => {
  const containerClass = isFullPage
    ? "fixed inset-0 bg-black z-40 flex items-center justify-center"
    : "bg-black/20 rounded-xl p-6";

  const containerHeight = isFullPage ? "h-96" : "h-48";
  const barWidth = isFullPage ? "24px" : "18px";

  return (
    <div className={containerClass}>
      {!isFullPage && (
        <h3 className="text-xl font-semibold mb-4 text-center text-white">
          Frequency Spectrum
        </h3>
      )}
      <div
        className={`flex items-end justify-center ${containerHeight} gap-1 ${isFullPage ? "w-full px-8" : ""}`}
      >
        {Array.from(audioData).map((value, index) => (
          <div
            key={index}
            className="bg-gradient-to-t from-cyan-500 to-purple-500 rounded-t-sm transition-all duration-75 ease-out"
            style={{
              height: `${Math.max(4, (value / 255) * 100)}%`,
              width: barWidth,
              opacity: 0.8 + (value / 255) * 0.2,
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default FrequencySpectrum;
