import Link from "next/link";

type Crumb = { href?: string; label: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return <nav className="breadcrumbs" aria-label="Migas de pan">{items.map((item, index) => <span key={`${item.label}-${index}`}>{item.href ? <Link href={item.href}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}{index < items.length - 1 ? " / " : ""}</span>)}</nav>;
}
