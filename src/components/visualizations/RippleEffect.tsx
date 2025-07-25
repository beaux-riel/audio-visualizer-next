"use client";

import React from "react";
import { VisualizationProps } from "../../types/visualizations";

const RippleEffect: React.FC<VisualizationProps> = ({
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
          Ripple Effect
        </h3>
      )}
      <div className="flex justify-center">
        <svg
          viewBox={viewBox}
          className={svgSize}
          style={{ overflow: "visible" }}
        >
          <defs>
            <radialGradient id="rippleGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(59, 130, 246, 0.8)" />
              <stop offset="50%" stopColor="rgba(147, 51, 234, 0.4)" />
              <stop offset="100%" stopColor="rgba(16, 185, 129, 0.1)" />
            </radialGradient>
          </defs>

          {/* Multiple ripple layers */}
          {Array.from({ length: 8 }, (_, rippleIndex) => {
            const center = isFullPage ? 100 : 50;
            const baseRadius = 5 + rippleIndex * (isFullPage ? 15 : 8);
            const audioValue = audioData[rippleIndex * 16] || 0;
            const radius =
              baseRadius + (audioValue / 255) * (isFullPage ? 30 : 15);
            const opacity = Math.max(
              0.1,
              (audioValue / 255) * 0.8 - rippleIndex * 0.1
            );

            return (
              <circle
                key={rippleIndex}
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={`hsl(${(rippleIndex * 45 + Date.now() / 20) % 360}, 70%, 60%)`}
                strokeWidth={isFullPage ? "2" : "1"}
                opacity={opacity}
                className="transition-all duration-100 ease-out"
              />
            );
          })}

          {/* Dynamic frequency ripples */}
          {Array.from(audioData)
            .slice(0, 32)
            .map((value, index) => {
              if (value < 50) return null; // Only show for significant frequencies

              const center = isFullPage ? 100 : 50;
              const angle = (index / 32) * 2 * Math.PI;
              const distance =
                (isFullPage ? 40 : 20) + (value / 255) * (isFullPage ? 50 : 25);

              const x = center + Math.cos(angle) * distance;
              const y = center + Math.sin(angle) * distance;
              const rippleRadius = 2 + (value / 255) * (isFullPage ? 12 : 6);

              return (
                <g key={index}>
                  <circle
                    cx={x}
                    cy={y}
                    r={rippleRadius}
                    fill="none"
                    stroke={`hsl(${(index * 11) % 360}, 80%, 70%)`}
                    strokeWidth="1"
                    opacity={0.6 + (value / 255) * 0.4}
                  />
                  <circle
                    cx={x}
                    cy={y}
                    r={rippleRadius * 0.6}
                    fill={`hsla(${(index * 11) % 360}, 80%, 70%, 0.3)`}
                  />
                </g>
              );
            })}

          {/* Central source */}
          <circle
            cx={isFullPage ? "100" : "50"}
            cy={isFullPage ? "100" : "50"}
            r={2 + (volumePercentage / 100) * (isFullPage ? 8 : 4)}
            fill="url(#rippleGradient)"
            className="transition-all duration-75 ease-out"
          />

          {/* Outer glow */}
          <circle
            cx={isFullPage ? "100" : "50"}
            cy={isFullPage ? "100" : "50"}
            r={5 + (volumePercentage / 100) * (isFullPage ? 20 : 10)}
            fill="none"
            stroke="rgba(59, 130, 246, 0.3)"
            strokeWidth="1"
            opacity={volumePercentage / 100}
            filter="blur(2px)"
          />
        </svg>
      </div>
    </div>
  );
};

export default RippleEffect;
