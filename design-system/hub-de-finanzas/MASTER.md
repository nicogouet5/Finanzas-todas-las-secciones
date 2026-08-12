# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** Hub de Finanzas
**Generated:** 2026-08-11 12:19:33
**Category:** Academic Course Material Hub
**Design Dials:** Variance 8/10 (Bold / Terminal) | Motion 2/10 (Subtle) | Density 5/10 (Standard)

---

## Global Rules

### Color Palette

| Role | Hex / Value | CSS Variable |
|------|-----|--------------|
| Background | `#09070b` | `--bg` |
| Surface | `#151118` | `--surface` |
| Surface Hover | `#211720` | `--surface-hover` |
| Foreground / Text | `#fffafd` | `--text` |
| Muted | `#c9bcc5` | `--muted` |
| Line / Border | `#4b3440` | `--line` |
| Accent (lima) | `#c7ff3d` | `--accent` |
| Accent Strong (rosa) | `#ff5a84` | `--accent-strong` |
| Focus Ring | `#dcff70` | `--focus` |
| Line Soft | `rgba(255,255,255,.12)` | `--line-soft` |
| Line Soft Strong | `rgba(255,255,255,.14)` | `--line-soft-strong` |
| Line Soft 18 | `rgba(255,255,255,.18)` | `--line-soft-18` |

**Color Notes:** Terminal/ASCII aesthetic on a near-black base. Lima green (`#c7ff3d`) is the primary accent for interactive cues, numbers and kickers; hot pink (`#ff5a84`) is the secondary accent for eyebrows, labels and hover states. Body background carries a faint radial pink glow (`radial-gradient(circle at top right, #35131d, transparent 35rem)`) over `--bg`. No blues/greens from a "trust/profit" palette are used anywhere in the implementation — that scheme was never built.

### Typography

- **Heading / Display Font (h1, kickers, numbers):** Monospace stack — `"SFMono-Regular", "Roboto Mono", "Cascadia Mono", ui-monospace, monospace` (`--font-mono`, used only for `.page h1`) and `"SFMono-Regular", "Cascadia Mono", ui-monospace, monospace` (`--font-mono-ui`, used for eyebrows, section kickers, stat numbers, directory card numbers/labels/titles/CTAs)
- **Body Font:** Atkinson Hyperlegible (loaded via `next/font/google`, exposed as `--font-body`), falling back to Arial, sans-serif
- **Mood:** technical, terminal, ASCII, code-adjacent, high-contrast, academic-but-hacker
- **Note:** Crimson Pro is NOT used anywhere in this codebase. h1 and monospace UI elements use system/native monospace stacks, not a loaded serif display font.

### Spacing

Spacing is expressed with fluid `clamp()` values and rem literals rather than a fixed spacing scale — there is no `--space-*` token set in the codebase. Representative values actually used:

| Context | Value |
|---------|-------|
| `.page` vertical padding | `clamp(2rem, 7vw, 5rem)` |
| `.home` vertical padding | `clamp(3rem, 8vw, 7rem)` |
| `.hub-stats` margin | `clamp(2.5rem, 6vw, 5rem)` |
| Card padding (`.course-card`, `.folder-card`, `.material-card`) | `1.25rem` |
| Directory card padding (`.course-card--directory`) | `1.5rem` |
| Grid gaps (`.course-grid`, `.module-list`) | `1rem` |

### Shadows

The implementation does not use a box-shadow depth scale. The only shadow-adjacent effect is a `text-shadow` on `.page h1`: `0 .08em .35em rgba(0,0,0,.72)`, used to lift the display heading off the ASCII/gradient background.

---

## Component Specs

### Buttons

```css
.button, .actions a:first-child {
  background: var(--accent);
  color: #17120a;
  font-weight: 700;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  padding: .5rem .8rem;
  border-radius: .4rem;
  text-decoration: none;
  transition: background-color .2s ease, color .2s ease;
}

.button:hover, .actions a:first-child:hover {
  background: var(--accent-strong);
}
```

Nav links and secondary actions (`.site-header nav a`) share the same padding/transition but stay transparent until hover, at which point they pick up `--surface-hover`.

### Cards

```css
/* Course / folder / material card (public views) */
.course-card, .folder-card, .material-card {
  min-width: 0;
  border: 1px solid var(--line);
  border-radius: .75rem;
  padding: 1.25rem;
  background: color-mix(in srgb, var(--surface) 94%, transparent);
}

.course-card:hover, .folder-card:hover {
  transform: translateY(-2px);
  border-color: var(--accent);
  background: var(--surface-hover);
}
```

```css
/* Home directory card — squared corners, terminal accent rail */
.course-card--directory {
  border-radius: 0;
  border-color: var(--line-soft-18);
  background: rgba(21, 17, 24, .82);
}

.course-card--directory::before {
  content: "";
  position: absolute;
  inset: 0 auto 0 0;
  width: 3px;
  background: var(--accent-strong);
}

.course-card--directory:hover {
  border-color: var(--accent);
  background: rgba(31, 23, 32, .94);
  transform: translateY(-3px);
}
```

