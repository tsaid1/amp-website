"use client";

import { useRef, useEffect, useState } from "react";

interface AnimatedCounterProps {
  value: string;
  className?: string;
  duration?: number;
}

// Lightweight intersection observer hook
function useInView(ref: React.RefObject<Element | null>, options: { threshold?: number } = {}) {
  const [isInView, setIsInView] = useState(false);
  const { threshold = 0.5 } = options;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, threshold]);

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

export function AnimatedCounter({
  value,
  className,
  duration = 1.5,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { threshold: 0.5 });
  const prefersReducedMotion = useReducedMotion();
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    if (!isInView || prefersReducedMotion) {
      setDisplayValue(value);
      return;
    }

    // Parse the value to extract number and format
    const match = value.match(/^([<>]?)(\d+(?:\.\d+)?)([-+]?)(%?)(.*)$/);
    if (!match) {
      setDisplayValue(value);
      return;
    }

    const [, prefix, numStr, suffix, percent, rest] = match;
    const targetNum = parseFloat(numStr);
    const hasDecimal = numStr.includes(".");
    const decimalPlaces = hasDecimal ? numStr.split(".")[1].length : 0;

    const startTime = performance.now();
    const durationMs = duration * 1000;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / durationMs, 1);

      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = targetNum * easeOut;

      const formattedNum = hasDecimal
        ? currentValue.toFixed(decimalPlaces)
        : Math.floor(currentValue).toString();

      setDisplayValue(`${prefix}${formattedNum}${suffix}${percent}${rest}`);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, value, duration, prefersReducedMotion]);

  return (
    <span ref={ref} className={className}>
      {displayValue}
    </span>
  );
}
