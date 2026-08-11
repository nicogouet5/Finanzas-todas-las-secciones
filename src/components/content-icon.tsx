export function ContentIcon({ kind }: { kind: "course" | "folder" | "file" }) {
  const icon = kind === "course"
    ? <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z" /><path d="M4 5.5v16" /></>
    : kind === "folder"
      ? <path d="M3 6.5h6l2 2H21v10.75A1.75 1.75 0 0 1 19.25 21h-14A1.75 1.75 0 0 1 3.5 19.25V6.5Z" />
      : <><path d="M6 3h8l4 4v14H6V3Z" /><path d="M14 3v5h5M9 13h6M9 17h6" /></>;

  return <svg className="content-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icon}</svg>;
}
