"use client";

import { useRef, useEffect, useState, createContext, useContext, type ReactNode, type CSSProperties } from "react";

// Context to share visibility state from parent to children (more efficient than MutationObserver)
const StaggerContext = createContext<boolean>(false);

interface FadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
  once?: boolean;
  threshold?: number;
}

// Custom hook for intersection observer (lighter than framer-motion)
function useInView(ref: React.RefObject<Element | null>, options: { once?: boolean; threshold?: number } = {}) {
  const [isInView, setIsInView] = useState(false);
  const { once = true, threshold = 0.2 } = options;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setIsInView(false);
        }
      },
      { threshold }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, once, threshold]);

  return isInView;
}

// Check for reduced motion preference
function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return prefersReducedMotion;
}

export function FadeIn({
  children,
  className,
  delay = 0,
  duration = 0.5,
  direction = "up",
  distance = 20,
  once = true,
  threshold = 0.2,
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, threshold });
  const prefersReducedMotion = useReducedMotion();

  // If user prefers reduced motion, render without animation
  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const getTransform = (visible: boolean) => {
    if (visible) return "translate3d(0, 0, 0)";
    switch (direction) {
      case "up":
        return `translate3d(0, ${distance}px, 0)`;
      case "down":
        return `translate3d(0, -${distance}px, 0)`;
      case "left":
        return `translate3d(${distance}px, 0, 0)`;
      case "right":
        return `translate3d(-${distance}px, 0, 0)`;
      case "none":
        return "translate3d(0, 0, 0)";
      default:
        return `translate3d(0, ${distance}px, 0)`;
    }
  };

  const style: CSSProperties = {
    opacity: isInView ? 1 : 0,
    transform: getTransform(isInView),
    transition: `opacity ${duration}s cubic-bezier(0.25, 0.1, 0.25, 1) ${delay}s, transform ${duration}s cubic-bezier(0.25, 0.1, 0.25, 1) ${delay}s`,
    willChange: isInView ? "auto" : "opacity, transform",
  };

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}

interface FadeInStaggerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function FadeInStagger({
  children,
  className,
  staggerDelay = 0.1,
}: FadeInStaggerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, threshold: 0.2 });
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  // Pass stagger info via CSS custom properties
  const style: CSSProperties = {
    // @ts-expect-error CSS custom properties
    "--stagger-delay": `${staggerDelay}s`,
  };

  return (
    <StaggerContext.Provider value={isInView}>
      <div ref={ref} className={className} style={style}>
        {children}
      </div>
    </StaggerContext.Provider>
  );
}

export function FadeInStaggerItem({
  children,
  className,
  index = 0,
}: {
  children: ReactNode;
  className?: string;
  index?: number;
}) {
  // Use context instead of MutationObserver (more efficient)
  const isParentVisible = useContext(StaggerContext);
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const style: CSSProperties = {
    opacity: isParentVisible ? 1 : 0,
    transform: isParentVisible ? "translate3d(0, 0, 0)" : "translate3d(0, 20px, 0)",
    transition: `opacity 0.5s cubic-bezier(0.25, 0.1, 0.25, 1) ${index * 0.1}s, transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1) ${index * 0.1}s`,
    willChange: isParentVisible ? "auto" : "opacity, transform",
  };

  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
}
