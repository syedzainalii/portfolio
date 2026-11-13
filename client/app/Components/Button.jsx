export default function Button({
  href,
  variant = "secondary",
  className = "",
  children,
  type = "button",
  ...props
}) {
  const classes = `drawing-button${variant === "primary" ? " is-primary" : ""} ${className}`.trim();

  if (href) {
    return (
      <a className={classes} href={href} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} type={type} {...props}>
      {children}
    </button>
  );
}
