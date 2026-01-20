import { type HTMLAttributes, type ReactNode } from "react";

type ContainerBackground = "default" | "subtle" | "accent" | "inverse";

interface ContainerProps extends HTMLAttributes<HTMLElement> {
  as?: "div" | "section" | "article" | "main";
  background?: ContainerBackground;
  children: ReactNode;
}

function Container({
  as: Component = "section",
  background = "default",
  className = "",
  children,
  ...props
}: ContainerProps) {
  const baseStyles = `
    w-full
    mx-auto
    max-w-7xl
    px-4 sm:px-6 lg:px-8
  `;

  const backgroundStyles: Record<ContainerBackground, string> = {
    default: "bg-[var(--background)]",
    subtle: "bg-[var(--background-subtle)]",
    accent: "bg-[var(--color-primary-light)]",
    inverse: "bg-[var(--color-primary-dark)] text-white",
  };

  return (
    <Component
      className={`${baseStyles} ${backgroundStyles[background]} ${className}`.replace(/\s+/g, " ").trim()}
      {...props}
    >
      {children}
    </Component>
  );
}

interface SectionProps extends HTMLAttributes<HTMLElement> {
  background?: ContainerBackground;
  children: ReactNode;
}

function Section({
  background = "default",
  className = "",
  children,
  ...props
}: SectionProps) {
  const backgroundStyles: Record<ContainerBackground, string> = {
    default: "bg-[var(--background)]",
    subtle: "bg-[var(--background-subtle)]",
    accent: "bg-[var(--color-primary-light)]",
    inverse: "bg-[var(--color-primary-dark)] text-white",
  };

  return (
    <section
      className={`py-12 md:py-16 lg:py-24 ${backgroundStyles[background]} ${className}`.replace(/\s+/g, " ").trim()}
      {...props}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
}

export { Container, Section, type ContainerProps, type SectionProps };
