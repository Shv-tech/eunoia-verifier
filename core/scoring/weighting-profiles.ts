export const ETS_WEIGHTS = {
  founder: {
    grounding: 0.25,
    consistency: 0.25,
    assumptions: 0.1,
    safety: 0.15,
    security: 0.1,
    calibration: 0.15,
  },
  legal: {
    grounding: 0.3,
    consistency: 0.3,
    assumptions: 0.15,
    safety: 0.15,
    security: 0.05,
    calibration: 0.05,
  },
} as const;

/* 👇 THIS IS THE KEY LINE */
export type WeightProfile = keyof typeof ETS_WEIGHTS;
