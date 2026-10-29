"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { Piece } from "@/components/Art";
import { locationById, locations, type LocationId } from "@/lib/locations";
import { itemById, menu, money, tagLabels, type MenuItem } from "@/lib/menu";
import { useQueryParam } from "@/lib/useQueryParam";

type Step = "table" | "menu" | "review" | "sent";
type Cart = Record<string, number>;
type CartAction = { type: "add" | "remove"; id: string } | { type: "set"; id: string; qty: number } | { type: "clear" };

const TAX = 0.08875; // NYC sales tax
const ease = [0.16, 1, 0.3, 1] as const;

function cartReducer(state: Cart, a: CartAction): Cart {
  switch (a.type) {
    case "add":
      return { ...state, [a.id]: Math.min(20, (state[a.id] ?? 0) + 1) };
    case "remove": {
      const q = (state[a.id] ?? 0) - 1;
      const next = { ...state };
      if (q <= 0) delete next[a.id];
      else next[a.id] = q;
      return next;
    }
    case "set": {
      const next = { ...state };
      if (a.qty <= 0) delete next[a.id];
      else next[a.id] = a.qty;
      return next;
    }
    case "clear":
      return {};
  }
}

const stepsMeta: { id: Step; label: string }[] = [
  { id: "table", label: "Table" },
  { id: "menu", label: "Menu" },
  { id: "review", label: "Review" },
  { id: "sent", label: "Order confirmed (demo)" },
];

