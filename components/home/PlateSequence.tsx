"use client";

/* eslint-disable @next/next/no-img-element -- stacked static SVG layers */
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { dishes } from "@/lib/art/dishes";
import { useMotionMode } from "@/lib/useMotionMode";

const dish = dishes.clams;
const steps = dish.layers;
// Where each paper layer falls from, in degrees of spin
const spins = [-120, 24, -36, 18, -28, 40, 0];

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Signature moment: each cut-paper layer drops onto the plate in the order the kitchen builds it.
 * Desktop: the section pins and scroll scrubs the drops (GSAP).
 * Touch and small screens: native scroll past step cards; each layer drops in as its card arrives.
 * Reduced motion: the finished plate with every step listed, nothing moves.
 */
export function PlateSequence() {
  const mode = useMotionMode();
  return mode === "desktop" ? (
    <PinnedPlate />
  ) : (
    <StackedPlate reduced={mode === "reduced"} />
  );
}

/* ---------- Shared pieces ---------- */

function Heading() {
  return (
    <>
      <p className="eyebrow">How a plate leaves the pass</p>
      <h2
        id="plate-title"
        className="mt-3 max-w-[12ch] text-[clamp(2.25rem,4.4vw+0.5rem,5.25rem)] leading-[0.92]"
      >
        Build a bowl of littleneck clams
      </h2>
    </>
  );
}

