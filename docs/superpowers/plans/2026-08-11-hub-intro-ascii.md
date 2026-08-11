# Hub de Finanzas ASCII Intro Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Añadir logo UDD blanco, intro Canvas2D Sunset de 5.5 segundos, iconos SVG y movimiento accesible a la portada.

**Architecture:** Un renderer puro calcula luminancia y pinta puntos Sunset sobre Canvas2D. `AsciiIntro`, único componente cliente nuevo, controla montaje, omisión, reducción de movimiento y limpieza de `requestAnimationFrame`; la portada continúa siendo Server Component.

**Tech Stack:** Next.js App Router, React, TypeScript, Canvas2D, CSS, Node.js test runner.

## Global Constraints

- Usar el logo blanco UDD adjuntado por Nicolás con texto alternativo accesible.
- La intro dura 5.5 segundos, se puede omitir y no aparece con `prefers-reduced-motion: reduce`.
- No añadir dependencias.
- Render `dots`: `cellSize` 10, `coverage` 100, contraste 115, tint `#ff3b1f` al 32%, viñeta 55, bloom 45, animación pulse 60/100.
- Canvas decorativo con `aria-hidden`; botón de omisión de al menos 44 px y foco visible.
- Usar solo SVG inline para iconos de carpeta/documento; nunca emoji.
- No cargar ni ejecutar código externo de 21st.dev en runtime.
- No alterar autenticación, Blob, rutas de materiales ni archivos no rastreados `AGENTS.md`/`CLAUDE.md`.

---

### Task 1: Renderer Canvas y tests de matemática visual

**Files:**
- Create: `src/lib/ascii-renderer.ts`
- Create: `src/lib/ascii-renderer.test.ts`

**Interfaces:**
- Produces: `type AsciiConfig`, `luminance(red: number, green: number, blue: number): number`, `dotRadius(luma: number, phase: number, config: AsciiConfig): number`, `drawAsciiFrame(context: CanvasRenderingContext2D, source: CanvasImageSource, width: number, height: number, time: number, config?: AsciiConfig): void`.

- [ ] **Step 1: Write failing renderer tests**

```ts
import assert from "node:assert/strict";
import test from "node:test";
import { dotRadius, luminance } from "./ascii-renderer.ts";

test("luminancia usa pesos perceptuales", () => {
  assert.ok(luminance(255, 255, 255) > luminance(0, 0, 0));
  assert.ok(luminance(0, 255, 0) > luminance(0, 0, 255));
});

test("pulso mantiene radio dentro de la celda", () => {
  const radius = dotRadius(0.8, Math.PI / 2, { cellSize: 10, contrast: 115, tintOpacity: 0.32, animationIntensity: 0.6 });
  assert.ok(radius > 0 && radius <= 5);
});
```

- [ ] **Step 2: Verify failing test**

Run: `npm test`
Expected: FAIL because `ascii-renderer.ts` does not exist.

- [ ] **Step 3: Implement minimal Canvas2D renderer**

`drawAsciiFrame` must:

```ts
const sample = document.createElement("canvas");
sample.width = Math.ceil(width / config.cellSize);
sample.height = Math.ceil(height / config.cellSize);
sample.getContext("2d")!.drawImage(source, 0, 0, sample.width, sample.height);
```

Read image pixels once per frame, calculate perceptual luminance with `0.2126*r + 0.7152*g + 0.0722*b`, apply contrast `(luma - .5) * 1.15 + .5`, pulse factor `1 + sin(time / 1000 + x * .16 + y * .12) * .6`, and draw circles in source color blended with `#ff3b1f` at 0.32. Add radial vignette and a blurred copied point layer as bloom. Canvas dimensions are capped at `min(devicePixelRatio, 2)` by the component, not renderer.

- [ ] **Step 4: Run tests**

