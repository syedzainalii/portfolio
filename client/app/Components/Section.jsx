export default function Section({
  id,
  sheetNumber,
  label,
  title,
  description,
  className = "",
  children,
}) {
  const number = String(sheetNumber).padStart(2, "0");

  return (
    <section
      id={id}
      className={`drawing-section ${className}`.trim()}
      aria-labelledby={`${id}-heading`}
    >
      <header className="drawing-section-heading">
        <p className="drawing-section-annotation">
          SHEET {number} / {label}
        </p>
        <div className="drawing-section-title-row">
          <h2 className="drawing-section-title" id={`${id}-heading`}>
            {title}
          </h2>
          <span className="drawing-dimension-line" aria-hidden="true">
            REF / 01
          </span>
        </div>
        {description && (
          <p className="drawing-section-description">{description}</p>
        )}
      </header>
      {children}
    </section>
  );
}