Note the deliberate contrast: generic cards use `border-radius: .75rem`; the home directory cards use `border-radius: 0` for a sharper, terminal-like block.

### Inputs

```css
.admin-form input, .admin-form select, .create-module-form input, .upload-input input, .login-form input {
  min-height: 44px;
  color: var(--text);
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: .4rem;
  padding: .5rem;
}

a:focus-visible, button:focus-visible, input:focus-visible {
  outline: 3px solid var(--focus);
  outline-offset: 3px;
}
```

### Modals

Not implemented — the codebase has no modal/dialog component. If one is added, keep the dark-surface language (`--surface` background, `--line` border, `.75rem` radius) consistent with existing cards rather than the light modal previously documented here.

---

## Style Guidelines

**Style:** Terminal / ASCII dark mode

**Keywords:** terminal, ASCII art, monospace, near-black, lima green accent, magenta/pink accent, sharp edges on hero elements, rounded edges on content cards, code-adjacent, high-contrast focus rings

**Best For:** Course/material hubs, developer-adjacent academic tools, dashboards that want a hacker/CLI feel rather than a soft SaaS look

**Key Effects:** Animated ASCII canvas background (`.ascii-background`) behind the hero, with a slow `ascii-mobile-drift` keyframe scale/translate on narrow viewports (`@media (max-width: 620px) and (prefers-reduced-motion: no-preference)`); `backdrop-filter: blur(14px)` on the sticky header; simple `translateY` lift + border-color swap on card hover; `transform: scale(.98)` on directory card `:active`.

### Page Pattern

**Pattern Name:** Hub / Directory Landing

- **CTA Placement:** Directory cards themselves are the CTA (whole-card links with an explicit "Explorar ↗" / "Ver ramo ↗" affordance)
- **Section Order:** Hero (`.home-hero`, eyebrow + h1 + lede) > Stats strip (`.hub-stats`) > Course directory grid (`.course-directory` > `.course-grid` of `.course-card--directory`)

---

## Motion

**Reduced motion:** globally respected — `@media (prefers-reduced-motion: reduce)` collapses all transition/animation durations to `.01ms` for `*, *::before, *::after`.

**ASCII background drift** (Subtle, mobile only) — Trigger: viewport ≤ 620px, no motion-reduction preference | Duration: 8s | Easing: `ease-in-out`, infinite loop

```css
@keyframes ascii-mobile-drift {
  0%, 100% { transform: translate3d(-1.5%, -.5%, 0) scale(1.06); }
  50% { transform: translate3d(1.5%, .75%, 0) scale(1.08); }
}
```

**Card hover lift** — Trigger: hover/focus | Duration: 200ms | Easing: `ease`

```css
transition: transform .2s ease, border-color .2s ease, background .2s ease;
```

- ✅ Directory CTA arrow nudges right on hover, gated behind `@media (hover: hover) and (pointer: fine)` so touch devices don't get a stuck hover state
- ✅ ASCII canvas opacity drops slightly on narrow viewports (`.76` vs `.9`) to reduce visual noise on small screens
- ❌ Don't add motion to the ASCII canvas outside the mobile drift breakpoint — desktop keeps it static

---

## Anti-Patterns (Do NOT Use)

- ❌ Pure white backgrounds
- ❌ Blue/green "fintech trust" palette — not part of this system
- ❌ Serif display fonts (Crimson Pro or similar) — headings and kickers are monospace, body is Atkinson Hyperlegible

### Additional Forbidden Patterns

- ❌ **Emojis as icons** — Use the existing `ContentIcon`/`.content-icon` SVG pattern
- ❌ **Missing cursor:pointer** — `a, button { cursor: pointer; }` is global; keep it that way for new clickable elements
- ❌ **Layout-shifting hovers** — card hovers use `transform`, never width/height changes
- ❌ **Low contrast text** — `--muted` (`#c9bcc5`) on `--bg`/`--surface` must stay readable; don't introduce darker mutes
- ❌ **Instant state changes** — use the existing `.2s ease` transition convention
- ❌ **Invisible focus states** — always keep the `--focus` (`#dcff70`) outline on `:focus-visible`
- ❌ **Rounded corners on home directory cards** — `.course-card--directory` is intentionally `border-radius: 0`; don't "fix" it to match the generic `.75rem` card radius

---

## Pre-Delivery Checklist

Before delivering any UI code, verify:

- [ ] No emojis used as icons (use SVG instead)
- [ ] Icons follow the existing `ContentIcon` component pattern
- [ ] `cursor: pointer` on all clickable elements
- [ ] Hover states use the `.2s ease` transition convention
- [ ] Text contrast against `--bg`/`--surface` stays ≥ 4.5:1
- [ ] Focus states use `--focus` and remain visible for keyboard navigation
- [ ] `prefers-reduced-motion` respected (global rule already collapses durations)
- [ ] Responsive at the project's actual breakpoints: 420px and 620px
- [ ] No content hidden behind the sticky `.site-header`
- [ ] No horizontal scroll on mobile
