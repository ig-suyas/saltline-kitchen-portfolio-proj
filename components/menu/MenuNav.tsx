"use client";

import { useEffect, useRef, useState } from "react";

type Props = { sections: { id: string; title: string }[] };

/** Sticky section tabs that follow the reader down the menu. */
export function MenuNav({ sections }: Props) {
  const [active, setActive] = useState(sections[0]?.id);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const els = sections.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-140px 0px -55% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [sections]);

  // Keep the active tab visible in the horizontal strip on small screens
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-id="${active}"]`);
    const list = listRef.current;
    if (el && list) list.scrollTo({ left: el.offsetLeft - 16, behavior: "smooth" });
  }, [active]);

  return (
    <nav aria-label="Menu sections" className="sticky top-[72px] z-30 border-y-2 border-brine bg-salt">
      <ul ref={listRef} className="wrap flex gap-1 overflow-x-auto py-2 [scrollbar-width:none]">
        {sections.map((s) => (
          <li key={s.id} data-id={s.id} className="shrink-0">
            <a
              href={`#${s.id}`}
              aria-current={active === s.id ? "true" : undefined}
              className={`flex min-h-11 items-center rounded-full px-4 font-semibold whitespace-nowrap transition-colors duration-200 ${
                active === s.id ? "bg-brine text-salt" : "hover:bg-salt-deep"
              }`}
            >
              {s.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
