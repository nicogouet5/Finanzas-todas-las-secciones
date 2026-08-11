import { createHash, createHmac, timingSafeEqual } from "node:crypto";

const SESSION_MAX_AGE = 604800;
function setting(name: "ADMIN_USER" | "ADMIN_PASSWORD" | "SESSION_SECRET"): string { const value = process.env[name]; if (!value || (name === "SESSION_SECRET" && value.length < 32)) throw new Error(`Configuración requerida: ${name}`); return value; }
const digest = (value: string) => createHash("sha256").update(value).digest();

export function verifyCredentials(user: string, password: string): boolean { return timingSafeEqual(digest(setting("ADMIN_USER")), digest(user)) && timingSafeEqual(digest(setting("ADMIN_PASSWORD")), digest(password)); }
export function createSessionToken(nowSeconds = Math.floor(Date.now() / 1000)): string { const issuedAt = String(nowSeconds); return `${issuedAt}.${createHmac("sha256", setting("SESSION_SECRET")).update(issuedAt).digest("base64url")}`; }
export function verifySessionToken(token: string, nowSeconds = Math.floor(Date.now() / 1000)): boolean { const [issuedAt, signature, ...rest] = token.split("."); if (!issuedAt || !signature || rest.length || !/^\d+$/.test(issuedAt)) return false; const issued = Number(issuedAt); if (!Number.isSafeInteger(issued) || issued > nowSeconds || nowSeconds - issued > SESSION_MAX_AGE) return false; const expected = createHmac("sha256", setting("SESSION_SECRET")).update(issuedAt).digest("base64url"); return timingSafeEqual(digest(expected), digest(signature)); }
export async function isAdmin(): Promise<boolean> { const { cookies } = await import("next/headers"); const token = (await cookies()).get("hub_admin")?.value; try { return !!token && verifySessionToken(token); } catch { return false; } }
export const sessionCookie = { httpOnly: true, sameSite: "lax" as const, secure: process.env.NODE_ENV === "production", path: "/", maxAge: SESSION_MAX_AGE };
