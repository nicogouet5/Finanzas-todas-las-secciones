import { ImageResponse } from "next/og";

export const alt = "Hub de Finanzas";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Fallback: no se pudo empaquetar una monoespaciada local dentro del limite de
// 500KB del bundle de ImageResponse, asi que se usa la fuente monoespaciada
// del runtime de Satori (ver docs/api-reference/functions/image-response).
const GLYPHS = "$%01+-";

function glyphAt(x: number, y: number) {
  return GLYPHS[Math.abs((x * 7 + y * 13) % GLYPHS.length)];
}

export default function Image() {
  const columns = 40;
  const rows = 18;
  const cells = Array.from({ length: columns * rows }, (_, index) => {
    const x = index % columns;
    const y = Math.floor(index / columns);
    return { x, y, glyph: glyphAt(x, y), accent: (x + y) % 5 === 0 };
  });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#09070b",
          position: "relative",
          fontFamily: "monospace",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexWrap: "wrap",
            opacity: 0.4,
          }}
        >
          {cells.map((cell) => (
            <div
              key={`${cell.x}-${cell.y}`}
              style={{
                width: `${100 / columns}%`,
                height: `${100 / rows}%`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                color: cell.accent ? "#ff5a84" : "#c7ff3d",
              }}
            >
              {cell.glyph}
            </div>
          ))}
        </div>
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 18,
            padding: "48px 64px",
            border: "1px solid rgba(255,255,255,0.18)",
            borderRadius: 24,
            background: "rgba(9,7,11,0.72)",
          }}
        >
          <div
            style={{
              display: "flex",
              color: "#c7ff3d",
              fontSize: 24,
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            {"// HUB_01"}
          </div>
          <div
            style={{
              display: "flex",
              color: "#fffafd",
              fontSize: 88,
              fontWeight: 700,
              letterSpacing: -3,
              lineHeight: 1,
            }}
          >
            HUB DE FINANZAS
          </div>
          <div
            style={{
              display: "flex",
              color: "#c9bcc5",
              fontSize: 28,
            }}
          >
            Materiales, visores y descargas para tus ramos
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
