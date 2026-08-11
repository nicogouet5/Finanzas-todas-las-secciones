import assert from "node:assert/strict";
import test from "node:test";
import { dotRadius, luminance } from "./ascii-renderer.ts";

test("luminancia usa pesos perceptuales", () => {
  assert.ok(luminance(255, 255, 255) > luminance(0, 0, 0));
  assert.ok(luminance(0, 255, 0) > luminance(0, 0, 255));
});

test("pulso mantiene radio dentro de la celda", () => {
  const radius = dotRadius(0.8, Math.PI / 2, {
    cellSize: 10,
    contrast: 115,
    tintOpacity: 0.32,
    animationIntensity: 0.6,
  });

  assert.ok(radius > 0 && radius <= 5);
});
