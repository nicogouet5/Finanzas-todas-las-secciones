# Hub de Finanzas Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir y desplegar un hub público de materiales financieros con navegación jerárquica, visores, descargas y panel administrativo protegido.

**Architecture:** Next.js App Router renderiza el catálogo empaquetado cuando Blob no está configurado y usa exclusivamente objetos públicos de Vercel Blob cuando sí lo está. Un panel cliente usa rutas de servidor protegidas por cookie HMAC para crear carpetas y administrar archivos; las cargas viajan directo del navegador a Blob.

**Tech Stack:** Next.js, React, TypeScript, CSS Modules/global CSS, Node.js `crypto`, `@vercel/blob`, Vercel.

## Global Constraints

- Acceso estudiantil sin autenticación.
- Dos ramos: `Finanzas` y `Finanzas Corporativas`.
- Material actual dentro de `Finanzas`.
- Dark futuristik UDD con negro, gris, burdeos y texto blanco.
- Logo UDD blanco oficial cuando exista recurso verificable.
- Sin límite artificial de archivo; carga cliente directa sujeta al límite técnico del proveedor.
- HTML en `iframe` aislado; Word y PowerPoint mediante Office Viewer con descarga alternativa.
- Contraste mínimo 4.5:1, foco visible, teclado, controles táctiles 44 × 44 px y `prefers-reduced-motion`.
- Sin DB, cuentas estudiantiles, notas, comentarios ni editor documental.
- No guardar usuario, contraseña, token Blob ni secreto de sesión en Git.

---

### Task 1: Base Next.js y modelo de rutas

**Files:**
- Create: `package.json`
- Create: `next.config.ts`
- Create: `tsconfig.json`
- Create: `next-env.d.ts`
- Create: `.gitignore`
- Create: `.env.example`
- Create: `src/lib/material-paths.ts`
- Test: `src/lib/material-paths.test.ts`
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`
- Move: `index.html` to `public/materiales/finanzas/administracion-de-caja/index.html`
- Move: `presentacion_administracion_caja.html` to `public/materiales/finanzas/administracion-de-caja/presentacion_administracion_caja.html`
- Move: `presentacion_certamen_2_finanzas.html` to `public/materiales/finanzas/certamen-2/presentacion_certamen_2_finanzas.html`

**Interfaces:**
- Produces: `normalizeSegment(value: string): string`, `normalizeMaterialPath(value: string): string`, `courseLabel(slug: CourseSlug): string`, `CourseSlug = "finanzas" | "finanzas-corporativas"`.

- [ ] **Step 1: Write failing path tests**

```ts
import assert from "node:assert/strict";
import test from "node:test";
import { normalizeMaterialPath, normalizeSegment } from "./material-paths.ts";

test("normaliza nombres académicos", () => {
  assert.equal(normalizeSegment(" Administración de Caja "), "administracion-de-caja");
});

test("rechaza traversal y rutas absolutas", () => {
  assert.throws(() => normalizeMaterialPath("../secreto"));
  assert.throws(() => normalizeMaterialPath("/etc/passwd"));
});
```

- [ ] **Step 2: Run test and verify failure**

Run: `node --experimental-strip-types --test src/lib/material-paths.test.ts`
Expected: FAIL porque `material-paths.ts` no existe.

- [ ] **Step 3: Scaffold minimal project and implement path functions**

`package.json` scripts:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "node --experimental-strip-types --test src/lib/*.test.ts"
  }
}
```

`normalizeSegment` aplica `trim()`, Unicode NFD, elimina diacríticos, convierte a minúsculas, reemplaza espacios por `-` y rechaza resultado vacío, `/`, `\\`, `.` y `..`. `normalizeMaterialPath` rechaza rutas que empiezan por `/` o `\\`, divide únicamente por `/`, exige al menos un segmento y normaliza cada uno. `.env.example` contiene solo `ADMIN_USER=`, `ADMIN_PASSWORD=`, `SESSION_SECRET=` y `BLOB_READ_WRITE_TOKEN=`. El layout devuelve `<html lang="es"><body>{children}</body></html>` y la página inicial devuelve un `<main><h1>Hub de Finanzas</h1></main>` mínimo para que el scaffold compile; Task 2 los reemplaza.

