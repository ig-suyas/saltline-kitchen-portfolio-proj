"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef, type CSSProperties, type ReactNode } from "react";
import { useMotionMode } from "@/lib/useMotionMode";

type Props = {
  children: ReactNode;
  className?: string;
  /** Pixels of travel across the element's pass through the viewport. Negative moves up faster. */
  speed?: number;
  /** Degrees of rotation across the same pass */
  rotate?: number;
};

/**
 * Moves its children at a different rate than the page scroll.
 * Desktop: Motion scroll tracking. Touch and small screens: the same mapping as a
 * CSS scroll-driven animation, which runs off the main thread. Reduced motion: static.
 */
export function Parallax(props: Props) {
  const mode = useMotionMode();
  if (mode === "desktop") return <MotionParallax {...props} />;
  const { children, className, speed = -80, rotate = 0 } = props;
  return (
    <div className={`${mode === "lite" ? "parallax-css " : ""}${className ?? ""}`} style={{ "--py": speed, "--pr": rotate } as CSSProperties}>
      {children}
    </div>
  );
}

function MotionParallax({ children, className, speed = -80, rotate = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-speed / 2, speed / 2]);
  const r = useTransform(scrollYProgress, [0, 1], [-rotate / 2, rotate / 2]);

  return (
    <motion.div ref={ref} className={className} style={{ y, rotate: r }}>
      {children}
    </motion.div>
  );
}
