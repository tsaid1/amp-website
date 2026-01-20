"use client";

import { forwardRef, type InputHTMLAttributes, useId } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  hideLabel?: boolean;
  showCharCount?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      hideLabel = false,
      showCharCount = false,
      className = "",
      id: providedId,
      maxLength,
      value,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = providedId || generatedId;
    const errorId = `${id}-error`;
    const hintId = `${id}-hint`;

    // Calculate character count if showing
    const charCount = typeof value === "string" ? value.length : 0;
    const isNearLimit = maxLength && charCount > maxLength * 0.8;

    const inputStyles = `
      w-full h-10 px-3
      text-base text-[var(--foreground)]
      bg-[var(--background)]
      border rounded-lg
      placeholder:text-[var(--muted)]
      focus:outline-2 focus:outline-offset-2 focus:outline-[var(--color-focus-ring)] focus:border-[var(--color-focus-ring)]
      disabled:cursor-not-allowed disabled:opacity-50
      transition-colors duration-200
    `;

    const borderColor = error
      ? "border-[var(--error)]"
      : "border-[var(--border)]";

    // Build aria-describedby based on what's present
    const describedBy = [
      error ? errorId : null,
      hint ? hintId : null,
    ]
      .filter(Boolean)
      .join(" ") || undefined;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={id}
            className={`text-sm font-medium text-[var(--foreground)] ${hideLabel ? "sr-only" : ""}`}
          >
            {label}
            {props.required && (
              <span className="text-[var(--error)] ml-1" aria-hidden="true">*</span>
            )}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          value={value}
          maxLength={maxLength}
          className={`${inputStyles} ${borderColor} ${error ? "error-shake" : ""} ${className}`.replace(/\s+/g, " ").trim()}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={describedBy}
          aria-required={props.required || undefined}
          {...props}
        />
        <div className="flex justify-between gap-2">
          <div className="flex-1 min-w-0">
            {error && (
              <p
                id={errorId}
                className="text-sm text-[var(--error)]"
                role="alert"
              >
                {error}
              </p>
            )}
            {!error && hint && (
              <p
                id={hintId}
                className="text-sm text-[var(--muted)]"
              >
                {hint}
              </p>
            )}
          </div>
          {showCharCount && maxLength && (
            <span
              className={`text-xs tabular-nums ${isNearLimit ? "text-[var(--warning)]" : "text-[var(--muted)]"}`}
              aria-live="polite"
              aria-atomic="true"
            >
              {charCount}/{maxLength}
            </span>
          )}
        </div>
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input, type InputProps };