- [ ] **Step 4: Move existing presentations without changing bytes**

Run:

```bash
mkdir -p public/materiales/finanzas/administracion-de-caja public/materiales/finanzas/certamen-2
git mv index.html public/materiales/finanzas/administracion-de-caja/index.html
git mv presentacion_administracion_caja.html public/materiales/finanzas/administracion-de-caja/presentacion_administracion_caja.html
git mv presentacion_certamen_2_finanzas.html public/materiales/finanzas/certamen-2/presentacion_certamen_2_finanzas.html
```

- [ ] **Step 5: Install only required dependencies and run checks**

Run: `npm install next react react-dom @vercel/blob && npm install -D typescript @types/node @types/react @types/react-dom`
Run: `npm test && npm run build`
Expected: tests PASS; build PASS con el layout y página mínimos definidos en Step 3.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json next.config.ts tsconfig.json next-env.d.ts .gitignore .env.example src public
git commit -m "chore: scaffold Hub de Finanzas"
```

---

### Task 2: Catálogo, navegación y visores públicos

**Files:**
- Create: `src/lib/materials.ts`
- Create: `src/lib/materials.test.ts`
- Create: `src/components/site-header.tsx`
- Create: `src/components/breadcrumbs.tsx`
- Create: `src/components/material-card.tsx`
- Modify: `src/app/layout.tsx`
- Modify: `src/app/page.tsx`
- Create: `src/app/ramos/[course]/[[...folder]]/page.tsx`
- Create: `src/app/material/[...path]/page.tsx`
- Create: `src/app/not-found.tsx`
- Create: `src/app/globals.css`
- Create only if an official asset is verified: `public/udd-logo-blanco.png`

**Interfaces:**
- Consumes: `normalizeMaterialPath`, `CourseSlug`.
- Produces: `type MaterialSource = "local" | "blob"`, `MaterialItem { path: string; name: string; url: string; downloadUrl: string; size: number; contentType: string; source: MaterialSource }`, `FolderNode { name: string; path: string; folders: FolderNode[]; files: MaterialItem[] }`, `listMaterials(): Promise<MaterialItem[]>`, `buildMaterialTree(items: MaterialItem[]): FolderNode`, `findMaterial(path: string): Promise<MaterialItem | null>`.

- [ ] **Step 1: Write failing tree test**

```ts
test("separa ramos, carpetas y archivos", () => {
  const tree = buildMaterialTree([
    { path: "finanzas/caja/clase.html", name: "clase.html", url: "/clase.html", downloadUrl: "/clase.html", size: 1, contentType: "text/html", source: "local" }
  ]);
  assert.equal(tree.folders[0].folders[0].files[0].name, "clase.html");
});
```

- [ ] **Step 2: Run test and verify failure**

Run: `npm test`
Expected: FAIL porque `buildMaterialTree` no existe.

- [ ] **Step 3: Implement local catalog plus optional Blob listing**

Define the three local files explicitly, preserving their exact filenames and public URLs. If `BLOB_READ_WRITE_TOKEN` is absent, return that packaged catalog. If it exists, call `list({ prefix: "materiales/" })`, paginate with `cursor` until `hasMore === false`, strip the leading `materiales/`, ignore `.folder` markers and return only Blob items. This prevents deleted or renamed seed files from reappearing from the packaged fallback. Build and alphabetically sort the tree in one pass. A Blob listing error is surfaced as a useful server error; only an absent token activates fallback.

- [ ] **Step 4: Build public pages as Server Components**

Home shows two course cards. Course route awaits async `params`, validates course and renders folders/files with deep links. Material route resolves one catalog item or calls `notFound()`.

Viewer selection:

```ts
if (contentType === "text/html") return <iframe title={name} sandbox="allow-scripts allow-forms allow-modals allow-downloads" src={url} />;
if (contentType === "application/pdf") return <iframe src={url} />;
if (contentType.startsWith("image/")) return <img src={url} alt={name} />;
if (contentType.startsWith("video/")) return <video controls src={url} />;
if (contentType.startsWith("audio/")) return <audio controls src={url} />;
if (OFFICE_CONTENT_TYPES.has(contentType)) return <iframe title={name} src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`} />;
return <p>Este formato no tiene vista previa.</p>;
```

