"use client";

import React from "react";
import { VisualizationProps } from "../../types/visualizations";

const ParticleField: React.FC<VisualizationProps> = ({
  audioData,
  isFullPage = false,
}) => {
  const containerClass = isFullPage
    ? "fixed inset-0 bg-black z-40 flex items-center justify-center"
    : "bg-black/20 rounded-xl p-6";

  const fieldHeight = isFullPage ? "h-96" : "h-64";
  const particleCount = isFullPage ? 100 : 50;

  return (
    <div className={containerClass}>
      {!isFullPage && (
        <h3 className="text-xl font-semibold mb-4 text-center text-white">
          Particle Field
        </h3>
      )}
      <div
        className={`relative ${fieldHeight} ${isFullPage ? "w-full" : ""} overflow-hidden rounded-lg bg-black/30`}
      >
        {Array.from({ length: particleCount }, (_, i) => {
          const value = audioData[i % audioData.length];
          const size = 2 + (value / 255) * (isFullPage ? 12 : 8);
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
  );
};

export default ParticleField;
