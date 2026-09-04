import { stat } from "node:fs/promises";
import { resolve } from "node:path";
import { head, list } from "@vercel/blob";

export type MaterialSource = "local" | "blob";

export type MaterialItem = {
  path: string;
  name: string;
  url: string;
  downloadUrl: string;
  size: number;
  contentType: string;
  source: MaterialSource;
  /** ISO 8601. `null` para los materiales locales de respaldo, que no tienen fecha de subida. */
  uploadedAt: string | null;
};

export type FolderNode = {
  name: string;
  path: string;
  folders: FolderNode[];
  files: MaterialItem[];
};

type LocalMaterialSeed = Omit<MaterialItem, "size"> & {
  filePath: string;
  fallbackSize: number;
};

type ReadStat = (path: string) => Promise<{ size: number }>;

export const CERTAMEN_1_PRESENTATION_PATH = "finanzas-corporativas/certamen-1/presentacion-certamen-1-finanzas-corporativas.html";
export const CERTAMEN_1_PRESENTATION_TITLE = "Repaso Certamen 1: riesgo, dos períodos y portafolios";

const publicFile = (path: string) => resolve(process.cwd(), "public/materiales", path);

const LOCAL_MATERIALS: LocalMaterialSeed[] = [
  {
    path: "finanzas/administracion-de-caja/index.html",
    name: "index.html",
    url: "/materiales/finanzas/administracion-de-caja/index.html",
    downloadUrl: "/materiales/finanzas/administracion-de-caja/index.html",
    filePath: publicFile("finanzas/administracion-de-caja/index.html"),
    fallbackSize: 95_559,
    contentType: "text/html",
    uploadedAt: null,
    source: "local",
  },
  {
    path: "finanzas/administracion-de-caja/presentacion_administracion_caja.html",
    name: "presentacion_administracion_caja.html",
    url: "/materiales/finanzas/administracion-de-caja/presentacion_administracion_caja.html",
    downloadUrl: "/materiales/finanzas/administracion-de-caja/presentacion_administracion_caja.html",
    filePath: publicFile("finanzas/administracion-de-caja/presentacion_administracion_caja.html"),
    fallbackSize: 86_936,
    contentType: "text/html",
    uploadedAt: null,
    source: "local",
  },
  {
    path: "finanzas/certamen-2/presentacion_certamen_2_finanzas.html",
    name: "presentacion_certamen_2_finanzas.html",
    url: "/materiales/finanzas/certamen-2/presentacion_certamen_2_finanzas.html",
    downloadUrl: "/materiales/finanzas/certamen-2/presentacion_certamen_2_finanzas.html",
    filePath: publicFile("finanzas/certamen-2/presentacion_certamen_2_finanzas.html"),
    fallbackSize: 115_909,
    contentType: "text/html",
    uploadedAt: null,
    source: "local",
  },
  {
    path: CERTAMEN_1_PRESENTATION_PATH,
    name: CERTAMEN_1_PRESENTATION_TITLE,
    url: "/materiales/finanzas-corporativas/certamen-1/presentacion-certamen-1-finanzas-corporativas.html",
    downloadUrl: "/materiales/finanzas-corporativas/certamen-1/presentacion-certamen-1-finanzas-corporativas.html",
    filePath: publicFile(CERTAMEN_1_PRESENTATION_PATH),
    fallbackSize: 170_558,
    contentType: "text/html",
    uploadedAt: null,
    source: "local",
  },
];

export function mergeMaterials(blobItems: MaterialItem[], localItems: MaterialItem[]): MaterialItem[] {
  const merged = new Map(blobItems.map((item) => [item.path, item]));
  for (const item of localItems) merged.set(item.path, item);
  return [...merged.values()].sort((a, b) => a.path.localeCompare(b.path, "es"));
}

