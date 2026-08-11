import assert from "node:assert/strict";
import test from "node:test";
import { INTRO_DURATION, introCanvasSize } from "./ascii-intro-config.ts";

test("la intro dura 5.5 segundos", () => {
  assert.equal(INTRO_DURATION, 5500);
});

test("el canvas de intro mantiene una salida de baja resolución", () => {
  assert.deepEqual(introCanvasSize(390, 844, 2), { width: 273, height: 591 });
  assert.deepEqual(introCanvasSize(1440, 900, 2), { width: 640, height: 400 });
});
