import { VisualizationSettings } from "../types/visualizations";

export const defaultVisualizationSettings: VisualizationSettings = {
  volumeMeter: {
    id: "volumeMeter",
    name: "Volume Meter",
    description: "Real-time volume level indicator",
    enabled: true,
    fullPage: false,
  },
  frequencySpectrum: {
    id: "frequencySpectrum",
    name: "Frequency Spectrum",
    description: "Audio frequency bars visualization",
    enabled: true,
    fullPage: false,
  },
  circularWaveform: {
    id: "circularWaveform",
    name: "Circular Waveform",
    description: "Radial audio waveform display",
    enabled: true,
    fullPage: false,
  },
  particleField: {
    id: "particleField",
    name: "Particle Field",
    description: "Dynamic particle system responding to audio",
    enabled: true,
    fullPage: false,
  },
  spiralWave: {
    id: "spiralWave",
    name: "Spiral Wave",
    description: "Hypnotic spiral pattern with audio response",
    enabled: false,
    fullPage: false,
  },
  rippleEffect: {
    id: "rippleEffect",
    name: "Ripple Effect",
    description: "Concentric ripples emanating from center",
    enabled: false,
    fullPage: false,
  },
  galaxyViz: {
    id: "galaxyViz",
    name: "Galaxy Visualization",
    description: "Cosmic galaxy with spiral arms and black hole",
    enabled: false,
    fullPage: false,
    customSettings: {
      spinEnabled: true,
      spinRate: 1.0, // 1.0 = normal speed, 0.5 = half speed, 2.0 = double speed
    },
  },
  liquidWave: {
    id: "liquidWave",
    name: "Liquid Wave",
    description: "Flowing liquid-like waveform patterns",
    enabled: false,
    fullPage: false,
  },
  neonGrid: {
    id: "neonGrid",
    name: "Neon Grid",
    description: "Futuristic grid system with neon effects",
    enabled: false,
    fullPage: false,
  },
};

export const getEnabledVisualizations = (
  settings: VisualizationSettings
): string[] => {
  return Object.values(settings)
    .filter((config) => config.enabled)
    .map((config) => config.id);
};

export const getFullPageVisualization = (
  settings: VisualizationSettings
): string | null => {
  const fullPageViz = Object.values(settings).find(
    (config) => config.fullPage && config.enabled
  );
  return fullPageViz ? fullPageViz.id : null;
};

export const toggleVisualizationEnabled = (
  settings: VisualizationSettings,
  id: string
): VisualizationSettings => {
  return {
    ...settings,
    [id]: {
      ...settings[id],
      enabled: !settings[id].enabled,
      fullPage: settings[id].enabled ? false : settings[id].fullPage, // Disable fullPage if disabling
    },
  };
};

export const toggleVisualizationFullPage = (
  settings: VisualizationSettings,
  id: string
): VisualizationSettings => {
  const newSettings = { ...settings };

  // First, disable fullPage for all others
  Object.keys(newSettings).forEach((key) => {
    newSettings[key] = {
      ...newSettings[key],
      fullPage: false,
    };
  });

  // Then enable fullPage for the target if it's enabled
  if (newSettings[id]?.enabled) {
    newSettings[id] = {
      ...newSettings[id],
      fullPage: !settings[id].fullPage,
    };
  }

  return newSettings;
};

export const saveVisualizationSettings = (
  settings: VisualizationSettings
): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("audioVisualizerSettings", JSON.stringify(settings));
  }
};

export const updateVisualizationCustomSetting = (
  settings: VisualizationSettings,
  id: string,
  settingKey: string,
  value: unknown
): VisualizationSettings => {
  return {
    ...settings,
    [id]: {
      ...settings[id],
      customSettings: {
        ...settings[id].customSettings,
        [settingKey]: value,
      },
    },
  };
};

export const getVisualizationCustomSetting = (
  settings: VisualizationSettings,
  id: string,
  settingKey: string,
  defaultValue: unknown = null
): unknown => {
  return settings[id]?.customSettings?.[settingKey] ?? defaultValue;
};

export const loadVisualizationSettings = (): VisualizationSettings => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("audioVisualizerSettings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Merge with defaults to ensure all visualizations are present
        const merged = { ...defaultVisualizationSettings };

        // Merge each visualization's settings, preserving custom settings
        Object.keys(parsed).forEach((key) => {
          if (merged[key]) {
            merged[key] = {
              ...merged[key],
              ...parsed[key],
              customSettings: {
                ...merged[key].customSettings,
                ...parsed[key]?.customSettings,
              },
            };
          }
        });

        return merged;
      } catch (error) {
        console.warn("Failed to parse saved visualization settings:", error);
      }
    }
  }
  return defaultVisualizationSettings;
};
