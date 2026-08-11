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

const tint = [255, 76, 123] as const;
const signal = [199, 255, 61] as const;
const financialGlyphs = "$%01+−";
type RendererBuffers = { sample: HTMLCanvasElement; bloom: HTMLCanvasElement };
const buffers = new WeakMap<CanvasRenderingContext2D, RendererBuffers>();

function rendererBuffers(context: CanvasRenderingContext2D, width: number, height: number, sampleWidth: number, sampleHeight: number) {
  let current = buffers.get(context);
  if (!current) {
    current = { sample: document.createElement("canvas"), bloom: document.createElement("canvas") };
    buffers.set(context, current);
  }
  if (current.sample.width !== sampleWidth || current.sample.height !== sampleHeight) {
    current.sample.width = sampleWidth;
    current.sample.height = sampleHeight;
  }
  if (current.bloom.width !== width || current.bloom.height !== height) {
    current.bloom.width = width;
    current.bloom.height = height;
  }
  return current;
}

export function luminance(red: number, green: number, blue: number) {
  return (0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255;
}

export function dotRadius(luma: number, phase: number, config: AsciiConfig) {
  const contrasted = Math.min(1, Math.max(0, (luma - 0.5) * (config.contrast / 100) + 0.5));
  const pulse = 1 + Math.sin(phase) * config.animationIntensity;
  return Math.min(config.cellSize / 2, Math.max(0, contrasted * (config.cellSize / 2) * pulse));
}

export function financialGlyph(luma: number, x: number, y: number, time: number) {
  if (luma < 0.4) return null;
  return financialGlyphs[Math.abs(Math.floor(x * 17 + y * 13 + time / 120)) % financialGlyphs.length];
}

export function shouldDrawFrame(lastFrame: number, time: number) {
  return time - lastFrame >= 1000 / 30;
}

export function canScheduleFrame(framePending: boolean, reducedMotion: boolean, paused: boolean) {
  return !framePending && !reducedMotion && !paused;
}

export function settledFrameTime(time: number, reducedMotion: boolean) {
  return reducedMotion ? 900 : time;
}

export function coverDrawRect(sourceWidth: number, sourceHeight: number, width: number, height: number) {
  if (sourceWidth <= 0 || sourceHeight <= 0 || width <= 0 || height <= 0) {
    return { x: 0, y: 0, width, height };
  }
  const scale = Math.max(width / sourceWidth, height / sourceHeight);
  const drawWidth = sourceWidth * scale;
  const drawHeight = sourceHeight * scale;
  return { x: (width - drawWidth) / 2, y: (height - drawHeight) / 2, width: drawWidth, height: drawHeight };
}

function scanStrength(x: number, y: number, time: number) {
  const band = (x * 0.85 + y * 0.45 + time * 0.026) % 58;
  return Math.max(0, 1 - Math.abs(band - 29) / 10);
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

  const sampleWidth = Math.ceil(width / config.cellSize);
  const sampleHeight = Math.ceil(height / config.cellSize);
  const { sample, bloom } = rendererBuffers(context, width, height, sampleWidth, sampleHeight);
  const sampleContext = sample.getContext("2d");
  if (!sampleContext) return;

  const sourceDimensions = source as CanvasImageSource & { naturalWidth?: number; naturalHeight?: number; videoWidth?: number; videoHeight?: number; width?: number; height?: number };
  const sourceWidth = sourceDimensions.naturalWidth || sourceDimensions.videoWidth || sourceDimensions.width || sample.width;
  const sourceHeight = sourceDimensions.naturalHeight || sourceDimensions.videoHeight || sourceDimensions.height || sample.height;
  const sourceRect = coverDrawRect(sourceWidth, sourceHeight, sample.width, sample.height);
  sampleContext.clearRect(0, 0, sample.width, sample.height);
  sampleContext.drawImage(source, sourceRect.x, sourceRect.y, sourceRect.width, sourceRect.height);
  const pixels = sampleContext.getImageData(0, 0, sample.width, sample.height).data;
  const bloomContext = bloom.getContext("2d");
  if (!bloomContext) return;

  context.clearRect(0, 0, width, height);
  bloomContext.clearRect(0, 0, width, height);
  bloomContext.font = `${Math.floor(config.cellSize * 1.18)}px ui-monospace, SFMono-Regular, Menlo, monospace`;
  bloomContext.textAlign = "center";
  bloomContext.textBaseline = "middle";
  const boot = Math.min(1, time / 900);
  for (let y = 0; y < sample.height; y += 1) {
    for (let x = 0; x < sample.width; x += 1) {
      const offset = (y * sample.width + x) * 4;
      const red = pixels[offset];
      const green = pixels[offset + 1];
      const blue = pixels[offset + 2];
      const luma = luminance(red, green, blue);
      const radius = dotRadius(luma, time / 1000 + x * 0.16 + y * 0.12, config) * boot;
      if (radius === 0) continue;
      const scan = scanStrength(x, y, time);
      const accent = tint.map((channel, index) => channel * (1 - scan) + signal[index] * scan);
      const color = accent.map((channel, index) => pixels[offset + index] * (1 - config.tintOpacity) + channel * config.tintOpacity);
      bloomContext.fillStyle = `rgb(${color.join(",")})`;
      const glyph = financialGlyph(luma, x, y, time);
      if (glyph) bloomContext.fillText(glyph, x * config.cellSize + config.cellSize / 2, y * config.cellSize + config.cellSize / 2);
      else {
        bloomContext.beginPath();
        bloomContext.arc(x * config.cellSize + config.cellSize / 2, y * config.cellSize + config.cellSize / 2, radius, 0, Math.PI * 2);
        bloomContext.fill();
      }
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
