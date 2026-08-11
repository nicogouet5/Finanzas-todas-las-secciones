export const INTRO_DURATION = 5500;

const MAX_OUTPUT_WIDTH = 640;
const OUTPUT_SCALE = 0.35;

export function introCanvasSize(width: number, height: number, devicePixelRatio: number) {
  const scale = Math.min(Math.min(devicePixelRatio || 1, 2) * OUTPUT_SCALE, MAX_OUTPUT_WIDTH / width);
  return { width: Math.ceil(width * scale), height: Math.ceil(height * scale) };
}