async function readBlobMaterials(): Promise<MaterialItem[]> {
  const materials: MaterialItem[] = [];
  let cursor: string | undefined;
  do {
    const result = await list({ prefix: "materiales/", cursor });
    const page: Array<MaterialItem | null> = await Promise.all(result.blobs.map(async (blob) => {
      const path = blob.pathname.slice("materiales/".length);
      // `_meta.json` guarda los módulos del ramo: es estado interno, no material del alumno.
      if (!path || path.endsWith("/.folder") || path.endsWith("/_meta.json")) return null;
      const metadata = await head(blob.url);
      return {
        path,
        name: path.split("/").at(-1) ?? path,
        url: blob.url,
        downloadUrl: blob.downloadUrl,
        size: blob.size,
        contentType: metadata.contentType,
        source: "blob",
        uploadedAt: blob.uploadedAt instanceof Date ? blob.uploadedAt.toISOString() : String(blob.uploadedAt),
      };
    }));
    materials.push(...page.filter((item): item is MaterialItem => item !== null));
    cursor = result.cursor;
    if (!result.hasMore) break;
  } while (cursor);

  return materials;
}

async function readLocalMaterials(readLocalStat: ReadStat = stat): Promise<MaterialItem[]> {
  return Promise.all(LOCAL_MATERIALS.map(async ({ filePath, fallbackSize, ...item }) => {
    try {
      return { ...item, size: (await readLocalStat(filePath)).size };
    } catch {
      return { ...item, size: fallbackSize };
    }
  }));
}

export async function listAdminMaterials(readRemote: () => Promise<MaterialItem[]> = readBlobMaterials, blobEnabled = Boolean(process.env.BLOB_READ_WRITE_TOKEN)): Promise<MaterialItem[]> {
  if (!blobEnabled) return [];
  return readRemote();
}

export async function listMaterials(
  readRemote: () => Promise<MaterialItem[]> = readBlobMaterials,
  blobEnabled = Boolean(process.env.BLOB_READ_WRITE_TOKEN),
  readLocalStat: ReadStat = stat,
): Promise<MaterialItem[]> {
  const localItems = await readLocalMaterials(readLocalStat);
  if (!blobEnabled) return mergeMaterials([], localItems);
  return mergeMaterials(await readRemote(), localItems);
}

export function buildMaterialTree(items: MaterialItem[]): FolderNode {
  const root: FolderNode = { name: "", path: "", folders: [], files: [] };
  const folders = new Map<string, FolderNode>([["", root]]);

  for (const item of items) {
    const parts = item.path.split("/");
    let parent = root;
    let currentPath = "";
    for (const part of parts.slice(0, -1)) {
      currentPath = currentPath ? `${currentPath}/${part}` : part;
      let folder = folders.get(currentPath);
      if (!folder) {
        folder = { name: part, path: currentPath, folders: [], files: [] };
        folders.set(currentPath, folder);
        parent.folders.push(folder);
      }
      parent = folder;
    }
    parent.files.push(item);
  }

  for (const folder of folders.values()) {
    folder.folders.sort((a, b) => a.name.localeCompare(b.name, "es"));
    folder.files.sort((a, b) => a.name.localeCompare(b.name, "es"));
  }
  return root;
}

export async function findMaterial(path: string): Promise<MaterialItem | null> {
  return (await listMaterials()).find((item) => item.path === path) ?? null;
}

export function buildMaterialFolders(items: MaterialItem[], marked: string[] = []): string[] {
  const folders = new Set(marked);
  for (const item of items) {
    const parts = item.path.split("/");
    for (let index = 2; index < parts.length; index++) folders.add(parts.slice(0, index).join("/"));
  }
  return [...folders].sort((a, b) => a.localeCompare(b, "es"));
}

export async function listMaterialFolders(items: MaterialItem[]): Promise<string[]> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return buildMaterialFolders(items);
  const marked: string[] = [];
  let cursor: string | undefined;
  do {
    const result = await list({ prefix: "materiales/", cursor });
    for (const blob of result.blobs) if (blob.pathname.endsWith("/.folder")) marked.push(blob.pathname.slice("materiales/".length, -"/.folder".length));
    cursor = result.cursor;
    if (!result.hasMore) break;
  } while (cursor);
  return buildMaterialFolders(items, marked);
}
