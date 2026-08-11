import assert from "node:assert/strict";
import test from "node:test";
import { createSessionToken, verifySessionToken } from "./admin-session.ts";

test("firma, valida y vence sesión", () => {
  process.env.SESSION_SECRET = "test-secret-with-32-characters-minimum";
  const token = createSessionToken(1_000);
  assert.equal(verifySessionToken(token, 1_001), true);
  assert.equal(verifySessionToken(`${token}x`, 1_001), false);
  assert.equal(verifySessionToken(token, 700_000), false);
});
