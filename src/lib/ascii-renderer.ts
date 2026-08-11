export type AsciiConfig = {
  cellSize: number;
  contrast: number;
  tintOpacity: number;
  animationIntensity: number;
};

const defaultConfig: AsciiConfig = {
  cellSize: 10,
  contrast: 115,
  tintOpacity: 0.32,
  animationIntensity: 0.6,
};

const tint = [255, 59, 31] as const;

export function luminance(red: number, green: number, blue: number) {
  return (0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255;
}

export function dotRadius(luma: number, phase: number, config: AsciiConfig) {
  const contrasted = Math.min(1, Math.max(0, (luma - 0.5) * (config.contrast / 100) + 0.5));
  const pulse = 1 + Math.sin(phase) * config.animationIntensity;
  return Math.min(config.cellSize / 2, Math.max(0, contrasted * (config.cellSize / 2) * pulse));
}

export function drawAsciiFrame(
  context: CanvasRenderingContext2D,
  source: CanvasImageSource,
  width: number,
  height: number,
  time: number,
  config: AsciiConfig = defaultConfig,
) {
  if (width <= 0 || height <= 0) return;

  const sample = document.createElement("canvas");
  sample.width = Math.ceil(width / config.cellSize);
  sample.height = Math.ceil(height / config.cellSize);
  const sampleContext = sample.getContext("2d");
  if (!sampleContext) return;

  sampleContext.drawImage(source, 0, 0, sample.width, sample.height);
  const pixels = sampleContext.getImageData(0, 0, sample.width, sample.height).data;
  const bloom = document.createElement("canvas");
  bloom.width = width;
  bloom.height = height;
  const bloomContext = bloom.getContext("2d");
  if (!bloomContext) return;

  context.clearRect(0, 0, width, height);
  for (let y = 0; y < sample.height; y += 1) {
    for (let x = 0; x < sample.width; x += 1) {
      const offset = (y * sample.width + x) * 4;
      const red = pixels[offset];
      const green = pixels[offset + 1];
      const blue = pixels[offset + 2];
      const radius = dotRadius(luminance(red, green, blue), time / 1000 + x * 0.16 + y * 0.12, config);
      if (radius === 0) continue;

      const color = tint.map((channel, index) => pixels[offset + index] * (1 - config.tintOpacity) + channel * config.tintOpacity);
      bloomContext.fillStyle = `rgb(${color.join(",")})`;
      bloomContext.beginPath();
      bloomContext.arc(x * config.cellSize + config.cellSize / 2, y * config.cellSize + config.cellSize / 2, radius, 0, Math.PI * 2);
      bloomContext.fill();
    }
  }

  context.save();
  context.filter = "blur(10px)";
  context.globalAlpha = 0.35;
  context.drawImage(bloom, 0, 0);
  context.restore();
  context.drawImage(bloom, 0, 0);

  const vignette = context.createRadialGradient(width / 2, height / 2, Math.min(width, height) * 0.15, width / 2, height / 2, Math.max(width, height) * 0.7);
  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(1, "rgba(0,0,0,0.65)");
  context.fillStyle = vignette;
  context.fillRect(0, 0, width, height);
}
