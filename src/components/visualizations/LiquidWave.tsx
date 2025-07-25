"use client";

import React from "react";
import { VisualizationProps } from "../../types/visualizations";

const LiquidWave: React.FC<VisualizationProps> = ({
  audioData,
  volumePercentage,
  isFullPage = false,
}) => {
  const containerClass = isFullPage
    ? "fixed inset-0 bg-black z-40 flex items-center justify-center"
    : "bg-black/20 rounded-xl p-6";

  const svgSize = isFullPage ? "w-screen h-screen" : "w-80 h-80";
  const viewBox = isFullPage ? "0 0 200 200" : "0 0 100 100";

  return (
    <div className={containerClass}>
      {!isFullPage && (
        <h3 className="text-xl font-semibold mb-4 text-center text-white">
          Liquid Wave
        </h3>
      )}
      <div className="flex justify-center">
        <svg viewBox={viewBox} className={svgSize}>
          <defs>
            <linearGradient
              id="liquidGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="rgba(6, 182, 212, 0.7)" />
              <stop offset="100%" stopColor="rgba(173, 20, 87, 0.7)" />
            </linearGradient>
          </defs>

          {/* Liquid Wave layers */}
          {Array.from({ length: 5 }, (_, waveIndex) => (
            <g
              key={waveIndex}
              fill="url(#liquidGradient)"
              opacity={0.2 + waveIndex * 0.1}
            >
              {Array.from(audioData)
                .slice(0, 64)
                .map((value, index) => {
                  const waveHeight = (value / 255) * (isFullPage ? 30 : 15);
                  const x = index * (isFullPage ? 3 : 1.5);
                  const y =
                    (isFullPage ? 100 : 50) - waveHeight + waveIndex * 2;

                  return (
                    <rect
                      key={`${waveIndex}-${index}`}
                      x={x + waveIndex * 0.5}
                      y={y}
                      width={isFullPage ? 2 : 1}
                      height={waveHeight}
                      rx="1"
                      ry="1"
                      className="transition-all duration-100 ease-out"
                      transform={`rotate(${waveIndex * 5}, ${x + waveIndex * 0.5}, ${y})`}
                    />
                  );
                })}
            </g>
          ))}

          {/* Flowing wave path */}
          <path
            d={
              `M0 ${isFullPage ? 100 : 50} ` +
              Array.from(audioData)
                .slice(0, 64)
                .map((value, index) => {
                  const waveHeight = (value / 255) * (isFullPage ? 20 : 10);
                  const x = index * (isFullPage ? 3 : 1.5);
                  const y = (isFullPage ? 100 : 50) - waveHeight;
                  return `L${x} ${y}`;
                })
                .join(" ") +
              `L${64 * (isFullPage ? 3 : 1.5)} ${isFullPage ? 100 : 50} Z`
            }
            fill="url(#liquidGradient)"
            opacity="0.6"
            className="transition-all duration-75 ease-out"
          />

          {/* Central pulse */}
          <circle
            cx={isFullPage ? "100" : "50"}
            cy={isFullPage ? "100" : "50"}
            r={3 + (volumePercentage / 100) * (isFullPage ? 12 : 6)}
            fill="url(#liquidGradient)"
            opacity="0.8"
            className="transition-all duration-75 ease-out"
          />
        </svg>
      </div>
    </div>
  );
};

export default LiquidWave;
