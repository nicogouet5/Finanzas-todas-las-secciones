import { LoginForm } from "./login-form";
import { AdminDashboard, type CourseModulesData } from "./admin-dashboard";
import { isAdmin } from "@/lib/admin-session";
import { listCourseModules } from "@/lib/course-modules";
import type { CourseSlug } from "@/lib/material-paths";
import { listMaterials } from "@/lib/materials";

const COURSES: CourseSlug[] = ["finanzas", "finanzas-corporativas"];
const EMPTY_DATA: CourseModulesData = { modules: [], unassigned: [], allItems: [] };

export default async function AdminPage() {
  const authenticated = await isAdmin();
  if (!authenticated) return <main id="main" className="page"><h1>Administración</h1><LoginForm /></main>;
  if (!process.env.BLOB_READ_WRITE_TOKEN) return <main id="main" className="page"><h1>Administración</h1><AdminDashboard coursesData={{ finanzas: EMPTY_DATA, "finanzas-corporativas": EMPTY_DATA }} configured={false} /></main>;

  const items = await listMaterials();
  const entries = await Promise.all(COURSES.map(async (course) => {
    const { modules, unassigned } = await listCourseModules(course, items);
    const allItems = items.filter((item) => item.path.startsWith(`${course}/`));
    return [course, { modules, unassigned, allItems }] as const;
  }));
  const coursesData = Object.fromEntries(entries) as Record<CourseSlug, CourseModulesData>;

  return <main id="main" className="page"><h1>Administración</h1><AdminDashboard coursesData={coursesData} configured /></main>;
}
