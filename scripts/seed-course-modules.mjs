import { BlobPreconditionFailedError, list, put } from "@vercel/blob";

const course = "finanzas";
const prefix = `materiales/${course}/`;

const result = await list({ prefix });
const items = result.blobs.filter((blob) => !blob.pathname.endsWith("/.folder") && blob.pathname !== `${prefix}_meta.json`);

const byFolder = new Map();
for (const blob of items) {
  const path = blob.pathname.slice(prefix.length);
  const folder = path.split("/").slice(0, -1).join("/");
  if (!folder) continue;
  if (!byFolder.has(folder)) byFolder.set(folder, []);
  byFolder.get(folder).push(`${course}/${path}`);
}

const folders = [...byFolder.keys()].sort((a, b) => a.localeCompare(b, "es"));
const modules = folders.map((folder, moduleIndex) => ({
  id: crypto.randomUUID(),
  title: folder.split("/").at(-1).replaceAll("-", " "),
  order: moduleIndex,
  published: true,
  items: byFolder.get(folder).sort((a, b) => a.localeCompare(b, "es")).map((path, itemIndex) => ({ path, order: itemIndex })),
}));

const meta = { version: 1, updatedAt: new Date().toISOString(), modules };

try {
  await put(`${prefix}_meta.json`, JSON.stringify(meta), { access: "public", contentType: "application/json", addRandomSuffix: false, allowOverwrite: false, cacheControlMaxAge: 0 });
  console.log(`creado ${prefix}_meta.json con ${modules.length} módulo(s)`);
} catch (error) {
  if (error instanceof BlobPreconditionFailedError) console.log(`omitido, ya existe ${prefix}_meta.json`);
  else throw error;
}
