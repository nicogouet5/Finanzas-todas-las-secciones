export async function callApi(url: string, method: "POST" | "PATCH" | "DELETE" | "PUT", data: object): Promise<{ ok: boolean; error?: string }> {
  const response = await fetch(url, { method, headers: { "content-type": "application/json" }, body: JSON.stringify(data) });
  const result: unknown = await response.json().catch(() => ({}));
  const error = result && typeof result === "object" && "error" in result && typeof result.error === "string" ? result.error : undefined;
  return { ok: response.ok, error };
}
