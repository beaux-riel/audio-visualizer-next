export interface VisualizationConfig {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  fullPage: boolean;
  customSettings?: Record<string, unknown>;
}

export interface VisualizationProps {
  audioData: Uint8Array;
  isListening: boolean;
  volumePercentage: number;
  averageVolume: number;
  isFullPage?: boolean;
  onToggleFullPage?: () => void;
  customSettings?: Record<string, unknown>;
}

export type VisualizationType =
  | "volumeMeter"
  | "frequencySpectrum"
  | "circularWaveform"
  | "particleField"
  | "spiralWave"
  | "rippleEffect"
  | "galaxyViz"
  | "liquidWave"
  | "neonGrid";

export interface VisualizationSettings {
  [key: string]: VisualizationConfig;
}
