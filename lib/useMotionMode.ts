"use client";

import { useSyncExternalStore } from "react";

/**
 * "desktop": wide screen with a fine pointer. Gets the full JS-driven motion (GSAP pin, Motion parallax, Lenis).
 * "lite":    phones, tablets and touch screens. Native scroll, CSS scroll-driven parallax, no pinning.
 * "reduced": prefers-reduced-motion. Static layouts, no smooth scroll.
 */
export type MotionMode = "desktop" | "lite" | "reduced";

export const DESKTOP_QUERY = "(min-width: 1024px) and (hover: hover) and (pointer: fine)";
const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

export function getMotionMode(): MotionMode {
  if (window.matchMedia(REDUCED_QUERY).matches) return "reduced";
  return window.matchMedia(DESKTOP_QUERY).matches ? "desktop" : "lite";
}

const subscribe = (cb: () => void) => {
  const lists = [window.matchMedia(REDUCED_QUERY), window.matchMedia(DESKTOP_QUERY)];
  lists.forEach((l) => l.addEventListener("change", cb));
  return () => lists.forEach((l) => l.removeEventListener("change", cb));
};

/** Server render and first hydration pass use "lite", so phones never mount the desktop motion code. */
export function useMotionMode(): MotionMode {
  return useSyncExternalStore(subscribe, getMotionMode, () => "lite");
}
