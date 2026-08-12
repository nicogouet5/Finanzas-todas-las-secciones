"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { ContentIcon, iconKindForContentType } from "@/components/content-icon";
import type { MaterialItem } from "@/lib/materials";

const STORAGE_KEY = "material-progress:v1";

type Listener = () => void;
const listeners = new Set<Listener>();
let cache: Set<string> | null = null;

function readStorage(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

function getSnapshot(): ReadonlySet<string> {
  if (!cache) cache = readStorage();
  return cache;
}

// Debe ser la MISMA referencia en cada llamada: si devuelve un Set nuevo, React
// lo considera un cambio de estado en cada render y advierte de un bucle infinito.
const EMPTY_VIEWED: ReadonlySet<string> = new Set<string>();

function getServerSnapshot(): ReadonlySet<string> {
  return EMPTY_VIEWED;
}

function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Marca/desmarca un material como visto, persistiendo por `path` en localStorage. */
export function toggleViewed(path: string): void {
  const current = new Set(getSnapshot());
  if (current.has(path)) current.delete(path);
  else current.add(path);
  cache = current;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...current]));
    } catch {
      // localStorage no disponible (modo privado, cuota, etc.): el progreso simplemente no persiste.
    }
  }
  for (const listener of listeners) listener();
}

/** Progreso local de materiales vistos. Server snapshot vacío evita mismatches de hidratación. */
export function useViewedMaterials(): ReadonlySet<string> {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

const formatSize = (size: number) => (size < 1024 ? `${size} B` : `${(size / 1024).toFixed(1)} KB`);

export function MaterialCard({ item, title }: { item: MaterialItem; title?: string }) {
  const viewed = useViewedMaterials();
  const isViewed = viewed.has(item.path);

  return <article className={`material-card${isViewed ? " material-card--viewed" : ""}`}>
    <h3 className="course-card__title"><ContentIcon kind="file" fileType={iconKindForContentType(item.contentType)} />{title ?? item.name}</h3>
    <p>{item.contentType} · {formatSize(item.size)}</p>
    <div className="actions">
      <Link href={`/material/${item.path}`}>Abrir</Link>
      <a href={item.downloadUrl} download>Descargar</a>
      <button
        type="button"
        className="material-card__seen"
        aria-pressed={isViewed}
        onClick={() => toggleViewed(item.path)}
      >
        <span aria-hidden="true">{isViewed ? "✓" : "○"}</span> {isViewed ? "Visto" : "Marcar visto"}
      </button>
    </div>
  </article>;
}
