"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import type { CourseSlug } from "@/lib/material-paths";
import { callApi } from "./admin-api";

export function CreateModuleForm({ course }: { course: CourseSlug }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!title.trim()) return;
    setBusy(true); setMessage("");
    const result = await callApi("/api/materials/modules", "POST", { course, title: title.trim() });
    setBusy(false);
    if (!result.ok) setMessage(result.error ?? "No fue posible crear el módulo.");
    else { setTitle(""); router.refresh(); }
  }

  return <form className="create-module-form" onSubmit={(event) => void submit(event)}>
    <label>Nuevo módulo
      <input value={title} disabled={busy} onChange={(event) => setTitle(event.target.value)} placeholder="Unidad 3: Renta fija" required />
    </label>
    <button className="button" disabled={busy}>Crear módulo</button>
    {message && <p role="status">{message}</p>}
  </form>;
}
