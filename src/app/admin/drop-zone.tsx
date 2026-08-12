"use client";

import { useState } from "react";

export function DropZone({ label, disabled, onFiles }: { label: string; disabled?: boolean; onFiles: (files: FileList) => void }) {
  const [active, setActive] = useState(false);

  return <label
    className={`drop-zone${active ? " drop-zone--active" : ""}`}
    onDragOver={(event) => { event.preventDefault(); setActive(true); }}
    onDragLeave={() => setActive(false)}
    onDrop={(event) => { event.preventDefault(); setActive(false); if (event.dataTransfer.files.length) onFiles(event.dataTransfer.files); }}
  >
    <span>{label}</span>
    <input type="file" multiple disabled={disabled} onChange={(event) => { if (event.target.files?.length) onFiles(event.target.files); event.target.value = ""; }} />
  </label>;
}
