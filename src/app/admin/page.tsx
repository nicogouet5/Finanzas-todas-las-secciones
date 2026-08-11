import { LoginForm } from "./login-form";
import { AdminDashboard } from "./admin-dashboard";
import { isAdmin } from "@/lib/admin-session";
import { listMaterials } from "@/lib/materials";
export default async function AdminPage() { const authenticated = await isAdmin(); if (!authenticated) return <main id="main" className="page"><h1>Administración</h1><LoginForm /></main>; if (!process.env.BLOB_READ_WRITE_TOKEN) return <main id="main" className="page"><h1>Administración</h1><p className="empty-state">Configura BLOB_READ_WRITE_TOKEN en Vercel para habilitar cambios. El catálogo empaquetado sigue disponible.</p></main>; return <main id="main" className="page"><h1>Administración</h1><AdminDashboard items={await listMaterials()} /></main>; }