`OFFICE_CONTENT_TYPES` contiene únicamente MIME de Word y PowerPoint admitidos en la lista de carga. Every viewer includes an `<a href={downloadUrl} download>` direct download link, including the Office fallback and unsupported formats. Use `next/font` for typography. No client component unless interaction requires it.

- [ ] **Step 5: Generate and persist UI/UX design system, then implement CSS**

Run:

```bash
python3 /Users/nicolas/.codex/skills/ui-ux-pro-max/scripts/search.py "education resource hub finance dark futuristic academic" --design-system --persist -p "Hub de Finanzas" --output-dir "/Users/nicolas/Desktop/Ayudante Finanzas" --variance 7 --motion 3 --density 5
python3 /Users/nicolas/.codex/skills/ui-ux-pro-max/scripts/search.py "accessibility dark navigation responsive" --domain ux
python3 /Users/nicolas/.codex/skills/ui-ux-pro-max/scripts/search.py "server components bundle responsive" --stack nextjs
```

Apply approved burdeos/negro/gris direction over generated recommendations. Search official UDD domain for white PNG logo; if verified, add it and record its source URL in `docs/assets.md`. Otherwise do not create either file and use an accessible typographic `UDD` wordmark per approved spec.

- [ ] **Step 6: Run checks and inspect public flow**

Run: `npm test && npm run build`
Expected: PASS. Open `/`, `/ramos/finanzas`, nested folders and each local material; verify viewer and download.

- [ ] **Step 7: Commit**

```bash
git add src design-system public docs/assets.md
git commit -m "feat: add public finance material hub"
```

If `docs/assets.md` or `public/udd-logo-blanco.png` was not created, omit that path from `git add`.

---

### Task 3: Sesión administrativa segura

**Files:**
- Create: `src/lib/admin-session.ts`
- Test: `src/lib/admin-session.test.ts`
- Create: `src/app/api/session/route.ts`
- Create: `src/app/api/session/logout/route.ts`
- Create: `src/app/admin/login-form.tsx`
- Create: `src/app/admin/page.tsx`

**Interfaces:**
- Produces: `verifyCredentials(user: string, password: string): boolean`, `createSessionToken(nowSeconds?: number): string`, `verifySessionToken(token: string, nowSeconds?: number): boolean`, `isAdmin(): Promise<boolean>`.

- [ ] **Step 1: Write failing session tests**

```ts
test("firma, valida y vence sesión", () => {
  process.env.SESSION_SECRET = "test-secret-with-32-characters-minimum";
  const token = createSessionToken(1_000);
  assert.equal(verifySessionToken(token, 1_001), true);
  assert.equal(verifySessionToken(`${token}x`, 1_001), false);
  assert.equal(verifySessionToken(token, 700_000), false);
});
```

- [ ] **Step 2: Run test and verify failure**

Run: `npm test`
Expected: FAIL porque funciones de sesión no existen.

- [ ] **Step 3: Implement HMAC session and constant-time credential comparison**

Require non-empty `ADMIN_USER`, `ADMIN_PASSWORD` and a `SESSION_SECRET` of at least 32 characters; otherwise fail closed with a configuration error that names only the missing variable. Use Node `createHmac("sha256", SESSION_SECRET)` and `timingSafeEqual` on equal-length SHA-256 digests. Token is `<issuedAtSeconds>.<base64url-hmac>`, rejects malformed or future timestamps, and expires after exactly 604800 seconds. `isAdmin()` awaits `cookies()` and validates cookie `hub_admin`.

- [ ] **Step 4: Implement login/logout routes and admin shell**

`POST /api/session` catches malformed JSON as 400, validates string credentials, returns the same generic 401 on mismatch, and sets `hub_admin` with `httpOnly`, `sameSite: "lax"`, `secure: process.env.NODE_ENV === "production"`, `path: "/"` and `maxAge: 604800`. `POST /api/session/logout` clears the same cookie attributes. `/admin` renders the login form when unauthenticated and the dashboard shell when authenticated, without exposing configured username.

- [ ] **Step 5: Run tests and manual auth check**

Run: `npm test && npm run build`
Expected: PASS. Wrong credentials show generic error; correct credentials create `httpOnly` cookie; logout clears it.

- [ ] **Step 6: Commit**

