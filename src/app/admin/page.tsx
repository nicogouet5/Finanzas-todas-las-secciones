import { LoginForm } from "./login-form";
import { isAdmin } from "@/lib/admin-session";
export default async function AdminPage() { const authenticated = await isAdmin(); return <main id="main" className="page"><h1>Administración</h1>{authenticated ? <p>Sesión activa. La administración de materiales estará disponible aquí.</p> : <LoginForm />}</main>; }
