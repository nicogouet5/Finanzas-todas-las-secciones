"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { MaterialCard, useViewedMaterials } from "@/components/material-card";
import type { MaterialItem } from "@/lib/materials";
import { kindForContentType, matchMaterials, type MaterialKind, type SearchableMaterial } from "@/lib/search";

export type SearchIndexItem = SearchableMaterial & {
  moduleId: string;
};

export type ExplorerModule = {
  id: string;
  title: string;
  items: Array<{ path: string; title: string; item: MaterialItem }>;
};

const KIND_LABELS: Record<"all" | MaterialKind, string> = {
  all: "Todo",
  pdf: "PDF",
  slides: "Slides",
  doc: "Doc",
  video: "Video",
  other: "Otro",
};

const KIND_ORDER: MaterialKind[] = ["pdf", "slides", "doc", "video", "other"];

/** Buscador tipo prompt + filtro por tipo + secciones de módulo colapsables. */
export function MaterialSearch({ index, modules }: { index: SearchIndexItem[]; modules: ExplorerModule[] }) {
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<"all" | MaterialKind>("all");
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxId = useId();
  const viewed = useViewedMaterials();

  const availableKinds = useMemo(() => {
    const present = new Set(index.map((item) => kindForContentType(item.contentType)));
    return KIND_ORDER.filter((k) => present.has(k));
  }, [index]);

  const dropdownResults = useMemo(() => {
    if (!query) return [];
    const byQuery = matchMaterials(index, query);
    return kind === "all" ? byQuery : byQuery.filter((item) => kindForContentType(item.contentType) === kind);
  }, [index, query, kind]);

  const matchedPaths = useMemo(() => {
    if (!query && kind === "all") return null;
    const byQuery = matchMaterials(index, query);
    const filtered = kind === "all" ? byQuery : byQuery.filter((item) => kindForContentType(item.contentType) === kind);
    return new Set(filtered.map((item) => item.path));
  }, [index, query, kind]);

  useEffect(() => {
    setActiveIndex(-1);
  }, [query, kind]);

  useEffect(() => {
    const isTypingElsewhere = (target: EventTarget | null) => {
      const el = target as HTMLElement | null;
      if (!el) return false;
      const tag = el.tagName;
      return tag === "INPUT" || tag === "TEXTAREA" || el.isContentEditable;
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "/" && document.activeElement !== inputRef.current && !isTypingElsewhere(document.activeElement)) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  function onInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      setQuery("");
      inputRef.current?.blur();
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) => Math.min(current + 1, dropdownResults.length - 1));
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) => Math.max(current - 1, 0));
      return;
    }
    if (event.key === "Enter") {
      const target = dropdownResults[activeIndex] ?? dropdownResults[0];
      if (target) {
        event.preventDefault();
        window.location.href = `/material/${target.path}`;
      }
    }
  }

  const activeItem = dropdownResults[activeIndex];
  const visibleModules = modules
    .map((module) => ({
      ...module,
      items: matchedPaths ? module.items.filter((entry) => matchedPaths.has(entry.path)) : module.items,
    }))
    .filter((module) => module.items.length > 0);

  const isFiltering = query.length > 0 || kind !== "all";

  return <div className="material-search">
    <div className="material-search__prompt">
      <span className="material-search__caret" aria-hidden="true">&gt;</span>
      <input
        ref={inputRef}
        type="text"
        role="combobox"
        aria-expanded={dropdownResults.length > 0 && query.length > 0}
        aria-controls={listboxId}
        aria-activedescendant={activeItem ? `${listboxId}-${activeItem.path}` : undefined}
        aria-autocomplete="list"
        autoComplete="off"
        spellCheck={false}
        placeholder="Buscar material… (presiona / para enfocar)"
        className="material-search__input"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={onInputKeyDown}
      />
    </div>

    {availableKinds.length > 0 && <div className="material-search__chips" role="group" aria-label="Filtrar por tipo">
      <button
        type="button"
        className={`material-search__chip${kind === "all" ? " material-search__chip--active" : ""}`}
        onClick={() => setKind("all")}
      >
        {KIND_LABELS.all}
      </button>
      {availableKinds.map((k) => <button
        key={k}
        type="button"
        className={`material-search__chip${kind === k ? " material-search__chip--active" : ""}`}
        onClick={() => setKind(k)}
      >
        {KIND_LABELS[k]}
      </button>)}
    </div>}

    <p className="material-search__status" aria-live="polite">
      {isFiltering ? `${visibleModules.reduce((sum, module) => sum + module.items.length, 0)} resultado${visibleModules.length === 1 && visibleModules[0]?.items.length === 1 ? "" : "s"}` : ""}
    </p>

    {query.length > 0 && <ul className="material-search__results" role="listbox" id={listboxId}>
      {dropdownResults.length === 0 && <li className="material-search__empty">Sin resultados para &ldquo;{query}&rdquo;.</li>}
      {dropdownResults.map((item, index) => <li
        key={item.path}
        id={`${listboxId}-${item.path}`}
        role="option"
        aria-selected={index === activeIndex}
        className={`material-search__result${index === activeIndex ? " material-search__result--active" : ""}`}
      >
        <Link href={`/material/${item.path}`}>
          <span className="material-search__result-title">{item.title}</span>
          <span className="material-search__result-module">{item.moduleTitle}</span>
        </Link>
      </li>)}
    </ul>}

    {!visibleModules.length && isFiltering && <p className="empty-state">Ningún material coincide con la búsqueda o el filtro.</p>}

    <div className="module-sections">
      {visibleModules.map((module, moduleIndex) => {
        const viewedCount = module.items.filter((entry) => viewed.has(entry.path)).length;
        const barAccent = moduleIndex % 2 === 0 ? "var(--accent-strong)" : "var(--accent)";
        return <section className="module-section module-section--collapsible" key={module.id} style={{ ["--module-accent" as string]: barAccent }}>
          <details open>
            <summary className="module-section__summary">
              <span className="module-section__number">{String(moduleIndex + 1).padStart(2, "0")}</span>
              <span className="module-section__heading">
                <span className="eyebrow module-section__kicker">// MODULO_{String(moduleIndex + 1).padStart(2, "0")}</span>
                <h2>{module.title}</h2>
              </span>
              <span className="module-section__count">{viewedCount}/{module.items.length} vistos</span>
            </summary>
            <div className="material-grid">
              {module.items.map((entry) => <MaterialCard item={entry.item} title={entry.title} key={entry.path} />)}
            </div>
          </details>
        </section>;
      })}
    </div>
  </div>;
}