```bash
git add src/lib/admin-session.ts src/lib/admin-session.test.ts src/app/api/session src/app/admin
git commit -m "feat: protect finance hub administration"
```

---

### Task 4: Administración de carpetas y archivos Blob

**Files:**
- Create: `src/lib/admin-materials.ts`
- Test: `src/lib/admin-materials.test.ts`
- Create: `src/app/api/blob/upload/route.ts`
- Create: `src/app/api/materials/route.ts`
- Create: `src/app/admin/admin-dashboard.tsx`
- Modify: `src/app/admin/page.tsx`
- Modify: `src/app/globals.css`

**Interfaces:**
- Consumes: `isAdmin`, `normalizeMaterialPath`, `listMaterials`.
- Produces: `materialKey(course: CourseSlug, folder: string, file: string): string`, authenticated `POST/DELETE/PATCH /api/materials`, authenticated client-upload token handler at `/api/blob/upload`.

- [ ] **Step 1: Write failing key and mutation validation tests**

```ts
test("construye clave Blob acotada a materiales", () => {
  assert.equal(materialKey("finanzas", "caja", "clase.pdf"), "materiales/finanzas/caja/clase.pdf");
  assert.throws(() => materialKey("finanzas", "../privado", "x.pdf"));
});
```

- [ ] **Step 2: Run test and verify failure**

Run: `npm test`
Expected: FAIL porque `materialKey` no existe.

- [ ] **Step 3: Implement authenticated direct upload**

Use `handleUpload` and `HandleUploadBody` from `@vercel/blob/client`. Parse the request body only after `isAdmin()` succeeds. In `onBeforeGenerateToken`, parse `pathname` as `materiales/<CourseSlug>/<normalized-folder>/<normalized-filename>`, reject `.folder`, validate the extension and MIME against one shared `ALLOWED_UPLOADS` map for HTML, PDF, Word, PowerPoint, OpenDocument, images, audio, video and ZIP, and return `allowedContentTypes`, `addRandomSuffix: false` and `allowOverwrite: false`. Omit `maximumSizeInBytes` so the app adds no size cap. The client calls `upload(pathname, file, { access: "public", handleUploadUrl: "/api/blob/upload", multipart: file.size > 100_000_000, onUploadProgress })`; an existing pathname is reported as 409 rather than silently overwritten.

Use this exact allowlist; reject a file unless its lowercase extension maps to its declared MIME (permit `application/octet-stream` only for these listed extensions because some browsers omit a useful Office/ZIP MIME):

```ts
export const ALLOWED_UPLOADS: Record<string, readonly string[]> = {
  ".html": ["text/html"],
  ".pdf": ["application/pdf"],
  ".doc": ["application/msword"],
  ".docx": ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
  ".ppt": ["application/vnd.ms-powerpoint"],
  ".pptx": ["application/vnd.openxmlformats-officedocument.presentationml.presentation"],
  ".odt": ["application/vnd.oasis.opendocument.text"],
  ".odp": ["application/vnd.oasis.opendocument.presentation"],
  ".jpg": ["image/jpeg"], ".jpeg": ["image/jpeg"], ".png": ["image/png"],
  ".gif": ["image/gif"], ".webp": ["image/webp"], ".svg": ["image/svg+xml"],
  ".mp3": ["audio/mpeg"], ".wav": ["audio/wav"], ".m4a": ["audio/mp4"],
  ".mp4": ["video/mp4"], ".webm": ["video/webm"], ".mov": ["video/quicktime"],
  ".zip": ["application/zip", "application/x-zip-compressed"],
};
```

- [ ] **Step 4: Implement folder and file mutations**

- `POST /api/materials` accepts `{ course: CourseSlug, folder: string }`, validates the course and normalized folder, then calls `put(pathname, "", { access: "public", addRandomSuffix: false, allowOverwrite: false })`, where `pathname` is exactly `materiales/<course>/<folder>/.folder`.
- `DELETE /api/materials` accepts `{ path: string, kind: "file" | "folder" }`; for a file, match one exact pathname, and for a folder list the normalized prefix with pagination. Return 404 for no matches, then call `del(urls)`.
- `PATCH /api/materials` accepts `{ source: string, destination: string, kind: "file" | "folder" }`, resolves exact source blobs with the same file/prefix rule, rejects destination collisions, and calls the documented `copy(sourceUrl, destinationPath, { access: "public", addRandomSuffix: false, allowOverwrite: false, ifMatch: sourceEtag })`. For a folder, preserve each relative suffix. Copy every source first; on a copy failure delete only destinations created by this request and keep all sources. Delete sources only after all copies succeed.
- Every branch checks `isAdmin()` before parsing mutation input, refuses paths outside `materiales/<CourseSlug>/`, and maps validation/configuration/not-found/collision/provider failures to 400/503/404/409/502 JSON errors without secrets. Mutations operate on Blob-backed items; packaged files are fallback content only and are seeded into Blob in Task 5 before production verification.

