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
};

export type FolderNode = {
  name: string;
  path: string;
  folders: FolderNode[];
  files: MaterialItem[];
};

const LOCAL_MATERIALS: MaterialItem[] = [
  {
    path: "finanzas/administracion-de-caja/index.html",
    name: "index.html",
    url: "/materiales/finanzas/administracion-de-caja/index.html",
    downloadUrl: "/materiales/finanzas/administracion-de-caja/index.html",
    size: 95_559,
    contentType: "text/html",
    source: "local",
  },
  {
    path: "finanzas/administracion-de-caja/presentacion_administracion_caja.html",
    name: "presentacion_administracion_caja.html",
    url: "/materiales/finanzas/administracion-de-caja/presentacion_administracion_caja.html",
    downloadUrl: "/materiales/finanzas/administracion-de-caja/presentacion_administracion_caja.html",
    size: 86_936,
    contentType: "text/html",
    source: "local",
  },
  {
    path: "finanzas/certamen-2/presentacion_certamen_2_finanzas.html",
    name: "presentacion_certamen_2_finanzas.html",
    url: "/materiales/finanzas/certamen-2/presentacion_certamen_2_finanzas.html",
    downloadUrl: "/materiales/finanzas/certamen-2/presentacion_certamen_2_finanzas.html",
    size: 115_909,
    contentType: "text/html",
    source: "local",
  },
];

export async function listMaterials(): Promise<MaterialItem[]> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return LOCAL_MATERIALS;

  const materials: MaterialItem[] = [];
  let cursor: string | undefined;
  do {
    const result = await list({ prefix: "materiales/", cursor });
    const page: Array<MaterialItem | null> = await Promise.all(result.blobs.map(async (blob) => {
      const path = blob.pathname.slice("materiales/".length);
      if (!path || path.endsWith("/.folder")) return null;
      const metadata = await head(blob.url);
      return {
        path,
        name: path.split("/").at(-1) ?? path,
        url: blob.url,
        downloadUrl: blob.downloadUrl,
        size: blob.size,
        contentType: metadata.contentType,
        source: "blob",
      };
    }));
    materials.push(...page.filter((item): item is MaterialItem => item !== null));
    cursor = result.cursor;
    if (!result.hasMore) break;
  } while (cursor);

  return materials;
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
