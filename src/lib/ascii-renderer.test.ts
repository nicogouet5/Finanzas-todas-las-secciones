import assert from "node:assert/strict";
import test from "node:test";
import { canScheduleFrame, dotRadius, financialGlyph, luminance, settledFrameTime, shouldDrawFrame } from "./ascii-renderer.ts";

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

test("los glifos brillantes pertenecen al alfabeto financiero", () => {
  assert.match(financialGlyph(0.85, 12, 8, 1000) ?? "", /^[\$%01+−]$/);
  assert.equal(financialGlyph(0.2, 12, 8, 1000), null);
});

test("el campo ASCII limita el render continuo a 30 fps", () => {
  assert.equal(shouldDrawFrame(1000, 1020), false);
  assert.equal(shouldDrawFrame(1000, 1034), true);
});

test("el campo no agenda un segundo frame mientras uno sigue pendiente", () => {
  assert.equal(canScheduleFrame(false, false, false), true);
  assert.equal(canScheduleFrame(true, false, false), false);
  assert.equal(canScheduleFrame(false, true, false), false);
});

test("reduced motion dibuja el campo ya estabilizado", () => {
  assert.equal(settledFrameTime(0, false), 0);
  assert.equal(settledFrameTime(0, true), 900);
});
