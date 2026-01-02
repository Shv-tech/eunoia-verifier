export interface ETSComponents {
  grounding: number;
  consistency: number;
  assumptions: number;
  safety: number;
  security: number;
  calibration: number;
}

export function computeETS(
  components: ETSComponents,
  weights: Record<keyof ETSComponents, number>
): number {
  let total = 0;

  for (const key in components) {
    total += components[key as keyof ETSComponents] *
      weights[key as keyof ETSComponents];
  }

  return Math.round(total);
}
