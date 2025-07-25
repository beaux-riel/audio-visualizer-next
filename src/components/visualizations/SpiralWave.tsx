"use client";

import React from "react";
import { VisualizationProps } from "../../types/visualizations";

const SpiralWave: React.FC<VisualizationProps> = ({
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
          Spiral Wave
        </h3>
      )}
      <div className="flex justify-center">
        <svg viewBox={viewBox} className={svgSize}>
          <defs>
            <radialGradient id="spiralGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(147, 51, 234, 0.8)" />
              <stop offset="50%" stopColor="rgba(59, 130, 246, 0.6)" />
              <stop offset="100%" stopColor="rgba(16, 185, 129, 0.4)" />
            </radialGradient>
          </defs>

          {/* Background circle */}
          <circle
            cx={isFullPage ? "100" : "50"}
            cy={isFullPage ? "100" : "50"}
            r={isFullPage ? "90" : "45"}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="0.5"
          />

          {/* Spiral waves */}
          {Array.from({ length: 3 }, (_, spiralIndex) => (
            <g key={spiralIndex}>
              {Array.from(audioData)
                .slice(0, 128)
                .map((value, index) => {
                  const center = isFullPage ? 100 : 50;
                  const baseRadius = isFullPage ? 20 : 10;
                  const maxRadius = isFullPage ? 80 : 40;

                  const angle =
                    (index / 128) * 6 * Math.PI + spiralIndex * (Math.PI / 3);
                  const radius =
                    baseRadius + (index / 128) * (maxRadius - baseRadius);
                  const amplitude = (value / 255) * (isFullPage ? 15 : 8);

                  const finalRadius = radius + amplitude;
                  const x = center + Math.cos(angle) * finalRadius;
                  const y = center + Math.sin(angle) * finalRadius;

                  const hue = (index * 3 + spiralIndex * 120) % 360;
                  const opacity = 0.3 + (value / 255) * 0.7;

                  return (
                    <circle
                      key={`${spiralIndex}-${index}`}
                      cx={x}
                      cy={y}
                      r={1 + (value / 255) * (isFullPage ? 3 : 2)}
                      fill={`hsla(${hue}, 70%, 60%, ${opacity})`}
                      filter="blur(0.5px)"
                    />
                  );
                })}
            </g>
          ))}

          {/* Central pulsing core */}
          <circle
            cx={isFullPage ? "100" : "50"}
            cy={isFullPage ? "100" : "50"}
            r={3 + (volumePercentage / 100) * (isFullPage ? 12 : 6)}
            fill="url(#spiralGradient)"
            opacity={0.8}
          />
        </svg>
      </div>
    </div>
  );
};

export default SpiralWave;
