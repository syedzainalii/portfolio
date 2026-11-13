export default function Card({ className = "", children, ...props }) {
  return (
    <div className={`drawing-card ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}
