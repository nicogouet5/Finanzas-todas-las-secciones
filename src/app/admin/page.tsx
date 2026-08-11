import { LoginForm } from "./login-form";
import { AdminDashboard } from "./admin-dashboard";
import { isAdmin } from "@/lib/admin-session";
import { listMaterialFolders, listMaterials } from "@/lib/materials";
export default async function AdminPage() { const authenticated = await isAdmin(); if (!authenticated) return <main id="main" className="page"><h1>Administración</h1><LoginForm /></main>; if (!process.env.BLOB_READ_WRITE_TOKEN) return <main id="main" className="page"><h1>Administración</h1><AdminDashboard items={[]} folders={[]} configured={false} /></main>; const items = await listMaterials(); return <main id="main" className="page"><h1>Administración</h1><AdminDashboard items={items} folders={await listMaterialFolders(items)} configured /></main>; }
