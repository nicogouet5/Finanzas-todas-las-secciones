const ASCII_ART = [
  " +---------------------------+",
  " |  01 $%01+- 0%1+ $01%+-01  |",
  " |  %0+   +---------+   -01  |",
  " |  1-  $ |  0 1 %+ | $  +0  |",
  " |  0%    | +- 0 1- |    %1  |",
  " |  +1  % |  1%0+-  | %  0+  |",
  " |  %0+   +---------+   -01  |",
  " |  01%+-0 $%1+0 -01$%+ 0+1  |",
  " +---------------------------+",
].join("\n");

export function EmptyState({
  title = "Sin vista previa disponible",
  description = "Este formato no puede mostrarse en el navegador.",
  downloadUrl,
  downloadLabel = "Descargar material",
}: {
  title?: string;
  description?: string;
  downloadUrl: string;
  downloadLabel?: string;
}) {
  return (
    <div className="empty-state">
      <pre className="empty-state-art" aria-hidden="true">{ASCII_ART}</pre>
      <p className="empty-state-title">{title}</p>
      <p className="empty-state-description">{description}</p>
      <a className="button empty-state-action" href={downloadUrl} download>
        {downloadLabel}
      </a>
    </div>
  );
}
