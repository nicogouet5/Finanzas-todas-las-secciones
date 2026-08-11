import assert from "node:assert/strict";
import test from "node:test";
import { introCanvasSize } from "./ascii-intro-config.ts";

test("el canvas ASCII mantiene una salida de baja resolución", () => {
  assert.deepEqual(introCanvasSize(390, 844, 2), { width: 273, height: 591 });
  assert.deepEqual(introCanvasSize(1440, 900, 2), { width: 640, height: 400 });
});
