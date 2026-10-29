"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { useMotionMode } from "@/lib/useMotionMode";

/** Lenis smooth scrolling on desktop with a fine pointer only. Touch, small screens and reduced motion keep native scroll. */
export function SmoothScroll() {
  const lenis = useRef<Lenis | null>(null);
  const pathname = usePathname();
  const mode = useMotionMode();

  useEffect(() => {
    if (mode !== "desktop") return;
    const l = new Lenis({ autoRaf: true, lerp: 0.12, anchors: true });
    lenis.current = l;
    (window as unknown as { __lenis?: Lenis }).__lenis = l;
    return () => {
      l.destroy();
      lenis.current = null;
      (window as unknown as { __lenis?: Lenis }).__lenis = undefined;
    };
  }, [mode]);

  useEffect(() => {
    if (window.location.hash) return;
    lenis.current?.scrollTo(0, { immediate: true, force: true });
  }, [pathname]);

  return null;
}