export function OrderApp() {
  const scannedLoc = locationById(useQueryParam("location"));
  const scannedTable = Number(useQueryParam("table"));
  const scanned = scannedLoc && scannedTable >= 1 && scannedTable <= scannedLoc.tables ? { loc: scannedLoc.id, table: scannedTable } : null;

  const [step, setStep] = useState<Step>("table");
  // undefined = untouched, so a scanned table (read after hydration) fills in
  const [pickedLocation, setLocation] = useState<LocationId | null | undefined>(undefined);
  const [pickedTable, setTable] = useState<number | null | undefined>(undefined);
  const location = pickedLocation === undefined ? (scanned?.loc ?? null) : pickedLocation;
  const table = pickedTable === undefined ? (pickedLocation === undefined ? (scanned?.table ?? null) : null) : pickedTable;
  const [cart, dispatch] = useReducer(cartReducer, {});
  const [notes, setNotes] = useState("");
  const [announce, setAnnounce] = useState("");
  const [orderNo, setOrderNo] = useState("");
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);
  const focusPending = useRef(false);

  const lines = useMemo(
    () =>
      Object.entries(cart)
        .map(([id, qty]) => ({ item: itemById(id)!, qty }))
        .filter((l) => l.item),
    [cart],
  );
  const count = lines.reduce((n, l) => n + l.qty, 0);
  const subtotal = lines.reduce((n, l) => n + l.qty * l.item.price, 0);

  // Move focus to the new step's heading so keyboard and screen reader users land in the right place
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    window.scrollTo({ top: 0, behavior: "auto" });
    (window as unknown as { __lenis?: { scrollTo: (n: number, o: object) => void } }).__lenis?.scrollTo(0, { immediate: true });
    focusPending.current = true;
  }, [step]);

  const loc = location ? locationById(location)! : null;

  const add = (item: MenuItem) => {
    dispatch({ type: "add", id: item.id });
    setAnnounce(`Added ${item.name}. ${count + 1} ${count + 1 === 1 ? "item" : "items"} in your tray.`);
  };
  const remove = (item: MenuItem) => {
    dispatch({ type: "remove", id: item.id });
    setAnnounce(`Removed one ${item.name}.`);
  };

  return (
    <div>
      <div className="bg-lemon">
        <p className="wrap flex min-h-12 flex-wrap items-center gap-x-3 gap-y-1 py-2 font-semibold text-brine">
          <span className="rounded-full bg-brine px-2.5 py-0.5 text-sm font-bold text-lemon">Demo: nothing is sent</span>
          <span className="text-[0.9375rem]">A front-end prototype of QR table ordering. Your tray lives only in this browser tab.</span>
        </p>
      </div>

      <div className="wrap pt-8 pb-28 md:pt-12 lg:pb-24">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-2 text-sm font-bold" aria-label="Order progress">
          {stepsMeta.map((s, i) => {
            const idx = stepsMeta.findIndex((x) => x.id === step);
            const state = i < idx ? "done" : i === idx ? "now" : "next";
            return (
              <li key={s.id} className="flex items-center gap-2" aria-current={state === "now" ? "step" : undefined}>
                <span
                  className={`flex h-8 items-center gap-2 rounded-full px-3 transition-colors duration-300 ${
                    state === "now" ? "bg-brine text-salt" : state === "done" ? "bg-salt-deep text-brine" : "text-muted ring-2 ring-brine/20 ring-inset"
                  }`}
                >
                  <span className="tabular-nums">{i + 1}</span>
                  {s.label}
                </span>
                {i < stepsMeta.length - 1 && <span aria-hidden="true" className="h-0.5 w-4 bg-brine/25" />}
              </li>
            );
          })}
        </ol>

        <p className="sr-only" aria-live="polite">
          {announce}
        </p>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.35, ease }}
            onAnimationComplete={(def) => {
              // The new step mounts only after the old one exits, so focus its heading once it's in.
              // Ignore the exit animation of the outgoing step.
              if (focusPending.current && (def as { opacity?: number }).opacity === 1) {
                focusPending.current = false;
                headingRef.current?.focus();
              }
            }}
          >
            {step === "table" && (
              <TableStep
                headingRef={headingRef}
                scanned={scanned}
                location={location}
                table={table}
                onLocation={(id) => {
                  setLocation(id);
                  setTable(null);
                }}
                onTable={setTable}
                onStart={() => setStep("menu")}
              />
            )}
            {step === "menu" && loc && table && (
              <MenuStep
                headingRef={headingRef}
                locName={loc.neighborhood}
                table={table}
                cart={cart}
                lines={lines}
                count={count}
                subtotal={subtotal}
                onAdd={add}
                onRemove={remove}
                onChangeTable={() => setStep("table")}
                onReview={() => setStep("review")}
              />
            )}
            {step === "review" && loc && table && (
              <ReviewStep
                headingRef={headingRef}
                locName={loc.neighborhood}
                table={table}
                lines={lines}
                subtotal={subtotal}
                notes={notes}
                onNotes={setNotes}
                onAdd={add}
                onRemove={remove}
                onBack={() => setStep("menu")}
                onSent={() => {
                  setOrderNo(`SL-${Math.floor(1000 + Math.random() * 9000)}`);
                  setStep("sent");
                }}
              />
            )}
            {step === "sent" && loc && table && (
              <SentStep
                headingRef={headingRef}
                orderNo={orderNo}
                locName={loc.neighborhood}
                table={table}
                lines={lines}
                total={subtotal * (1 + TAX)}
                onMore={() => {
                  dispatch({ type: "clear" });
                  setNotes("");
                  setStep("menu");
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

type HeadingRef = React.RefObject<HTMLHeadingElement | null>;
type Line = { item: MenuItem; qty: number };

/* ---------------- Step 1: table ---------------- */

function TableStep({
  headingRef,
  scanned,
  location,
  table,
  onLocation,
  onTable,
  onStart,
}: {
  headingRef: HeadingRef;
  scanned: { loc: LocationId; table: number } | null;
  location: LocationId | null;
  table: number | null;
  onLocation: (id: LocationId) => void;
  onTable: (n: number) => void;
  onStart: () => void;
}) {
  const [pickingChoice, setPicking] = useState<boolean | undefined>(undefined);
  const picking = pickingChoice ?? !scanned;
  const loc = location ? locationById(location) : null;
  const ready = !!(location && table);

  return (
    <section className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-12" aria-labelledby="step-title">
      <div className="lg:col-span-5">
        <h1 id="step-title" ref={headingRef} tabIndex={-1} className="text-[clamp(3rem,6vw+1rem,6.5rem)] leading-[0.9] outline-none">
          {scanned && !picking ? `Table ${scanned.table}, ${locationById(scanned.loc)!.neighborhood}` : "Which table are you at?"}
        </h1>
        <p className="mt-5 max-w-md text-lead text-muted">
          {scanned && !picking
            ? "The code on your table brought you here, so the kitchen already knows where to bring the food."
            : "In the real thing, scanning the code on your table fills this in. For the demo, pick a room and a table."}
        </p>
        {scanned && !picking && (
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <button type="button" className="btn" onClick={onStart}>
              <span className="btn-face">Start ordering</span>
            </button>
            <button type="button" className="ulink" onClick={() => setPicking(true)}>
              Not your table? Change it
            </button>
          </div>
        )}
      </div>

      <div className="lg:col-span-7">
        {picking ? (
          <div className="ticket px-5 py-7 sm:px-8">
            <fieldset>
              <legend className="eyebrow">Room</legend>
              <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                {locations.map((l) => {
                  const on = location === l.id;
                  return (
                    <button
                      key={l.id}
                      type="button"
                      aria-pressed={on}
                      onClick={() => onLocation(l.id)}
                      className={`flex min-h-[64px] flex-col justify-center rounded-md border-2 px-4 py-2 text-left transition-transform duration-200 active:scale-[0.98] ${
                        on ? "-translate-y-0.5 border-brine bg-brine text-salt shadow-[var(--shadow-paper)]" : "border-brine/25 hover:border-brine"
                      }`}
                    >
                      <span className="font-display text-lg leading-tight font-bold">{l.neighborhood}</span>
                      <span className={`text-sm ${on ? "text-salt/80" : "text-muted"}`}>{l.tables} tables</span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <fieldset className="mt-8" disabled={!loc}>
              <legend className="eyebrow">Table</legend>
              {!loc ? (
                <p className="mt-3 rounded-md border-2 border-dashed border-brine/25 px-4 py-6 text-center text-muted">Pick a room to see its tables.</p>
              ) : (
                <div className="mt-3 grid grid-cols-6 gap-2 sm:grid-cols-8">
                  {Array.from({ length: loc.tables }, (_, i) => i + 1).map((n) => {
                    const on = table === n;
                    return (
                      <button
                        key={n}
                        type="button"
                        aria-pressed={on}
                        aria-label={`Table ${n}`}
                        onClick={() => onTable(n)}
                        className={`flex aspect-square min-h-11 items-center justify-center rounded-md font-display text-lg font-bold tabular-nums transition-[transform,background-color] duration-200 active:scale-90 ${
                          on ? "bg-tomato text-salt shadow-[var(--shadow-paper)]" : "bg-salt-deep hover:bg-brine hover:text-salt"
                        }`}
                      >
                        {n}
                      </button>
                    );
                  })}
                </div>
              )}
            </fieldset>

            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
              <button type="button" className="btn" disabled={!ready} onClick={onStart}>
                <span className="btn-face">{ready ? `Start ordering at table ${table}` : "Start ordering"}</span>
              </button>
              {!ready && <p className="text-sm text-muted">{!loc ? "Choose a room first." : "Now choose your table."}</p>}
            </div>
          </div>
        ) : (
          <div className="relative mx-auto w-full max-w-sm" aria-hidden="true">
            <div className="ticket rotate-[-3deg] p-6 text-center">
              <p className="eyebrow text-muted">Scanned code</p>
              <p className="mt-2 font-display text-[4.5rem] leading-none font-extrabold tracking-[-0.05em] text-tomato">{scanned?.table}</p>
              <p className="mt-1 font-display text-xl font-bold">{locationById(scanned?.loc)?.room}</p>
            </div>
            <Piece id="shell" className="absolute -right-6 -bottom-10 w-28 rotate-12" />
          </div>
        )}
      </div>
    </section>
  );
}

/* ---------------- Step 2: menu ---------------- */

function MenuStep({
  headingRef,
  locName,
  table,
  cart,
  lines,
  count,
  subtotal,
  onAdd,
  onRemove,
  onChangeTable,
  onReview,
}: {
  headingRef: HeadingRef;
  locName: string;
  table: number;
  cart: Cart;
  lines: Line[];
  count: number;
  subtotal: number;
  onAdd: (i: MenuItem) => void;
  onRemove: (i: MenuItem) => void;
  onChangeTable: () => void;
  onReview: () => void;
}) {
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState(menu[0].id);
  const [sheet, setSheet] = useState(false);
  const reduce = useReducedMotion();

  // Simulate fetching tonight's menu for this room
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 650);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!sheet) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSheet(false);
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [sheet]);

  const section = menu.find((s) => s.id === cat)!;

  return (
    <section className="mt-10" aria-labelledby="step-title">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-muted">
            {locName} · Table {table}{" "}
            <button type="button" onClick={onChangeTable} className="ml-1 min-h-11 font-bold tracking-normal text-brine normal-case underline underline-offset-2">
              Change
            </button>
          </p>
          <h1 id="step-title" ref={headingRef} tabIndex={-1} className="mt-1 text-[clamp(2.75rem,5vw+1rem,5.5rem)] leading-[0.9] outline-none">
            What are we having?
          </h1>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <div className="sticky top-[72px] z-20 -mx-4 bg-salt px-4 py-2 sm:mx-0 sm:px-0">
            <div className="flex gap-1.5 overflow-x-auto [scrollbar-width:none]" role="tablist" aria-label="Menu sections">
              {menu.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  role="tab"
                  aria-selected={cat === s.id}
                  aria-controls="order-items"
                  onClick={() => setCat(s.id)}
                  className={`min-h-11 shrink-0 rounded-full px-4 font-semibold whitespace-nowrap transition-colors duration-200 ${
                    cat === s.id ? "bg-brine text-salt" : "ring-2 ring-brine/20 ring-inset hover:ring-brine"
                  }`}
                >
                  {s.title}
                </button>
              ))}
            </div>
          </div>

          <div id="order-items" role="tabpanel" aria-label={section.title} aria-busy={loading} className="mt-4">
            {loading ? (
              <ul className="grid gap-3" aria-hidden="true">
                {[0, 1, 2, 3].map((i) => (
                  <li key={i} className="flex animate-pulse items-center justify-between gap-4 rounded-md bg-salt-deep p-5">
                    <div className="flex-1">
                      <div className="h-5 w-1/2 rounded bg-brine/10" />
                      <div className="mt-3 h-4 w-3/4 rounded bg-brine/10" />
                    </div>
                    <div className="h-12 w-12 rounded-full bg-brine/10" />
                  </li>
                ))}
                <p className="sr-only">Loading tonight&rsquo;s menu</p>
              </ul>
            ) : (
              <AnimatePresence mode="wait" initial={false}>
                <motion.ul
                  key={cat}
                  className="grid gap-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25, ease }}
                >
                  {section.items.map((item) => {
                    const qty = cart[item.id] ?? 0;
                    return (
                      <li
                        key={item.id}
                        className={`flex items-center justify-between gap-4 rounded-md p-5 transition-colors duration-200 ${
                          qty ? "bg-brine text-salt" : "bg-salt-deep"
                        } ${item.soldOut ? "opacity-70" : ""}`}
                      >
                        <div className="min-w-0">
                          <p className="font-display text-xl leading-tight font-bold tracking-[-0.02em]">{item.name}</p>
                          <p className={`mt-1 text-[0.9375rem] ${qty ? "text-salt/80" : "text-muted"}`}>{item.description}</p>
                          <p className="mt-2 flex flex-wrap items-center gap-2 text-sm font-bold">
                            <span className="font-display text-lg">{money(item.price)}</span>
                            {item.tags.map((t) => (
                              <span key={t} title={tagLabels[t].long} className="rounded-full border-[1.5px] border-current px-1.5 text-xs">
                                {tagLabels[t].short}
                                <span className="sr-only"> ({tagLabels[t].long})</span>
                              </span>
                            ))}
                          </p>
                        </div>
                        {item.soldOut ? (
                          <span className="shrink-0 rounded-full bg-brine/10 px-3 py-2 text-sm font-bold">Sold out</span>
                        ) : qty ? (
                          <QtyControl qty={qty} name={item.name} onAdd={() => onAdd(item)} onRemove={() => onRemove(item)} dark />
                        ) : (
                          <motion.button
                            type="button"
                            whileTap={reduce ? undefined : { scale: 0.85, rotate: -8 }}
                            onClick={() => onAdd(item)}
                            aria-label={`Add ${item.name}, ${money(item.price)}`}
                            className="flex h-12 min-w-12 shrink-0 items-center justify-center rounded-full bg-tomato px-5 font-display text-lg font-bold text-salt shadow-[var(--shadow-paper)] transition-transform hover:-translate-y-0.5"
                          >
                            Add
                          </motion.button>
                        )}
                      </li>
                    );
                  })}
                </motion.ul>
              </AnimatePresence>
            )}
          </div>
        </div>

        {/* Desktop tray */}
        <aside className="hidden lg:col-span-4 lg:block" aria-label="Your tray">
          <div className="ticket sticky top-[96px] p-6">
            <Tray lines={lines} count={count} subtotal={subtotal} onAdd={onAdd} onRemove={onRemove} onReview={onReview} />
          </div>
        </aside>
      </div>

      {/* Mobile tray bar and sheet */}
      <div className="fixed inset-x-0 bottom-0 z-40 p-3 lg:hidden">
        <motion.button
          type="button"
          onClick={() => setSheet(true)}
          className="flex min-h-14 w-full items-center justify-between rounded-full bg-brine px-6 text-salt shadow-[0_6px_0_rgb(0_0_0/0.2)]"
          aria-haspopup="dialog"
          animate={count && !reduce ? { scale: [1, 1.04, 1] } : undefined}
          key={count}
          transition={{ duration: 0.3 }}
        >
          <span className="font-semibold">{count ? `${count} ${count === 1 ? "item" : "items"} · ${money(subtotal)}` : "Your tray is empty"}</span>
          <span className="font-display font-extrabold">View tray →</span>
        </motion.button>
      </div>
      <AnimatePresence>
        {sheet && (
          <>
            <motion.div className="fixed inset-0 z-50 bg-brine/50 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSheet(false)} />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Your tray"
              className="fixed inset-x-0 bottom-0 z-50 max-h-[85svh] overflow-y-auto rounded-t-[24px] bg-salt p-6 pb-8 lg:hidden"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.4, ease }}
            >
              <div className="mb-4 flex justify-end">
                <button type="button" autoFocus onClick={() => setSheet(false)} className="flex min-h-11 items-center rounded-full px-4 font-bold ring-2 ring-brine">
                  Close
                </button>
              </div>
              <Tray
                lines={lines}
                count={count}
                subtotal={subtotal}
                onAdd={onAdd}
                onRemove={onRemove}
                onReview={() => {
                  setSheet(false);
                  onReview();
                }}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}

function QtyControl({ qty, name, onAdd, onRemove, dark }: { qty: number; name: string; onAdd: () => void; onRemove: () => void; dark?: boolean }) {
  const ring = dark ? "ring-salt" : "ring-brine";
  return (
    <div className="flex shrink-0 items-center gap-1" role="group" aria-label={`${name} quantity`}>
      <button type="button" onClick={onRemove} aria-label={`Remove one ${name}`} className={`flex h-11 w-11 items-center justify-center rounded-full text-xl font-bold ring-2 ${ring} ring-inset transition-transform active:scale-90`}>
        −
      </button>
      <motion.span key={qty} initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-8 text-center font-display text-xl font-extrabold tabular-nums" aria-live="off">
        {qty}
      </motion.span>
      <button type="button" onClick={onAdd} aria-label={`Add one ${name}`} disabled={qty >= 20} className={`flex h-11 w-11 items-center justify-center rounded-full text-xl font-bold ring-2 ${ring} ring-inset transition-transform active:scale-90 disabled:opacity-40`}>
        +
      </button>
    </div>
  );
}

function Tray({ lines, count, subtotal, onAdd, onRemove, onReview }: { lines: Line[]; count: number; subtotal: number; onAdd: (i: MenuItem) => void; onRemove: (i: MenuItem) => void; onReview: () => void }) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <h2 className="text-3xl">Your tray</h2>
        <p className="font-semibold text-muted">
          {count} {count === 1 ? "item" : "items"}
        </p>
      </div>
      {lines.length === 0 ? (
        <div className="mt-6 rounded-md border-2 border-dashed border-brine/25 px-5 py-8 text-center">
          <Piece id="shell" className="mx-auto w-20 rotate-[-8deg]" />
          <p className="mt-4 font-display text-xl font-bold">Nothing here yet</p>
          <p className="mt-1 text-muted">Tap + on anything that looks good. You can add more rounds later.</p>
        </div>
      ) : (
        <ul className="mt-5 divide-y-2 divide-brine/10">
          <AnimatePresence initial={false}>
            {lines.map(({ item, qty }) => (
              <motion.li key={item.id} layout initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.25, ease }} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="leading-tight font-semibold">{item.name}</p>
                  <p className="text-sm text-muted">
                    {qty} × {money(item.price)} = {money(item.price * qty)}
                  </p>
                </div>
                <QtyControl qty={qty} name={item.name} onAdd={() => onAdd(item)} onRemove={() => onRemove(item)} />
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
      <div className="mt-5 flex items-baseline justify-between border-t-2 border-brine pt-4">
        <span className="font-semibold">Subtotal</span>
        <span className="font-display text-2xl font-extrabold tabular-nums">{money(subtotal)}</span>
      </div>
      <button type="button" className="btn mt-5 w-full" disabled={count === 0} onClick={onReview}>
        <span className="btn-face">Review order</span>
      </button>
    </div>
  );
}

/* ---------------- Step 3: review ---------------- */

function ReviewStep({
  headingRef,
  locName,
  table,
  lines,
  subtotal,
  notes,
  onNotes,
  onAdd,
  onRemove,
  onBack,
  onSent,
}: {
  headingRef: HeadingRef;
  locName: string;
  table: number;
  lines: Line[];
  subtotal: number;
  notes: string;
  onNotes: (s: string) => void;
  onAdd: (i: MenuItem) => void;
  onRemove: (i: MenuItem) => void;
  onBack: () => void;
  onSent: () => void;
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const tax = subtotal * TAX;

  async function send() {
    setStatus("sending");
    await new Promise((r) => setTimeout(r, 1400));
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      setStatus("error");
      return;
    }
    onSent();
  }

  return (
    <section className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12" aria-labelledby="step-title">
      <div className="lg:col-span-7">
        <p className="eyebrow text-muted">
          {locName} · Table {table}
        </p>
        <h1 id="step-title" ref={headingRef} tabIndex={-1} className="mt-1 text-[clamp(2.75rem,5vw+1rem,5.5rem)] leading-[0.9] outline-none">
          Check your order
        </h1>

        {lines.length === 0 ? (
          <div className="mt-8 rounded-md border-2 border-dashed border-brine/25 px-5 py-10 text-center">
            <p className="font-display text-2xl font-bold">Your tray is empty</p>
            <p className="mt-1 text-muted">Everything was removed. Head back to the menu to add something.</p>
            <button type="button" className="btn btn-brine mt-6" onClick={onBack}>
              <span className="btn-face">Back to the menu</span>
            </button>
          </div>
        ) : (
          <ul className="mt-8 divide-y-2 divide-brine/10 border-y-2 border-brine">
            <AnimatePresence initial={false}>
              {lines.map(({ item, qty }) => (
                <motion.li key={item.id} layout exit={{ opacity: 0, x: -20 }} className="flex items-center justify-between gap-4 py-4">
                  <div className="min-w-0">
                    <p className="font-display text-xl leading-tight font-bold">{item.name}</p>
                    <p className="text-muted">
                      {qty} × {money(item.price)} = {money(item.price * qty)}
                    </p>
                  </div>
                  <QtyControl qty={qty} name={item.name} onAdd={() => onAdd(item)} onRemove={() => onRemove(item)} />
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}

        <label htmlFor="order-notes" className="eyebrow mt-8 flex items-baseline gap-2">
          Notes for the kitchen <span className="text-xs font-semibold tracking-normal text-muted normal-case">optional</span>
        </label>
        <textarea
          id="order-notes"
          rows={3}
          maxLength={200}
          value={notes}
          onChange={(e) => onNotes(e.target.value)}
          placeholder="Allergies, no shellfish for one guest, bring the fries first"
          className="input mt-2 min-h-[96px] resize-y py-3 placeholder:text-muted"
        />
      </div>

      <div className="lg:col-span-5">
        <div className="ticket p-6 sm:p-8 lg:sticky lg:top-[96px]">
          <dl className="grid gap-2">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd className="tabular-nums">{money(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>NYC sales tax (8.875%)</dt>
              <dd className="tabular-nums">${tax.toFixed(2)}</dd>
            </div>
            <div className="mt-2 flex items-baseline justify-between border-t-2 border-brine pt-3">
              <dt className="font-bold">Total so far</dt>
              <dd className="font-display text-3xl font-extrabold tabular-nums">${(subtotal + tax).toFixed(2)}</dd>
            </div>
          </dl>
          <p className="mt-4 text-[0.9375rem] text-muted">Nothing to pay now. You settle up at the table when you&rsquo;re done, tip included there.</p>

          <AnimatePresence>
            {status === "error" && (
              <motion.div role="alert" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-5 rounded-md border-2 border-error bg-error/5 p-4">
                <p className="font-bold text-error">We couldn&rsquo;t reach the kitchen.</p>
                <p className="mt-1 text-[0.9375rem]">Your tray is saved. Check your connection and send it again, or ask your server.</p>
              </motion.div>
            )}
          </AnimatePresence>

          <button type="button" className="btn mt-6 w-full" disabled={status === "sending" || lines.length === 0} onClick={send}>
            <span className="btn-face">
              {status === "sending" && <span className="h-4 w-4 animate-spin rounded-full border-[3px] border-salt/40 border-t-salt" aria-hidden="true" />}
              {status === "sending" ? "Sending to the kitchen" : status === "error" ? "Try sending again" : "Send to the kitchen"}
            </span>
          </button>
          <button type="button" onClick={onBack} className="ulink mt-3 w-full justify-center">
            Add something else
          </button>
          <p className="sr-only" aria-live="polite">
            {status === "sending" ? "Sending your order" : ""}
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Step 4: sent ---------------- */

function SentStep({ headingRef, orderNo, locName, table, lines, total, onMore }: { headingRef: HeadingRef; orderNo: string; locName: string; table: number; lines: Line[]; total: number; onMore: () => void }) {
  return (
    <section className="mt-10 grid grid-cols-1 items-start gap-12 lg:grid-cols-12" aria-labelledby="step-title">
      <div className="lg:col-span-7">
        <motion.div
          className="flex h-20 w-20 items-center justify-center rounded-full bg-tomato text-salt shadow-[var(--shadow-paper-lg)]"
          initial={{ scale: 0.2, rotate: -60 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 240, damping: 13 }}
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24" className="h-10 w-10">
            <path d="M5 12.5 10 17.5 19 7" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
        <p className="eyebrow mt-8 text-muted">Order confirmed (demo)</p>
        <h1 id="step-title" ref={headingRef} tabIndex={-1} className="mt-3 text-[clamp(3rem,6vw+1rem,6.5rem)] leading-[0.9] outline-none">
          It&rsquo;s on the rail.
        </h1>
        <p className="mt-5 max-w-lg text-lead">
          In the live version, the kitchen at {locName} gets this ticket for table {table}. Most plates land in 10 to 15 minutes.
        </p>
        <p className="mt-4 inline-flex rounded-full bg-lemon px-3.5 py-1.5 font-bold">Demo: nothing is sent</p>
        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
          <button type="button" className="btn" onClick={onMore}>
            <span className="btn-face">Order another round</span>
          </button>
          <Link href="/" className="ulink">
            Back to Saltline <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>

      <motion.div className="lg:col-span-5" initial={{ opacity: 0, y: 30, rotate: 4 }} animate={{ opacity: 1, y: 0, rotate: -2 }} transition={{ delay: 0.15, duration: 0.6, ease }}>
        <div className="ticket relative mx-auto max-w-sm overflow-hidden p-6 tabular-nums">
          <p className="flex justify-between text-sm font-bold">
            <span>{orderNo}</span>
            <span>Table {table}</span>
          </p>
          <p className="mt-1 text-sm text-muted">{locName}</p>
          <ul className="mt-4 grid gap-1.5 border-y-2 border-dashed border-brine/30 py-4">
            {lines.map(({ item, qty }) => (
              <li key={item.id} className="flex justify-between gap-3">
                <span>
                  {qty} × {item.name}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 flex justify-between font-bold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </p>
        </div>
      </motion.div>
    </section>
  );
}
