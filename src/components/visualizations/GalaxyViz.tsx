"use client";

import React, { useState, useEffect } from "react";
import { VisualizationProps } from "../../types/visualizations";

const GalaxyViz: React.FC<VisualizationProps> = ({
  audioData,
  volumePercentage,
  isFullPage = false,
  customSettings = {},
}) => {
  const spinEnabled = (customSettings.spinEnabled as boolean) ?? true;
  const spinRate = (customSettings.spinRate as number) ?? 1.0;
  const [animationTime, setAnimationTime] = useState(0);

  // Debug logging
  console.log("GalaxyViz render:", {
    spinEnabled,
    spinRate,
    animationTime,
    customSettings,
  });

  const containerClass = isFullPage
    ? "fixed inset-0 bg-black z-40 flex items-center justify-center"
    : "bg-black/20 rounded-xl p-6";

  const canvasSize = isFullPage ? "w-screen h-screen" : "w-80 h-80";

  // Animation loop for continuous spinning and star twinkling
  useEffect(() => {
    let animationFrameId: number;

    const animate = () => {
      setAnimationTime(Date.now());
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []); // Run animation loop always for stars and conditional spinning

  return (
    <div className={containerClass}>
      {!isFullPage && (
        <h3 className="text-xl font-semibold mb-4 text-center text-white">
          Galaxy Visualization
        </h3>
      )}
      <div className="flex justify-center relative">
        <div className={`relative ${canvasSize} overflow-hidden rounded-lg`}>
          {/* Background stars */}
          {Array.from({ length: 100 }, (_, i) => {
            const x = (i * 13) % 100;
            const y = (i * 17) % 100;
            const size = 1 + Math.random() * 2;
            const twinkle =
              Math.sin(animationTime / (1000 + i * 100)) * 0.5 + 0.5;

            return (
              <div
                key={`star-${i}`}
                className="absolute rounded-full bg-white transition-opacity duration-1000"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  width: `${size}px`,
                  height: `${size}px`,
                  opacity: 0.3 + twinkle * 0.7,
                }}
              />
            );
          })}

          {/* Galaxy arms */}
          {Array.from({ length: 4 }, (_, armIndex) => {
            // Calculate rotation offset based on spin settings
            const baseRotation = spinEnabled
              ? animationTime / (2000 / spinRate)
              : 0;
            const armRotation = baseRotation + armIndex * (Math.PI / 2);

            // Debug rotation values
            if (armIndex === 0) {
              console.log("Rotation debug:", {
                animationTime,
                spinEnabled,
                spinRate,
                baseRotation,
                armRotation,
              });
            }

            return (
              <div key={`arm-${armIndex}`} className="absolute inset-0">
                {Array.from(audioData)
                  .slice(0, 64)
                  .map((value, index) => {
                    const angle = (index / 64) * 2 * Math.PI;
                    const spiralAngle =
                      angle + (index / 64) * Math.PI * 3 + armRotation;
                    const distance = 10 + (index / 64) * (isFullPage ? 45 : 35);

                    const x = 50 + Math.cos(spiralAngle) * distance;
                    const y = 50 + Math.sin(spiralAngle) * distance;

                    const intensity = value / 255;
                    const size = 2 + intensity * (isFullPage ? 8 : 4);
                    const hue = (armIndex * 90 + index * 4) % 360;

                    return (
                      <div
                        key={`${armIndex}-${index}`}
                        className="absolute rounded-full"
                        style={{
                          left: `${x}%`,
                          top: `${y}%`,
                          width: `${size}px`,
                          height: `${size}px`,
                          backgroundColor: `hsl(${hue}, 80%, 60%)`,
                          opacity: 0.4 + intensity * 0.6,
                          transform: `translate(-50%, -50%) scale(${1 + intensity})`,
                          boxShadow: `0 0 ${size * 2}px hsl(${hue}, 80%, 60%)`,
                          filter: `blur(${intensity * 2}px)`,
                        }}
                      />
                    );
                  })}
              </div>
            );
          })}

          {/* Central black hole */}
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-75 ease-out"
            style={{
              width: `${10 + (volumePercentage / 100) * (isFullPage ? 40 : 20)}px`,
              height: `${10 + (volumePercentage / 100) * (isFullPage ? 40 : 20)}px`,
              background: `radial-gradient(circle, 
                rgba(0, 0, 0, 1) 0%, 
                rgba(147, 51, 234, 0.8) 50%, 
                rgba(59, 130, 246, 0.4) 80%, 
                transparent 100%)`,
              boxShadow: `
                0 0 ${20 + volumePercentage}px rgba(147, 51, 234, 0.8),
                inset 0 0 ${10 + volumePercentage / 2}px rgba(0, 0, 0, 1)
              `,
            }}
          />

          {/* Accretion disk */}
          <div className="absolute inset-0">
            {Array.from({ length: 32 }, (_, i) => {
              const baseAngle = (i / 32) * 2 * Math.PI;
              const diskRotation = spinEnabled
                ? animationTime / (1500 / spinRate)
                : 0;
              const angle = baseAngle + diskRotation;
              const radius = 15 + (i % 8) * 3;
              const audioValue = audioData[i * 4] || 0;
              const finalRadius = radius + (audioValue / 255) * 10;

              const x = 50 + Math.cos(angle) * finalRadius;
              const y = 50 + Math.sin(angle) * finalRadius;

              return (
                <div
                  key={`disk-${i}`}
                  className="absolute rounded-full transition-all duration-100"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    width: `${2 + (audioValue / 255) * 4}px`,
                    height: `${2 + (audioValue / 255) * 4}px`,
                    backgroundColor: `hsl(${30 + i * 8}, 90%, 70%)`,
                    opacity: 0.6 + (audioValue / 255) * 0.4,
                    transform: "translate(-50%, -50%)",
                    boxShadow: `0 0 ${4 + audioValue / 50}px hsl(${30 + i * 8}, 90%, 70%)`,
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalaxyViz;
