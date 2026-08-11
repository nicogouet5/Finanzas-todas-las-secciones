# Hub de Finanzas — diseño aprobado

## Objetivo

Crear un sitio público para estudiantes, mantenido por Nicolás desde un panel administrativo, donde puedan navegar y consultar materiales de Finanzas y Finanzas Corporativas sin iniciar sesión.

## Alcance

- Página de inicio con dos macro-materias: Finanzas y Finanzas Corporativas.
- Finanzas contendrá el material actual del repositorio.
- Finanzas Corporativas quedará creada y vacía para futuras cargas.
- Navegación jerárquica: inicio, ramo, carpeta y material.
- Panel `/admin` protegido para crear carpetas y subir, renombrar, mover o borrar archivos.
- Visualización dentro del sitio y descarga del material.
- Despliegue público en Vercel. Se usará URL `.vercel.app`; un dominio `.dev` propio requiere compra y configuración separadas.

## Arquitectura

- Next.js con App Router y React Server Components por defecto.
- Vercel Blob público para archivos.
- Carga directa desde navegador a Blob, sin límite artificial de aplicación; aplica el límite técnico vigente del proveedor.
- Árbol de carpetas derivado de rutas de objetos. Marcadores mínimos permiten carpetas vacías.
- Sin base de datos: un único administrador y rutas de Blob cubren el caso de uso.
- Credenciales administrativas y secreto de sesión solo en variables de entorno de Vercel.
- Cookie de sesión firmada, `httpOnly`, `secure` en producción y `sameSite=lax`.

## Experiencia estudiantil

- Inicio mobile-first con identidad UDD y tarjetas para ambos ramos.
- Página de ramo con carpetas y materiales, breadcrumbs y estados vacíos claros.
- Cada material muestra nombre, tipo y tamaño, con acciones Abrir y Descargar.
- HTML, PDF, imágenes, audio y video se muestran con visores nativos.
- Word y PowerPoint se muestran mediante Microsoft Office Viewer usando URL pública; si el visor externo falla, permanece disponible la descarga.
- HTML subido se abre en `iframe` aislado para reducir acceso al contexto de la aplicación.

## Experiencia administrativa

- Login en `/admin` con usuario configurado y contraseña secreta.
- Selección de ramo y carpeta destino.
- Crear carpeta.
- Subir uno o varios archivos con progreso y resultado visible.
- Renombrar, mover y borrar materiales o carpetas.
- Confirmación explícita antes de borrar.
- El panel no expone credenciales ni tokens de Blob al cliente; solo entrega tokens de carga acotados tras verificar sesión.

## Contenido inicial

- `Finanzas/Administración de caja`: `presentacion_administracion_caja.html` y `index.html`, preservando ambos archivos existentes.
- `Finanzas/Certamen 2`: `presentacion_certamen_2_finanzas.html`.
- `Finanzas Corporativas`: ramo creado sin materiales.

## Diseño visual

- Dirección dark futuristik académica.
- Fondo negro y gris carbón, variantes burdeos como acento, texto blanco y gris claro.
- Logo UDD PNG blanco en cabecera cuando el recurso oficial esté disponible; mientras tanto, wordmark tipográfico accesible sin inventar un escudo.
- Jerarquía editorial, tarjetas de bordes sutiles, brillo moderado y animaciones de 150–300 ms.
- Contraste mínimo 4.5:1, foco visible, navegación por teclado y controles táctiles de al menos 44 × 44 px.
- Respeto de `prefers-reduced-motion` y ausencia de scroll horizontal.

## Seguridad y validación

- Comparación segura de credenciales y sesión firmada.
- Normalización de nombres; rechazo de rutas absolutas, `..`, separadores inesperados y nombres vacíos.
- Lista de tipos permitidos orientada a material académico; HTML permitido solo mediante visor aislado.
- Operaciones administrativas verifican sesión en servidor.
- Mensajes de error útiles sin filtrar secretos.

## Fallos previstos

- Blob no configurado: panel explica variable o integración faltante; sitio conserva contenido inicial empaquetado.
- Carga interrumpida: archivo no se agrega al listado hasta confirmación del proveedor.
- Office Viewer no disponible: se ofrece descarga directa.
- Archivo inexistente o ruta inválida: página 404.
- Carpeta vacía: estado vacío con orientación para administrador.

## Verificación

- Check pequeño para normalización y construcción del árbol de rutas.
- Build de producción sin errores.
- Prueba manual del flujo público: inicio, ramo, carpeta, visor y descarga.
- Prueba manual del flujo admin: login fallido/exitoso, crear carpeta, subir, mover, renombrar y borrar.
- Revisión responsive móvil y escritorio, teclado, foco y contraste.
- Despliegue Vercel confirmado como `READY` y URL pública comprobada.

## Fuera de alcance

- Cuentas de estudiantes, matrículas, notas, comentarios y analítica.
- Editor de documentos dentro del navegador.
- Historial de versiones propio; Vercel Blob y Git conservan sus capacidades nativas.
- Dominio `.dev` comprado automáticamente.
