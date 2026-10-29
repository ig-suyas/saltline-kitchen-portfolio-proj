"use client";

import { Fragment, useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

type Props = {
  text: string;
  as?: ElementType;
  className?: string;
  /** Base delay in ms before the first word moves */
  delay?: number;
  /** "load" animates on first paint (CSS only), "view" waits until scrolled into view */
  trigger?: "load" | "view";
  /** Words (by index) to wrap in an accent span */
  accent?: number[];
  accentClass?: string;
  id?: string;
};

/**
 * Splits a heading into per-word clipping boxes. Real space characters sit
 * between the word boxes, so spacing, wrapping, copy/paste and screen reader
 * output stay identical to the plain sentence.
 */
export function SplitWords({ text, as: Tag = "h2", className, delay = 0, trigger = "view", accent = [], accentClass = "text-tomato", id }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [state, setState] = useState<"wait" | "go">(trigger === "load" ? "go" : "wait");

  useEffect(() => {
    if (trigger !== "view" || !ref.current) return;
    const el = ref.current;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState("go");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [trigger]);

  const words = text.split(" ");
  const out: ReactNode[] = [];
  words.forEach((w, i) => {
    out.push(
      <span key={`w${i}`} className="split-word">
        <span className={`split-inner${accent.includes(i) ? ` ${accentClass}` : ""}`} style={{ ["--i" as string]: i, ["--d" as string]: `${delay}ms` }}>
          {w}
        </span>
      </span>,
    );
    if (i < words.length - 1) out.push(<Fragment key={`s${i}`}> </Fragment>);
  });

  return (
    <Tag ref={ref} id={id} className={`${trigger === "load" ? "split-load " : ""}${className ?? ""}`} data-reveal={state}>
      {out}
    </Tag>
  );
}
