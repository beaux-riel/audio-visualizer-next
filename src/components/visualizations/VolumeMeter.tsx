"use client";

import React from "react";
import { VisualizationProps } from "../../types/visualizations";

const VolumeMeter: React.FC<VisualizationProps> = ({
  volumePercentage,
  isFullPage = false,
}) => {
  const containerClass = isFullPage
    ? "fixed inset-0 bg-black z-40 flex items-center justify-center"
    : "bg-black/20 rounded-xl p-6";

  return (
    <div className={containerClass}>
      {!isFullPage && (
        <h3 className="text-xl font-semibold mb-4 text-center text-white">
          Volume Level
        </h3>
      )}
      <div className="flex items-center justify-center">
        <div
          className={`${isFullPage ? "w-96 h-12" : "w-full max-w-md h-6"} bg-gray-700 rounded-full overflow-hidden`}
        >
          <div
            className="h-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 transition-all duration-100 ease-out"
            style={{ width: `${volumePercentage}%` }}
          ></div>
        </div>
        <span
          className={`ml-4 ${isFullPage ? "text-3xl" : "text-lg"} font-mono text-white`}
        >
          {Math.round(volumePercentage)}%
        </span>
      </div>
    </div>
  );
};

export default VolumeMeter;
