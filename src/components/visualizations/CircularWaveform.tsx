"use client";

import React from "react";
import { VisualizationProps } from "../../types/visualizations";

const CircularWaveform: React.FC<VisualizationProps> = ({
  audioData,
  volumePercentage,
  isFullPage = false,
}) => {
  const containerClass = isFullPage
    ? "fixed inset-0 bg-black z-40 flex items-center justify-center"
    : "bg-black/20 rounded-xl p-6";

  const svgSize = isFullPage ? "w-96 h-96" : "w-64 h-64";
  const viewBox = isFullPage ? "0 0 120 120" : "0 0 100 100";

  return (
    <div className={containerClass}>
      {!isFullPage && (
        <h3 className="text-xl font-semibold mb-4 text-center text-white">
          Circular Waveform
        </h3>
      )}
      <div className="flex justify-center">
        <div className={`relative ${svgSize}`}>
          <svg viewBox={viewBox} className="w-full h-full">
            <circle
              cx={isFullPage ? "60" : "50"}
              cy={isFullPage ? "60" : "50"}
              r={isFullPage ? "55" : "45"}
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="0.5"
            />
            {Array.from(audioData)
              .slice(0, 64)
              .map((value, index) => {
                const center = isFullPage ? 60 : 50;
                const baseRadius = isFullPage ? 45 : 40;
                const angle = (index / 64) * 2 * Math.PI;
                const length = 5 + (value / 255) * (isFullPage ? 35 : 30);
                const x1 = center + Math.cos(angle) * baseRadius;
                const y1 = center + Math.sin(angle) * baseRadius;
                const x2 = center + Math.cos(angle) * (baseRadius + length);
                const y2 = center + Math.sin(angle) * (baseRadius + length);

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
              cx={isFullPage ? "60" : "50"}
              cy={isFullPage ? "60" : "50"}
              r={10 + (volumePercentage / 100) * (isFullPage ? 20 : 15)}
              fill="rgba(139, 92, 246, 0.3)"
              stroke="rgba(139, 92, 246, 0.8)"
              strokeWidth="1"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default CircularWaveform;
