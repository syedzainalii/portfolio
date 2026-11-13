export default function Tag({ accent = false, className = "", children, ...props }) {
  return (
    <span
      className={`drawing-tag${accent ? " is-accent" : ""} ${className}`.trim()}
      {...props}
    >
      {children}
    </span>
  );
}
