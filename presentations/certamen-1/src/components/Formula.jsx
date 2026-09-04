export function Formula({ children, label }) {
  return <div className="formula" role="group" aria-label={label}>
    <code>{children}</code>
  </div>;
}
