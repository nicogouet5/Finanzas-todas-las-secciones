# Presentación Certamen 1 Finanzas Corporativas — Implementation Plan

> **For agentic workers:** Implement task-by-task with tests first and preserve the approved academic scope.

**Goal:** Build a React + Tailwind interactive study presentation, compile it into one self-contained HTML file, and expose it as a built-in material in the Finance Hub.

**Architecture:** A small Vite React application lives under `presentations/certamen-1/`. Pure financial functions and declarative course content feed reusable presentation components. The build emits one tracked HTML file under `public/materiales/finanzas-corporativas/certamen-1/`, while the existing Hub lists and previews it alongside Blob materials.

**Tech Stack:** React 19, JavaScript/JSX, Tailwind CSS 4, Vite, vite-plugin-singlefile, Node test runner, Next.js 16.

## Global Constraints

- Source attachments define scope: risk profiles, two-period model, portfolios, Sharpe, Treynor, beta, CAPM, systematic/idiosyncratic risk, and VaR.
- Exactly three comment questions and two exercises per module.
- Every comment uses Verdadero/Falso/Incierto and always reveals a justification.
- Every exercise includes “Se pide” and a progressive solution.
- Correct the worksheet errors: Lenteja is undervalued under CAPM, and risk components add as variances rather than subtracting standard deviations.
- No external runtime resources, network calls, backend, authentication, localStorage, or JSS library.
- Use the Hub palette and accessible keyboard/touch behavior.

---

### Task 1: Financial model and academic content

Create `presentations/certamen-1/src/finance.js`, `finance.test.js`, `content.js`, and `content.test.js`. Implement pure validated calculations and the complete three-module declarative content. Tests must cover all approved numerical acceptance values and enforce three comments/two exercises per module.

### Task 2: Self-contained build pipeline and visual foundation

Create the Vite/Tailwind single-file build configuration, source HTML/CSS entrypoints, and package scripts/dependencies. The production command must emit exactly `public/materiales/finanzas-corporativas/certamen-1/presentacion-certamen-1-finanzas-corporativas.html` with no external script, stylesheet, font, or data dependency.

### Task 3: Hub integration

Update material discovery, public course presentation, and preview behavior so the local presentation is present with or without Blob configuration, appears once in a built-in `Certamen 1` module unless already assigned remotely, and local HTML previews directly inside the existing sandboxed iframe. Add regression tests for merge/deduplication and built-in module behavior.

### Task 4: React study experience

Create reusable React components for the index, presentation shell, comments, exercises, solution stepper, formulas, and interactive SVG simulations. Provide non-linear module selection, sequential navigation, keyboard controls, progress, reset, aria-live feedback, and responsive layouts.

### Task 5: Verification and polish

Run all unit tests and builds, inspect the emitted HTML for external dependencies, exercise interactions in the Hub and direct file, and visually review 390×844, 1024×720, and 1440×900. Fix clipping, overlap, focus, contrast, console, or calculation defects before handoff.
