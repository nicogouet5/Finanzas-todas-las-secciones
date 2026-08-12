"use client";

import { useState } from "react";

export function InlineEdit({ value, onSave, label }: { value: string; onSave: (next: string) => void | Promise<void>; label: string }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [busy, setBusy] = useState(false);

  async function save() {
    const next = draft.trim();
    if (!next || next === value) return setEditing(false);
    setBusy(true);
    await onSave(next);
    setBusy(false);
    setEditing(false);
  }

  if (!editing) return <button type="button" className="inline-edit__trigger" aria-label={label} onClick={() => { setDraft(value); setEditing(true); }}>{value}</button>;

  return <span className="inline-edit">
    <input
      autoFocus
      aria-label={label}
      value={draft}
      disabled={busy}
      onChange={(event) => setDraft(event.target.value)}
      onKeyDown={(event) => { if (event.key === "Enter") void save(); if (event.key === "Escape") setEditing(false); }}
      onBlur={() => void save()}
    />
  </span>;
}