Run: `npm test`
Expected: all tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/ascii-renderer.ts src/lib/ascii-renderer.test.ts
git commit -m "feat: add Canvas ASCII renderer"
```

---

### Task 2: Intro, assets, logo e iconos

**Files:**
- Create: `src/components/ascii-intro.tsx`
- Create: `src/components/content-icon.tsx`
- Create: `public/udd-logo-white.png`
- Create: `public/ascii-sunset.webp`
- Modify: `src/components/site-header.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/app/globals.css`

**Interfaces:**
- Consumes: `drawAsciiFrame`.
- Produces: `AsciiIntro(): React.ReactElement`, `ContentIcon({ kind }: { kind: "course" | "folder" | "file" }): React.ReactElement`.

- [ ] **Step 1: Obtain exact local assets**

Use the user-provided white UDD logo image as source and crop/export it to `public/udd-logo-white.png`; preserve white glyphs, remove black background if transparency can be retained, and never substitute a generated logo. Download or reproduce only the user-named source image as `public/ascii-sunset.webp`, from `https://21st.dev/ascii-editor/demos/generated/ref-046.webp`. If direct image retrieval fails, use a locally generated abstract sunset image without third-party code, recorded in README.

- [ ] **Step 2: Implement `AsciiIntro` client component**

```tsx
"use client";

const INTRO_KEY = "hub-ascii-intro-seen";
const INTRO_DURATION = 5500;

export function AsciiIntro() {
  // Start only when matchMedia("(prefers-reduced-motion: reduce)").matches is false
  // and sessionStorage.getItem(INTRO_KEY) is absent.
  // requestAnimationFrame draws frames; setTimeout completes at INTRO_DURATION.
  // Skip sets the session key, cancels RAF, starts exit state and removes overlay.
}
```

Overlay receives `role="presentation"`; its visible button is `aria-label="Saltar introducción"`. Image preload error switches renderer source to a canvas gradient. Cancel timer and RAF on cleanup. Do not define a React component inside another component.

- [ ] **Step 3: Replace wordmark and add visual affordances**

`SiteHeader` uses `next/image` with the local logo, explicit `width`, `height`, `priority`, `alt="Universidad del Desarrollo"`, while its link retains `aria-label="Hub de Finanzas, inicio"`. `ContentIcon` contains three small viewBox SVGs with `aria-hidden="true"`. Home imports `AsciiIntro` and course icons; material/folder cards receive icon through existing components only where relevant.

- [ ] **Step 4: Add mobile-first motion CSS**

Create `.ascii-intro`, `.ascii-intro canvas`, `.ascii-intro__skip`, `.ascii-intro--exit`, `.brand-logo`, `.content-icon`, `.course-card__title`. Intro must use `position: fixed; inset: 0; z-index: 50`, prevent no page scrolling after unmount, and transition only opacity/transform for 220 ms. Apply `@media (prefers-reduced-motion: reduce)` to suppress CSS motion. Icons have 24 px dimensions and never convey meaning alone.

- [ ] **Step 5: Run design and framework checks**

Run:

```bash
python3 /Users/nicolas/.codex/skills/ui-ux-pro-max/scripts/search.py "education finance dark futuristic canvas animation accessible" --design-system -p "Hub de Finanzas" --output-dir "/Users/nicolas/Desktop/Ayudante Finanzas"
npm test
npm run build
```

Expected: all tests PASS and build exits 0.

- [ ] **Step 6: Commit**

```bash
git add src/components src/app public/udd-logo-white.png public/ascii-sunset.webp design-system
git commit -m "feat: add UDD intro and course icons"
```

---

### Task 3: Browser QA, release and production verification

**Files:**
- Modify: `README.md` only if asset-source or maintenance instructions changed.

**Interfaces:**
- Consumes: deployed production URL and final source code.
- Produces: verified production deployment on `https://ayudante-finanzas.vercel.app`.

- [ ] **Step 1: Verify behavior in browser**

At 390 × 844 and 1440 × 900 verify: overlay appears once; `Saltar introducción` is keyboard focusable; pressing it exposes content; waiting 5.5 seconds removes overlay; refresh in same tab does not replay; a reduced-motion emulation opens content directly. Verify logo, folder/document icons, no horizontal overflow and both course links work.

- [ ] **Step 2: Run final local checks**

Run: `npm test && npm run build && git diff --check`
Expected: all tests PASS, build exits 0, no whitespace errors.

- [ ] **Step 3: Commit, push and deploy**

```bash
git add README.md
git commit -m "docs: document Hub visual assets"
git push
vercel --prod --yes
```

- [ ] **Step 4: Verify operating layer**

Run `vercel inspect https://ayudante-finanzas.vercel.app`; expected `Ready`. Check `GET /` returns 200, inspect real intro once, then report deployment URL and any asset fallback used.
