"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Slot } from "@radix-ui/react-slot";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  asChild?: boolean;
  children: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      asChild = false,
      disabled,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    const baseStyles = `
      inline-flex items-center justify-center gap-2
      font-medium rounded-full
      transition-colors duration-200
      focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus-ring)]
    `;

    const variantStyles: Record<ButtonVariant, string> = {
      primary: `
        bg-[var(--color-btn-primary)] text-white
        hover:bg-[var(--color-btn-primary-hover)]
        active:bg-[var(--color-btn-primary-active)]
      `,
      secondary: `
        bg-white text-[var(--foreground)] border border-[var(--border)]
        hover:bg-[var(--background-subtle)]
        active:bg-[var(--background-subtle)]
      `,
      ghost: `
        bg-transparent text-[var(--muted)]
        hover:bg-[var(--background-subtle)]
        active:bg-[var(--background-subtle)]
      `,
    };

    const sizeStyles: Record<ButtonSize, string> = {
      sm: "h-8 px-3 text-sm min-w-[44px]",
      md: "h-10 px-4 text-sm min-w-[44px]",
      lg: "h-12 px-6 text-base min-w-[44px]",
    };

    const disabledStyles = isDisabled ? "cursor-not-allowed opacity-50" : "";

    // When asChild is true, we can't add the spinner as a sibling
    // The child element must handle its own loading state
    if (asChild) {
      return (
        <Slot
          ref={ref}
          className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles} ${className}`.replace(/\s+/g, " ").trim()}
          aria-disabled={isDisabled || undefined}
          aria-busy={loading || undefined}
          {...props}
        >
          {children}
        </Slot>
      );
    }

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles} ${className}`.replace(/\s+/g, " ").trim()}
        disabled={isDisabled}
        aria-disabled={isDisabled || undefined}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading && (
          <Spinner className={size === "lg" ? "h-5 w-5" : "h-4 w-4"} />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={`animate-spin ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

export { Button, type ButtonProps };
