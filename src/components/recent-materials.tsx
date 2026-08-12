import Link from "next/link";
import { ContentIcon, iconKindForContentType } from "@/components/content-icon";
import type { CourseModule } from "@/lib/course-modules";
import type { MaterialItem } from "@/lib/materials";

const RELATIVE_UNITS: Array<[Intl.RelativeTimeFormatUnit, number]> = [
  ["year", 1000 * 60 * 60 * 24 * 365],
  ["month", 1000 * 60 * 60 * 24 * 30],
  ["week", 1000 * 60 * 60 * 24 * 7],
  ["day", 1000 * 60 * 60 * 24],
  ["hour", 1000 * 60 * 60],
  ["minute", 1000 * 60],
];

const relativeFormatter = new Intl.RelativeTimeFormat("es-CL", { numeric: "auto" });

function formatRelative(date: Date, now: Date): string {
  const diff = date.getTime() - now.getTime();
  for (const [unit, ms] of RELATIVE_UNITS) {
    if (Math.abs(diff) >= ms) return relativeFormatter.format(Math.round(diff / ms), unit);
  }
  return relativeFormatter.format(0, "minute");
}

type RecentEntry = {
  item: MaterialItem;
  title: string;
  courseLabel: string;
  moduleLabel: string;
  uploadedAt: Date;
};

const COURSE_LABELS: Record<string, string> = {
  finanzas: "Finanzas",
  "finanzas-corporativas": "Finanzas Corporativas",
};

export function RecentMaterials({
  courseModules,
  materials,
  uploadedAtByPath,
}: {
  courseModules: ReadonlyArray<{ course: string; modules: CourseModule[] }>;
  materials: readonly MaterialItem[];
  uploadedAtByPath: ReadonlyMap<string, string>;
}) {
  const materialsByPath = new Map(materials.map((item) => [item.path, item]));

  const entries: RecentEntry[] = [];
  for (const { course, modules } of courseModules) {
    for (const module of modules) {
      if (!module.published) continue;
      for (const moduleItem of module.items) {
        const item = materialsByPath.get(moduleItem.path);
        const uploadedAtIso = uploadedAtByPath.get(moduleItem.path);
        if (!item || !uploadedAtIso) continue;
        const uploadedAt = new Date(uploadedAtIso);
        if (Number.isNaN(uploadedAt.getTime())) continue;
        entries.push({
          item,
          title: moduleItem.title ?? item.name,
          courseLabel: COURSE_LABELS[course] ?? course,
          moduleLabel: module.title,
          uploadedAt,
        });
      }
    }
  }

  entries.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime());
  const recent = entries.slice(0, 5);

  if (recent.length === 0) return null;

  const now = new Date();
  const sevenDaysMs = 1000 * 60 * 60 * 24 * 7;

  return (
    <section className="recent-materials" aria-labelledby="recent-materials-title">
      <header>
        <p className="section-kicker">// RECIENTE_01</p>
        <h2 id="recent-materials-title">Recién publicado.</h2>
      </header>
      <ol className="recent-materials__list">
        {recent.map((entry) => {
          const isNew = now.getTime() - entry.uploadedAt.getTime() <= sevenDaysMs;
          return (
            <li key={entry.item.path}>
              <Link className="recent-materials__item" href={`/material/${entry.item.path}`}>
                <ContentIcon kind="file" fileType={iconKindForContentType(entry.item.contentType)} />
                <span className="recent-materials__body">
                  <span className="recent-materials__title">
                    <span className="recent-materials__name">{entry.title}</span>
                    {isNew ? <span className="recent-materials__badge">NUEVO</span> : null}
                  </span>
                  <span className="recent-materials__meta">
                    {entry.courseLabel} · {entry.moduleLabel} · {formatRelative(entry.uploadedAt, now)}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
