"use client";

import React from "react";
import { VisualizationProps } from "../../types/visualizations";

const NeonGrid: React.FC<VisualizationProps> = ({
  audioData,
  volumePercentage,
  isFullPage = false,
}) => {
  const containerClass = isFullPage
    ? "fixed inset-0 bg-black z-40 flex items-center justify-center"
    : "bg-black/20 rounded-xl p-6";

  const gridSize = isFullPage ? "w-screen h-screen" : "w-80 h-80";
  const gridCols = isFullPage ? 20 : 12;
  const gridRows = isFullPage ? 15 : 10;

  return (
    <div className={containerClass}>
      {!isFullPage && (
        <h3 className="text-xl font-semibold mb-4 text-center text-white">
          Neon Grid
        </h3>
      )}
      <div className="flex justify-center">
        <div className={`relative ${gridSize} overflow-hidden rounded-lg`}>
          {/* Grid lines */}
          <svg className="absolute inset-0 w-full h-full">
            <defs>
              <linearGradient
                id="neonGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="rgba(0, 255, 255, 0.8)" />
                <stop offset="50%" stopColor="rgba(255, 0, 255, 0.6)" />
                <stop offset="100%" stopColor="rgba(255, 255, 0, 0.4)" />
              </linearGradient>
            </defs>

            {/* Horizontal grid lines */}
            {Array.from({ length: gridRows + 1 }, (_, i) => (
              <line
                key={`h-${i}`}
                x1="0"
                y1={`${(i / gridRows) * 100}%`}
                x2="100%"
                y2={`${(i / gridRows) * 100}%`}
                stroke="rgba(0, 255, 255, 0.2)"
                strokeWidth="1"
                className="transition-opacity duration-300"
                style={{
                  opacity: 0.3 + ((audioData[i * 8] || 0) / 255) * 0.7,
                  filter: `drop-shadow(0 0 ${2 + (audioData[i * 8] || 0) / 50}px rgba(0, 255, 255, 0.8))`,
                }}
              />
            ))}

            {/* Vertical grid lines */}
            {Array.from({ length: gridCols + 1 }, (_, i) => (
              <line
                key={`v-${i}`}
                x1={`${(i / gridCols) * 100}%`}
                y1="0"
                x2={`${(i / gridCols) * 100}%`}
                y2="100%"
                stroke="rgba(255, 0, 255, 0.2)"
                strokeWidth="1"
                className="transition-opacity duration-300"
                style={{
                  opacity: 0.3 + ((audioData[i * 6] || 0) / 255) * 0.7,
                  filter: `drop-shadow(0 0 ${2 + (audioData[i * 6] || 0) / 50}px rgba(255, 0, 255, 0.8))`,
                }}
              />
            ))}
          </svg>

          {/* Grid cells with audio response */}
          {Array.from({ length: gridRows }, (_, row) =>
            Array.from({ length: gridCols }, (_, col) => {
              const index = row * gridCols + col;
              const audioValue = audioData[index % audioData.length] || 0;
              const intensity = audioValue / 255;

              const cellWidth = 100 / gridCols;
              const cellHeight = 100 / gridRows;

              if (intensity < 0.2) return null; // Only show active cells

              return (
                <div
                  key={`cell-${row}-${col}`}
                  className="absolute transition-all duration-150 ease-out"
                  style={{
                    left: `${col * cellWidth}%`,
                    top: `${row * cellHeight}%`,
                    width: `${cellWidth}%`,
                    height: `${cellHeight}%`,
                    background: `radial-gradient(circle, 
                      hsla(${(index * 20) % 360}, 100%, 60%, ${intensity * 0.8}) 0%,
                      hsla(${(index * 20) % 360}, 100%, 60%, ${intensity * 0.3}) 50%,
                      transparent 80%)`,
                    boxShadow: `
                      inset 0 0 ${5 + intensity * 10}px hsla(${(index * 20) % 360}, 100%, 60%, 0.6),
                      0 0 ${10 + intensity * 20}px hsla(${(index * 20) % 360}, 100%, 60%, 0.4)
                    `,
                    transform: `scale(${0.8 + intensity * 0.4})`,
                  }}
                />
              );
            })
          )}

          {/* Central scanner line */}
          <div
            className="absolute inset-0 transition-all duration-100 ease-out"
            style={{
              background: `linear-gradient(${(Date.now() / 20) % 360}deg, 
                transparent 0%, 
                rgba(0, 255, 255, ${volumePercentage / 200}) 50%, 
                transparent 100%)`,
              transform: `rotate(${(Date.now() / 50) % 360}deg)`,
              transformOrigin: "center",
            }}
          />

          {/* Corner energy nodes */}
          {[
            { x: 10, y: 10 },
            { x: 90, y: 10 },
            { x: 10, y: 90 },
            { x: 90, y: 90 },
          ].map((corner, i) => (
            <div
              key={`corner-${i}`}
              className="absolute rounded-full transition-all duration-200"
              style={{
                left: `${corner.x}%`,
                top: `${corner.y}%`,
                width: `${4 + (volumePercentage / 100) * (isFullPage ? 12 : 6)}px`,
                height: `${4 + (volumePercentage / 100) * (isFullPage ? 12 : 6)}px`,
                background: `radial-gradient(circle, 
                  rgba(255, 255, 0, 0.9) 0%, 
                  rgba(255, 0, 255, 0.5) 50%, 
                  transparent 100%)`,
                boxShadow: `0 0 ${10 + volumePercentage / 2}px rgba(255, 255, 0, 0.8)`,
                transform: "translate(-50%, -50%)",
              }}
            />
          ))}

          {/* Central power core */}
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-75"
            style={{
              width: `${8 + (volumePercentage / 100) * (isFullPage ? 24 : 12)}px`,
              height: `${8 + (volumePercentage / 100) * (isFullPage ? 24 : 12)}px`,
              background: `radial-gradient(circle, 
                rgba(255, 255, 255, 1) 0%, 
                rgba(0, 255, 255, 0.8) 30%, 
                rgba(255, 0, 255, 0.4) 70%, 
                transparent 100%)`,
              boxShadow: `
                0 0 ${20 + volumePercentage}px rgba(255, 255, 255, 0.8),
                0 0 ${40 + volumePercentage * 2}px rgba(0, 255, 255, 0.4)
              `,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default NeonGrid;
