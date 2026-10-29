"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import type { CSSProperties, ReactNode } from "react";
import { Dish, Piece } from "@/components/Art";
import { SplitWords } from "@/components/SplitWords";
import { useMotionMode, type MotionMode } from "@/lib/useMotionMode";

type LayerProps = { y?: number; r?: number; className?: string; children: ReactNode };

/**
 * One hero collage layer that drifts over the first 900px of scroll.
 * Desktop uses Motion; touch and small screens use a CSS scroll-driven animation
 * with the same mapping (off the main thread); reduced motion stays put.
 */
function ScrollLayer({ mode, ...props }: LayerProps & { mode: MotionMode }) {
  if (mode === "desktop") return <MotionLayer {...props} />;
  const { y = 0, r = 0, className, children } = props;
  return (
    <div className={`${mode === "lite" ? "hero-scroll " : ""}${className ?? ""}`} style={{ "--hy": `${y}px`, "--hr": `${r}deg` } as CSSProperties}>
      {children}
    </div>
  );
}

function MotionLayer({ y = 0, r = 0, className, children }: LayerProps) {
  const { scrollY } = useScroll();
  const ty = useTransform(scrollY, [0, 900], [0, y]);
  const tr = useTransform(scrollY, [0, 900], [0, r]);
  return (
    <motion.div className={className} style={{ y: ty, rotate: tr }}>
      {children}
    </motion.div>
  );
}

export function HomeHero() {
  const mode = useMotionMode();

  return (
    <section className="relative isolate overflow-hidden" aria-labelledby="hero-title">
      <div className="wrap relative grid min-h-[calc(100svh-72px)] grid-cols-1 content-center gap-10 pt-8 pb-20 lg:grid-cols-12 lg:pt-4 lg:pb-28">
        <div className="relative z-10 lg:col-span-7">
          <p className="eyebrow fade-in text-muted" style={{ ["--d" as string]: "100ms" }}>
            Red Hook · Greenpoint · Carroll Gardens
          </p>
          <SplitWords
            as="h1"
            id="hero-title"
            trigger="load"
            delay={60}
            text="Brooklyn seafood, cooked over live fire."
            accent={[4, 5]}
            className="mt-5 max-w-[11ch] text-[clamp(3.25rem,8vw+1rem,9.5rem)] leading-[0.86]"
          />
          <p className="fade-in mt-8 max-w-[34rem] text-lead text-brine/90" style={{ ["--d" as string]: "750ms" }}>
            Oysters shucked to order, whole fish off the oak grill, and three very different rooms to eat them in.
          </p>
          <div className="fade-in mt-9 flex flex-wrap items-center gap-x-7 gap-y-4" style={{ ["--d" as string]: "880ms" }}>
            <Link href="/reserve" className="btn">
              <span className="btn-face">Book a table</span>
            </Link>
            <Link href="/menu" className="ulink text-lg">
              See the menu
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        {/* Collage: the dish plus loose cut-paper pieces at different depths */}
        <div className="relative -mr-[30vw] h-[min(108vw,560px)] lg:absolute lg:top-1/2 lg:right-[-9vw] lg:mr-0 lg:h-auto lg:w-[min(50vw,780px)] lg:-translate-y-1/2">
          <ScrollLayer mode={mode} y={140} className="absolute inset-y-0 left-0 aspect-square h-full lg:relative lg:h-auto lg:w-full">
            <div className="paper-drop h-full w-full" style={{ ["--d" as string]: "350ms", ["--r0" as string]: "-40deg" }}>
              <ScrollLayer mode={mode} r={38} className="h-full w-full">
                <Dish id="clams" className="h-full w-full" />
              </ScrollLayer>
            </div>
          </ScrollLayer>

          <ScrollLayer mode={mode} y={-260} r={-50} className="absolute top-[-4%] left-[58%] w-[24%] lg:top-[-6%] lg:left-[70%]">
            <Piece id="lemon" className="paper-drop h-auto w-full rotate-[18deg]" style={{ ["--d" as string]: "900ms", ["--r0" as string]: "40deg" }} />
          </ScrollLayer>
          <ScrollLayer mode={mode} y={-140} className="absolute bottom-[2%] left-[2%] w-[30%] lg:bottom-[-4%] lg:left-[-6%]">
            <Piece id="bread" className="paper-drop h-auto w-full -rotate-[24deg]" style={{ ["--d" as string]: "1020ms", ["--r0" as string]: "-30deg" }} />
          </ScrollLayer>
          <ScrollLayer mode={mode} y={90} className="absolute top-[10%] left-[-4%] w-[13%] lg:top-[4%] lg:left-[-10%]">
            <Piece id="sprig" className="paper-drop h-auto w-full rotate-[-30deg]" style={{ ["--d" as string]: "1140ms" }} />
          </ScrollLayer>
          <ScrollLayer mode={mode} y={-260} className="absolute right-[34%] bottom-[-6%] w-[20%] lg:right-[16%] lg:bottom-[-10%]">
            <Piece id="tomato" className="paper-drop h-auto w-full" style={{ ["--d" as string]: "1260ms", ["--r0" as string]: "60deg" }} />
          </ScrollLayer>
        </div>
      </div>
    </section>
  );
}
