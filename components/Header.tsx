"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Wordmark } from "./Logo";

const links = [
  { href: "/menu", label: "Menu" },
  { href: "/locations", label: "Locations" },
  { href: "/order", label: "Order at Table" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Solid header once the page moves: watch a marker at the top of the document instead of listening to scroll
  useEffect(() => {
    const marker = document.getElementById("top-marker");
    if (!marker) return;
    const io = new IntersectionObserver(([e]) => setScrolled(!e.isIntersecting));
    io.observe(marker);
    return () => io.disconnect();
  }, []);

  // Close the mobile menu on navigation
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>("a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
      if (e.key === "Tab" && panel) {
        const items = [toggleRef.current, ...panel.querySelectorAll<HTMLElement>("a")].filter(Boolean) as HTMLElement[];
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={`sticky top-0 z-50 transition-[background-color,box-shadow] duration-300 ${
        scrolled || open ? "bg-salt shadow-[0_1px_0_var(--color-line)]" : "bg-salt/0"
      }`}
    >
      <div className="wrap flex h-[72px] items-center justify-between gap-6">
        <Link href="/" className="relative z-10 -ml-1 flex min-h-11 items-center rounded-md px-1" aria-label="Saltline Kitchen, home">
          <Wordmark />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isActive(l.href) ? "page" : undefined}
              className="group relative flex min-h-11 items-center rounded-md px-3.5 font-semibold"
            >
              <span>{l.label}</span>
              <span
                aria-hidden="true"
                className={`absolute inset-x-3.5 bottom-1.5 h-[3px] origin-left rounded-full bg-tomato transition-transform duration-300 ease-[var(--ease-out-expo)] ${
                  isActive(l.href) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                }`}
              />
            </Link>
          ))}
          <Link href="/reserve" className="btn btn-sm ml-3" aria-current={isActive("/reserve") ? "page" : undefined}>
            <span className="btn-face">Reservations</span>
          </Link>
        </nav>

        <button
          ref={toggleRef}
          type="button"
          className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-brine text-salt md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="relative block h-3.5 w-5" aria-hidden="true">
            <span className={`absolute left-0 top-0 h-[2.5px] w-5 rounded bg-current transition-transform duration-300 ${open ? "translate-y-[5.5px] rotate-45" : ""}`} />
            <span className={`absolute bottom-0 left-0 h-[2.5px] w-5 rounded bg-current transition-transform duration-300 ${open ? "-translate-y-[5.5px] -rotate-45" : ""}`} />
          </span>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            ref={panelRef}
            className="fixed inset-x-0 top-[72px] bottom-0 z-40 overflow-y-auto bg-salt md:hidden"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <nav aria-label="Mobile" className="wrap flex flex-col pt-6 pb-10">
              {[{ href: "/", label: "Home" }, ...links, { href: "/reserve", label: "Reservations" }].map((l, i) => (
                <motion.div key={l.href} initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.04 * i, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
                  <Link
                    href={l.href}
                    aria-current={pathname === l.href ? "page" : undefined}
                    className={`flex min-h-16 items-center border-b border-line font-display text-[2.5rem] leading-none font-extrabold tracking-[-0.04em] ${
                      pathname === l.href ? "text-tomato" : ""
                    }`}
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
              <p className="mt-8 text-muted">Red Hook · Greenpoint · Carroll Gardens</p>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
