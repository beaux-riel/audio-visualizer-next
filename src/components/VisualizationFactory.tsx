"use client";

import React from "react";
import { VisualizationProps } from "../types/visualizations";

// Import all visualization components
import VolumeMeter from "./visualizations/VolumeMeter";
import FrequencySpectrum from "./visualizations/FrequencySpectrum";
import CircularWaveform from "./visualizations/CircularWaveform";
import ParticleField from "./visualizations/ParticleField";
import SpiralWave from "./visualizations/SpiralWave";
import RippleEffect from "./visualizations/RippleEffect";
import GalaxyViz from "./visualizations/GalaxyViz";
import LiquidWave from "./visualizations/LiquidWave";
import NeonGrid from "./visualizations/NeonGrid";

interface VisualizationFactoryProps extends VisualizationProps {
  type: string;
}

const VisualizationFactory: React.FC<VisualizationFactoryProps> = ({
  type,
  ...props
}) => {
  const getVisualizationComponent = () => {
    switch (type) {
      case "volumeMeter":
        return <VolumeMeter {...props} />;
      case "frequencySpectrum":
        return <FrequencySpectrum {...props} />;
      case "circularWaveform":
        return <CircularWaveform {...props} />;
      case "particleField":
        return <ParticleField {...props} />;
      case "spiralWave":
        return <SpiralWave {...props} />;
      case "rippleEffect":
        return <RippleEffect {...props} />;
      case "galaxyViz":
        return <GalaxyViz {...props} />;
      case "liquidWave":
        return <LiquidWave {...props} />;
      case "neonGrid":
        return <NeonGrid {...props} />;
      default:
        return null;
    }
  };

  return getVisualizationComponent();
};

export default VisualizationFactory;