- [ ] **Step 5: Implement dashboard interactions**

Client dashboard receives the server-side catalog as props, lists courses and folders, creates folders, uploads multiple files sequentially using the Step 3 contract, displays `<progress>` and a success/error result per file, and exposes renombrar/mover/borrar controls. Disable actions while their request runs. After success call `router.refresh()`; destructive action requires `window.confirm()` naming the target. If `BLOB_READ_WRITE_TOKEN` is absent, render a configuration message and no mutation controls.

- [ ] **Step 6: Run checks and Blob integration flow**

Run: `npm test && npm run build`
With linked Blob token: login, create folder, upload HTML/PDF/Word, open/download, rename, move and delete. Expected: every operation appears publicly after refresh.

- [ ] **Step 7: Commit**

```bash
git add src/lib/admin-materials.ts src/lib/admin-materials.test.ts src/app/api/blob src/app/api/materials src/app/admin src/app/globals.css
git commit -m "feat: add Blob material administration"
```

---

### Task 5: QA, GitHub y despliegue Vercel

**Files:**
- Create: `README.md`
- Create: `scripts/seed-blob.mjs`
- Modify: files found by QA only when a confirmed issue exists.

**Interfaces:**
- Consumes: complete app and environment variables.
- Produces: public `READY` Vercel deployment and pushed `codex/Hub` branch.

- [ ] **Step 1: Document maintenance and secrets**

README must include local commands, four environment variables, `/admin`, upload flow, viewer behavior, Blob provider limits, seed command, deployment command and domain `.dev` note. Never include live password or token. `scripts/seed-blob.mjs` imports `put` from `@vercel/blob`, reads exactly the three packaged HTML paths with `node:fs/promises`, and uploads them to their matching `materiales/finanzas/...` keys using `{ access: "public", addRandomSuffix: false, allowOverwrite: false }`; treat an existing destination as a visible skip, not an overwrite.

- [ ] **Step 2: Run automated verification**

Run: `npm test && npm run build`
Expected: all tests PASS and production build exits 0.

- [ ] **Step 3: Run responsive and accessibility QA**

Start app and inspect 390 × 844 and 1440 × 900. Verify no horizontal overflow, 44 px controls, keyboard focus, contrast, reduced motion, empty Finanzas Corporativas, breadcrumbs, all three local viewers and downloads.

- [ ] **Step 4: Provision and configure Vercel safely**

Link project with Vercel CLI, create one **public** Vercel Blob store, set `ADMIN_USER`, `ADMIN_PASSWORD`, generated 32-byte `SESSION_SECRET`, and injected `BLOB_READ_WRITE_TOKEN` for Production/Preview. Pull the linked environment locally without printing values, run `node scripts/seed-blob.mjs`, then confirm Blob lists the two files under `materiales/finanzas/administracion-de-caja/`, one under `materiales/finanzas/certamen-2/`, and none under `materiales/finanzas-corporativas/`. Do not print or commit secret values.

- [ ] **Step 5: Commit QA/docs, push branch and deploy**

```bash
git add README.md scripts/seed-blob.mjs
git commit -m "docs: add Hub de Finanzas maintenance guide"
git push -u origin codex/Hub
vercel --prod --yes
```

- [ ] **Step 6: Verify operating layer**

Confirm deployment state `READY`, open public URL, repeat student navigation and one complete admin create/upload/open/download/rename/move/delete flow. Also verify bad login, good login, logout, 404 for bad paths, empty Finanzas Corporativas, keyboard focus, 390 × 844 and 1440 × 900 layouts. Report exact URL and any untested external Office Viewer behavior.
