import { type HTMLAttributes, type ReactNode } from "react";

type CardVariant = "default" | "elevated" | "outlined";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  children: ReactNode;
}

function Card({
  variant = "default",
  className = "",
  children,
  ...props
}: CardProps) {
  const baseStyles = `
    bg-[var(--background)]
    rounded-xl
    p-6
  `;

  const variantStyles: Record<CardVariant, string> = {
    default: `
      border border-[var(--border)]
    `,
    elevated: `
      shadow-[0_2px_4px_0_rgb(0_0_0/0.03),0_4px_8px_0_rgb(0_0_0/0.06)]
    `,
    outlined: `
      border-2 border-[var(--border)]
    `,
  };

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${className}`.replace(/\s+/g, " ").trim()}
      {...props}
    >
      {children}
    </div>
  );
}

export { Card, type CardProps };