function Counter({
  active,
  className,
  lite,
}: {
  active: number;
  className?: string;
  lite?: boolean;
}) {
  const current = active >= 0 && active < steps.length ? steps[active] : null;
  const done = active >= steps.length;
  const label = done ? "Out to table 7" : (current?.label ?? "Scroll to start");
  return (
    <div
      className={`flex items-end gap-4 ${className ?? ""}`}
      aria-hidden="true"
    >
      <p className="font-display text-[clamp(3.5rem,6vw,6rem)] leading-[0.8] font-extrabold tracking-[-0.06em] tabular-nums">
        {pad(Math.max(1, Math.min(active + 1, steps.length)))}
        <span className="text-[0.4em] tracking-[-0.02em] text-brine/70">
          /{pad(steps.length)}
        </span>
      </p>
      <div className="relative h-[2.6rem] flex-1 overflow-hidden">
        {lite ? (
          // Phones: a CSS-only swap (no layout measuring), same easing and duration as the desktop version
          <p
            key={label}
            className="counter-label absolute inset-x-0 bottom-0 font-display text-[clamp(1.375rem,2vw,2rem)] leading-tight font-bold"
          >
            {label}
          </p>
        ) : (
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.p
              key={done ? "done" : (current?.id ?? "start")}
              className="absolute inset-x-0 bottom-0 font-display text-[clamp(1.375rem,2vw,2rem)] leading-tight font-bold"
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "-100%", opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              {label}
            </motion.p>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

/** Visually hidden caption that follows the plate, for screen readers */
function Caption({ active, reduced }: { active: number; reduced?: boolean }) {
  const text = reduced
    ? `The finished plate, built in ${steps.length} layers: ${steps.map((s) => s.label).join(", ")}.`
    : active < 0
      ? `An empty spot on the pass. Scroll to build the plate in ${steps.length} layers.`
      : active >= steps.length
        ? `Plate finished: littleneck clams in charred tomato broth with grilled sourdough, lemon and parsley. Small plates, $24.`
        : `Layer ${active + 1} of ${steps.length}: ${steps[active].label} added to the plate.`;
  return (
    <p className="sr-only" aria-live={reduced ? undefined : "polite"}>
      {text}
    </p>
  );
}

function Ticket({ className }: { className?: string }) {
  return (
    <div
      className={`plate-ticket ticket absolute px-5 py-4 text-left ${className ?? ""}`}
    >
      <p className="eyebrow text-[0.6875rem] text-muted">Small plates</p>
      <p className="font-display text-xl leading-tight font-extrabold tracking-[-0.03em]">
        Littleneck clams
      </p>
      <p className="mt-1 flex items-center justify-between gap-6">
        <span className="font-display text-2xl font-extrabold text-tomato">
          $24
        </span>
        <Link href="/menu#small" className="ulink min-h-11 text-[0.9375rem]">
          Menu <span aria-hidden="true">→</span>
        </Link>
      </p>
    </div>
  );
}

/* ---------- Desktop: pinned and scrubbed ---------- */

function PinnedPlate() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<(HTMLImageElement | null)[]>([]);
  const [active, setActive] = useState(-1);

  useEffect(() => {
    let ctx: { revert: () => void } | undefined;
    let cancelled = false;

    (async () => {
      const [{ gsap }, { ScrollTrigger }, { CustomEase }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
        import("gsap/CustomEase"),
      ]);
      if (cancelled || !sectionRef.current) return;
      gsap.registerPlugin(ScrollTrigger, CustomEase);
      // The page's --ease-drop token, so the scrubbed drops match the CSS reveals and the ending
      const drop = CustomEase.create("saltline-drop", "0.34,1.56,0.64,1");

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const layers = layerRefs.current.filter(Boolean) as HTMLImageElement[];
        const tl = gsap.timeline({
          defaults: { ease: drop, duration: 1 },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: () => `+=${window.innerHeight * (steps.length * 0.75 + 1.2)}`,
            pin: true,
            scrub: 0.7,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const t = self.progress * tl.duration();
              const next =
                self.progress === 0
                  ? -1
                  : Math.min(steps.length, Math.floor(t + 0.35));
              setActive((prev) => (prev === next ? prev : next));
            },
          },
        });

        layers.forEach((el, i) => {
          if (i === 0) {
            tl.fromTo(
              el,
              { scale: 0.35, rotation: spins[0], autoAlpha: 0 },
              { scale: 1, rotation: 0, autoAlpha: 1 },
              0,
            );
          } else {
            tl.fromTo(
              el,
              {
                yPercent: -120,
                rotation: spins[i] ?? 0,
                scale: 1.18,
                autoAlpha: 0,
              },
              { yPercent: 0, rotation: 0, scale: 1, autoAlpha: 1 },
              i,
            );
          }
        });
        tl.fromTo(
          stageRef.current,
          { rotation: 0 },
          { rotation: 10, ease: "power2.inOut", duration: steps.length },
          0,
        );
        // Held tail: the price tag and the background crossfade play here (time-based, see .plate-done in CSS)
        tl.to({}, { duration: 1.2 });
      });
      ctx = mm;
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  const done = active >= steps.length;

  return (
    <section
      ref={sectionRef}
      data-done={done || undefined}
      className="plate-section relative overflow-hidden bg-lemon text-brine"
      aria-labelledby="plate-title"
    >
      <div aria-hidden="true" className="plate-fade absolute inset-0 bg-salt" />
      <div className="wrap relative grid min-h-svh grid-cols-1 content-center gap-6 py-10 lg:grid-cols-12 lg:gap-10 lg:py-0">
        <div className="relative z-10 order-2 lg:order-1 lg:col-span-5 lg:self-center">
          <Heading />
          <Counter active={active} className="mt-6 lg:mt-10" />
          <Caption active={active} />

          <ol className="mt-8 hidden gap-1.5 lg:grid" aria-label="Plate layers">
            {steps.map((s, i) => {
              const state =
                i < active || done ? "done" : i === active ? "now" : "next";
              return (
                <li
                  key={s.id}
                  className={`flex items-center gap-3 rounded-full px-4 py-2 font-semibold transition-colors duration-300 ${
                    state === "now"
                      ? "bg-brine text-salt"
                      : state === "done"
                        ? "text-brine"
                        : "text-brine/55"
                  }`}
                >
                  <span className="w-7 text-sm tabular-nums">{pad(i + 1)}</span>
                  <span>{s.label}</span>
                  {state === "done" && <Check />}
                </li>
              );
            })}
          </ol>
        </div>

        <div className="relative order-1 mx-auto w-[min(88vw,54svh)] lg:order-2 lg:col-span-7 lg:w-[min(46vw,84svh)]">
          <div
            ref={stageRef}
            className="relative aspect-square w-full"
            role="img"
            aria-label={`Cut-paper illustration: ${dish.name}`}
          >
            {steps.map((s, i) => (
              <img
                key={s.id}
                ref={(el) => {
                  layerRefs.current[i] = el;
                }}
                src={`/art/clams/${s.id}.svg`}
                width={640}
                height={640}
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
                draggable={false}
                className="absolute inset-0 h-full w-full will-change-transform"
              />
            ))}
          </div>
          <Ticket className="right-[-2%] bottom-[2%] sm:right-[2%] lg:right-[-4%] lg:bottom-[6%]" />
        </div>
      </div>
    </section>
  );
}

/* ---------- Touch, small screens and reduced motion: native scroll ---------- */

function StackedPlate({ reduced }: { reduced: boolean }) {
  const cardRefs = useRef<(HTMLLIElement | null)[]>([]);
  const endRef = useRef<HTMLDivElement>(null);
  const [reached, setReached] = useState<number>(-1);
  const active = reduced ? steps.length : reached;

  useEffect(() => {
    if (reduced) return;
    const targets = [...cardRefs.current, endRef.current].filter(
      Boolean,
    ) as HTMLElement[];
    const passed = new Set<number>();
    // A card counts once its top crosses the line just under the sticky plate
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const i = targets.indexOf(e.target as HTMLElement);
          const below =
            e.boundingClientRect.top >
            (e.rootBounds?.bottom ?? window.innerHeight);
          if (e.isIntersecting || !below) passed.add(i);
          else passed.delete(i);
        }
        setReached(passed.size ? Math.max(...passed) : -1);
      },
      { rootMargin: "0px 0px -38% 0px" },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [reduced]);

  const done = active >= steps.length;

  return (
    <section
      data-done={done || undefined}
      data-static={reduced || undefined}
      className="plate-section relative overflow-x-clip bg-lemon text-brine"
      aria-labelledby="plate-title"
    >
      {!reduced && (
        <div
          aria-hidden="true"
          className="plate-fade absolute inset-0 bg-salt"
        />
      )}
      <div className="wrap relative pt-16 pb-10 md:pt-24">
        <Heading />
        <Caption active={active} reduced={reduced} />

        <div
          className={`${reduced ? "" : "sticky top-[72px]"} z-10 -mx-4 mt-6 px-4 pt-4 pb-5 sm:-mx-8 sm:px-8`}
        >
          {!reduced && (
            <>
              <div aria-hidden="true" className="absolute inset-0 bg-lemon" />
              <div
                aria-hidden="true"
                className="plate-fade absolute inset-0 bg-salt"
              />
            </>
          )}
          <div className="relative mx-auto w-[min(74vw,40svh)] md:w-[min(56vw,44svh)]">
            <div
              className="relative aspect-square w-full"
              role="img"
              aria-label={`Cut-paper illustration: ${dish.name}`}
            >
              {steps.map((s, i) => (
                <img
                  key={s.id}
                  src={`/art/clams/${s.id}.svg`}
                  width={640}
                  height={640}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  data-on={i <= active || undefined}
                  className="plate-layer absolute inset-0 h-full w-full"
                  style={
                    {
                      "--t0":
                        i === 0
                          ? `scale(0.35) rotate(${spins[0]}deg)`
                          : `translateY(-36%) rotate(${spins[i]}deg) scale(1.12)`,
                    } as CSSProperties
                  }
                />
              ))}
            </div>
            <Ticket className="right-[-6%] bottom-[-4%]" />
          </div>
          {!reduced && (
            <Counter active={active} lite className="relative mt-4" />
          )}
        </div>

        <ol className="relative mt-2" aria-label="Plate layers">
          {steps.map((s, i) => (
            <li
              key={s.id}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              data-on={i <= active || undefined}
              className={`plate-card flex items-start gap-4 border-t-2 border-brine/20 ${reduced ? "py-4" : "min-h-[30svh] pt-5"}`}
            >
              <span className="font-display text-2xl font-extrabold tabular-nums">
                {pad(i + 1)}
              </span>
              <span className="font-display text-[clamp(1.5rem,5vw,2.25rem)] leading-tight font-bold tracking-[-0.02em]">
                {s.label}
              </span>
              {(reduced || i <= active) && <Check className="mt-2 ml-auto" />}
            </li>
          ))}
        </ol>
        {!reduced && (
          <div ref={endRef} className="h-[34svh]" aria-hidden="true" />
        )}
      </div>
    </section>
  );
}

function Check({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={`h-4 w-4 shrink-0 ${className ?? "ml-auto"}`}
      aria-hidden="true"
    >
      <path
        d="M3 8.5 6.5 12 13 4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
