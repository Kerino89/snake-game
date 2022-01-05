export const clamp = (min: number, value: number, max: number) => {
  return Math.min(max, Math.max(value, min));
};
