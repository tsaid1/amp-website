import { type HTMLAttributes, type ReactNode } from "react";

type BadgeVariant = "default" | "primary" | "dark" | "success" | "warning";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children: ReactNode;
}

function Badge({
  variant = "default",
  className = "",
  children,
  ...props
}: BadgeProps) {
  // Use CSS classes from globals.css for consistency
  const variantClasses: Record<BadgeVariant, string> = {
    default: "badge badge-primary",
    primary: "badge badge-primary",
    dark: "badge badge-dark",
    success: "badge bg-[var(--success)]/10 text-[var(--success)]",
    warning: "badge bg-[var(--warning)]/10 text-[var(--warning)]",
  };

  return (
    <span
      className={`${variantClasses[variant]} ${className}`.trim()}
      {...props}
    >
      {children}
    </span>
  );
}

export { Badge, type BadgeProps };
