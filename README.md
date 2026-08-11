# Hub de Finanzas

Hub público de materiales de Finanzas y Finanzas Corporativas. Los estudiantes navegan y descargan sin cuenta; `/admin` requiere sesión configurada.

## Desarrollo

```bash
npm install
cp .env.example .env.local
npm run dev
npm test
npm run build
```

Configura solo en `.env.local` y en Vercel: `ADMIN_USER`, `ADMIN_PASSWORD`, `SESSION_SECRET` (mínimo 32 caracteres) y `BLOB_READ_WRITE_TOKEN`. No se deben guardar valores reales en Git.

Sin `BLOB_READ_WRITE_TOKEN`, el sitio sirve los tres HTML empaquetados y `/admin` explica la configuración faltante. Con Blob, el administrador inicia sesión en `/admin`, crea carpetas y sube archivos al almacenamiento público mediante una carga directa limitada por el proveedor, no por la aplicación.

HTML se abre en un iframe aislado; PDF, imágenes, audio y video usan visores nativos. Word y PowerPoint usan Office Viewer y siempre mantienen descarga directa. Los formatos sin visor también conservan descarga.

## Publicación

Después de vincular el proyecto y crear un Blob público en Vercel, carga las cuatro variables para Production y Preview, luego siembra el material:

```bash
vercel link
vercel env pull .env.local
node scripts/seed-blob.mjs
vercel --prod --yes
```

El seed no sobrescribe: informa `skipped existing` si la ruta ya existe. La URL pública será `.vercel.app`. Un dominio `.dev` requiere compra y configuración DNS por separado.
