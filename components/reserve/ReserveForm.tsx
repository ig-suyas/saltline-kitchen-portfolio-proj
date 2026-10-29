"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useId, useRef, useState, useSyncExternalStore, type FormEvent, type ReactNode } from "react";
import { locationById, locations, partyLimitFor, partyLimits, type LocationId } from "@/lib/locations";
import { useQueryParam } from "@/lib/useQueryParam";

const noop = () => () => {};

type Values = {
  location: LocationId | "";
  date: string;
  time: string;
  party: number;
  name: string;
  email: string;
  phone: string;
  occasion: string;
  notes: string;
};
type Field = keyof Values;
type Errors = Partial<Record<Field, string>>;

const roomCode: Record<LocationId, string> = { "red-hook": "RH", greenpoint: "GP", "carroll-gardens": "CG" };
/** Made-up booking reference for the demo success screen */
const demoReference = (room: LocationId) => `SL-${roomCode[room]}-${Math.floor(1000 + Math.random() * 9000)}`;
const dayNames = ["Sundays", "Mondays", "Tuesdays", "Wednesdays", "Thursdays", "Fridays", "Saturdays"];

function slotsFor(location: LocationId | "") {
  const [start, end] = location === "greenpoint" ? [12, 21] : [17, 21.5];
  const out: string[] = [];
  for (let t = start; t <= end; t += 0.5) {
    const h = Math.floor(t);
    const m = t % 1 ? "30" : "00";
    const h12 = h > 12 ? h - 12 : h;
    out.push(`${h12}:${m} ${h >= 12 ? "PM" : "AM"}`);
  }
  return out;
}

const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const parseDate = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};
const prettyDate = (s: string) => parseDate(s).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

function validate(v: Values, today: string): Errors {
  const e: Errors = {};
  if (!v.location) e.location = "Choose one of the three rooms.";
  if (!v.date) e.date = "Pick a date.";
  else if (today) {
    const d = parseDate(v.date);
    const t = parseDate(today);
    const limit = new Date(t);
    limit.setDate(limit.getDate() + 30);
    if (d < t) e.date = "That date has already passed.";
    else if (d > limit) e.date = "We take bookings up to 30 days out.";
    else if (v.location) {
      const loc = locationById(v.location)!;
      if (loc.closedDays.includes(d.getDay())) e.date = `${loc.neighborhood} is closed on ${dayNames[d.getDay()]}. Try another day or another room.`;
    }
  }
  if (!v.time) e.time = "Pick a time.";
  else if (v.location && !slotsFor(v.location).includes(v.time)) e.time = "That time isn't available at this room.";
  if (v.party > partyLimitFor(v.location)) {
    e.party = `Parties over ${partyLimitFor(v.location)}: call the restaurant (demo).`;
  }
  if (v.name.trim().length < 2) e.name = "Enter the name for the booking.";
  if (!v.email.trim()) e.email = "Enter an email for the confirmation.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = "That email doesn't look right. Check for a typo.";
  if (v.phone.trim() && v.phone.replace(/\D/g, "").replace(/^1/, "").length !== 10) e.phone = "Use a 10-digit US number, or leave it blank.";
  return e;
}

const fieldOrder: Field[] = ["location", "date", "time", "party", "name", "email", "phone"];

export function ReserveForm() {
  const preset = locationById(useQueryParam("location"))?.id ?? "";
  const uid = useId();
  const [state, setValues] = useState<Values>({ location: "", date: "", time: "", party: 2, name: "", email: "", phone: "", occasion: "", notes: "" });
  // A ?location= preset applies until the guest picks a room themselves
  const room = state.location || preset;
  const maxGuests = partyLimitFor(room);
  const values: Values = { ...state, location: room, party: Math.min(state.party, maxGuests) };
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [reference, setReference] = useState("");
  const summaryRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);

  // Local date on the client, empty during prerender
  const today = useSyncExternalStore(noop, () => iso(new Date()), () => "");

  const errors = validate(values, today);
  const shown = (f: Field) => (submitted || touched[f] ? errors[f] : undefined);
  const set = <K extends Field>(k: K, v: Values[K]) => setValues((s) => ({ ...s, [k]: v }));
  const blur = (f: Field) => setTouched((t) => ({ ...t, [f]: true }));
  const id = (f: string) => `${uid}-${f}`;

  const maxDate = today
    ? (() => {
        const d = parseDate(today);
        d.setDate(d.getDate() + 30);
        return iso(d);
      })()
    : undefined;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    const errs = validate(values, today);
    if (Object.keys(errs).length) {
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    setStatus("loading");
    await new Promise((r) => setTimeout(r, 1300));
    setReference(demoReference(values.location as LocationId));
    setStatus("done");
  }

  function reset() {
    setValues({ location: values.location, date: "", time: "", party: Math.min(2, maxGuests), name: "", email: "", phone: "", occasion: "", notes: "" });
    setTouched({});
    setSubmitted(false);
    setStatus("idle");
  }

  const errorList = fieldOrder.filter((f) => errors[f]);
  const loc = locationById(values.location);

  return (
    <div className="ticket relative px-5 py-7 sm:px-9 sm:py-10">
      <p className="absolute -top-4 right-5 rotate-2 rounded-full bg-lemon px-3.5 py-1.5 text-sm font-bold text-brine shadow-[var(--shadow-paper)]">Demo: no booking is made</p>

      <AnimatePresence mode="wait" initial={false}>
        {status === "done" && loc ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            onAnimationComplete={() => successRef.current?.focus()}
          >
            <motion.div
              className="flex h-16 w-16 items-center justify-center rounded-full bg-tomato text-salt"
              initial={{ scale: 0.3, rotate: -40 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 14 }}
              aria-hidden="true"
            >
              <svg viewBox="0 0 24 24" className="h-8 w-8">
                <path d="M5 12.5 10 17.5 19 7" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.div>
            <h2 ref={successRef} tabIndex={-1} className="mt-6 text-[clamp(2.25rem,4vw,3.5rem)] leading-[0.95] outline-none">
              You&rsquo;re booked, {values.name.trim().split(" ")[0]}.
            </h2>
            <p className="mt-3 text-muted">This is a front-end demo, so nothing was sent and no table is held. In the real build, a confirmation email goes to {values.email.trim()}.</p>
            <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-y-2 border-brine/15 py-6">
              <div className="col-span-2 rounded-md bg-lemon px-4 py-3">
                <dt className="eyebrow">Demo booking reference</dt>
                <dd className="mt-1 font-display text-2xl font-extrabold tracking-[0.02em] tabular-nums">{reference}</dd>
                <dd className="text-sm">Not a real booking. Nothing was sent and no table is held.</dd>
              </div>
              <div>
                <dt className="eyebrow text-muted">Room</dt>
                <dd className="mt-1 font-display text-xl font-bold">{loc.neighborhood}</dd>
              </div>
              <div>
                <dt className="eyebrow text-muted">Guests</dt>
                <dd className="mt-1 font-display text-xl font-bold">{values.party}</dd>
              </div>
              <div>
                <dt className="eyebrow text-muted">Date</dt>
                <dd className="mt-1 font-display text-xl font-bold">{prettyDate(values.date)}</dd>
              </div>
              <div>
                <dt className="eyebrow text-muted">Time</dt>
                <dd className="mt-1 font-display text-xl font-bold">{values.time}</dd>
              </div>
            </dl>
            <p className="mt-6 text-muted">
              {loc.address}, {loc.cityLine}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <button type="button" className="btn" onClick={reset}>
                <span className="btn-face">Book another table</span>
              </button>
              <Link href="/menu" className="ulink">
                Look at the menu <span aria-hidden="true">→</span>
              </Link>
            </div>
          </motion.div>
        ) : (
          <motion.form key="form" noValidate onSubmit={onSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} aria-busy={status === "loading"}>
            {submitted && errorList.length > 0 && (
              <div ref={summaryRef} tabIndex={-1} role="alert" className="mb-8 rounded-md border-2 border-error bg-error/5 p-4 outline-none">
                <p className="font-bold text-error">
                  {errorList.length === 1 ? "One thing to fix" : `${errorList.length} things to fix`} before we can hold a table:
                </p>
                <ul className="mt-2 list-disc pl-5">
                  {errorList.map((f) => (
                    <li key={f}>
                      <a href={`#${id(f)}`} className="underline underline-offset-2" onClick={(e) => { e.preventDefault(); document.getElementById(id(f))?.focus(); }}>
                        {errors[f]}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <p className="mb-6 text-sm text-muted">
              Fields marked <Req /> are required.
            </p>

            <fieldset>
              <legend className="eyebrow">
                Room <Req />
              </legend>
              <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-3" role="radiogroup" aria-describedby={shown("location") ? id("location-err") : undefined}>
                {locations.map((l, i) => {
                  const checked = values.location === l.id;
                  return (
                    <label
                      key={l.id}
                      className={`relative flex min-h-[72px] cursor-pointer flex-col justify-center rounded-md border-2 px-4 py-3 transition-[transform,background-color] duration-200 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brine ${
                        checked ? "-translate-y-0.5 border-brine bg-brine text-salt shadow-[var(--shadow-paper)]" : "border-brine/25 hover:border-brine"
                      }`}
                    >
                      <input
                        type="radio"
                        name="location"
                        value={l.id}
                        id={i === 0 ? id("location") : undefined}
                        checked={checked}
                        onChange={() => {
                          // Changing room resets the time and pulls the party size down to that room's limit
                          setValues((s) => ({ ...s, location: l.id, time: "", party: Math.min(s.party, partyLimits[l.id]) }));
                        }}
                        onBlur={() => blur("location")}
                        className="sr-only"
                      />
                      <span className="font-display text-lg leading-tight font-bold">{l.neighborhood}</span>
                      <span className={`text-sm ${checked ? "text-salt/80" : "text-muted"}`}>{l.room}</span>
                    </label>
                  );
                })}
              </div>
              <ErrorText id={id("location-err")} msg={shown("location")} />
            </fieldset>

            <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Control label="Date" required htmlFor={id("date")} error={shown("date")} errId={id("date-err")}>
                <input
                  id={id("date")}
                  type="date"
                  min={today || undefined}
                  max={maxDate}
                  value={values.date}
                  onChange={(e) => set("date", e.target.value)}
                  onBlur={() => blur("date")}
                  aria-invalid={!!shown("date")}
                  aria-describedby={shown("date") ? id("date-err") : undefined}
                  className="input"
                  required
                />
              </Control>
              <Control label="Time" required htmlFor={id("time")} error={shown("time")} errId={id("time-err")}>
                <select
                  id={id("time")}
                  value={values.time}
                  onChange={(e) => set("time", e.target.value)}
                  onBlur={() => blur("time")}
                  aria-invalid={!!shown("time")}
                  aria-describedby={shown("time") ? id("time-err") : undefined}
                  className="input"
                  disabled={!values.location}
                  required
                >
                  <option value="">{values.location ? "Choose a time" : "Choose a room first"}</option>
                  {slotsFor(values.location).map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </Control>
            </div>

            <div className="mt-6">
              <p className="eyebrow" id={id("party-label")}>
                Guests
              </p>
              <div className="mt-2 flex items-center gap-3" role="group" aria-labelledby={id("party-label")} aria-describedby={id("party-hint")}>
                <button type="button" className="stepper" aria-label="One fewer guest" disabled={values.party <= 1} onClick={() => set("party", values.party - 1)}>
                  −
                </button>
                <output id={id("party")} tabIndex={-1} className="w-14 text-center font-display text-3xl font-extrabold tabular-nums outline-none" aria-live="polite">
                  {values.party}
                </output>
                <button type="button" className="stepper" aria-label="One more guest" disabled={values.party >= maxGuests} onClick={() => set("party", Math.min(values.party + 1, maxGuests))}>
                  +
                </button>
              </div>
              <p id={id("party-hint")} className="mt-2 text-sm text-muted">
                {loc ? `Up to ${maxGuests} online at ${loc.neighborhood}. ` : `Up to ${maxGuests} online until you pick a room. `}
                Parties over {maxGuests}: call the restaurant (demo).
              </p>
              <ErrorText id={id("party-err")} msg={errors.party} />
            </div>

            <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Control label="Name" required htmlFor={id("name")} error={shown("name")} errId={id("name-err")}>
                <input id={id("name")} autoComplete="name" value={values.name} onChange={(e) => set("name", e.target.value)} onBlur={() => blur("name")} aria-invalid={!!shown("name")} aria-describedby={shown("name") ? id("name-err") : undefined} className="input" required />
              </Control>
              <Control label="Email" required htmlFor={id("email")} error={shown("email")} errId={id("email-err")}>
                <input id={id("email")} type="email" autoComplete="email" inputMode="email" value={values.email} onChange={(e) => set("email", e.target.value)} onBlur={() => blur("email")} aria-invalid={!!shown("email")} aria-describedby={shown("email") ? id("email-err") : undefined} className="input" required />
              </Control>
              <Control label="Phone" optional htmlFor={id("phone")} error={shown("phone")} errId={id("phone-err")}>
                <input id={id("phone")} type="tel" autoComplete="tel-national" inputMode="tel" value={values.phone} onChange={(e) => set("phone", e.target.value)} onBlur={() => blur("phone")} aria-invalid={!!shown("phone")} aria-describedby={shown("phone") ? id("phone-err") : undefined} className="input" />
              </Control>
              <Control label="Occasion" optional htmlFor={id("occasion")}>
                <select id={id("occasion")} value={values.occasion} onChange={(e) => set("occasion", e.target.value)} className="input">
                  <option value="">None</option>
                  <option>Birthday</option>
                  <option>Anniversary</option>
                  <option>Date night</option>
                  <option>Business dinner</option>
                </select>
              </Control>
            </div>

            <div className="mt-5">
              <Control label="Notes for the kitchen" optional htmlFor={id("notes")}>
                <textarea id={id("notes")} rows={3} maxLength={300} value={values.notes} onChange={(e) => set("notes", e.target.value)} className="input min-h-[96px] resize-y py-3" aria-describedby={id("notes-count")} />
              </Control>
              <p id={id("notes-count")} className="mt-1 text-right text-sm text-muted">
                {values.notes.length}/300 · allergies, high chair, step-free seating
              </p>
            </div>

            <p className="mt-8 rounded-md bg-lemon px-4 py-3 font-semibold">Demo: no booking is made. Nothing is sent and no table is held.</p>
            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
              <button type="submit" className="btn" disabled={status === "loading"}>
                <span className="btn-face">
                  {status === "loading" && <span className="h-4 w-4 animate-spin rounded-full border-[3px] border-salt/40 border-t-salt" aria-hidden="true" />}
                  {status === "loading" ? "Holding your table" : "Request this table"}
                </span>
              </button>
            </div>
            <p className="sr-only" aria-live="polite">
              {status === "loading" ? "Sending your request" : ""}
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Required marker: a visible asterisk, read out as "required" */
function Req() {
  return (
    <>
      <span aria-hidden="true" className="font-bold text-error">
        *
      </span>
      <span className="sr-only">required</span>
    </>
  );
}

function Control({
  label,
  htmlFor,
  error,
  errId,
  optional,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  errId?: string;
  optional?: boolean;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="eyebrow flex items-baseline gap-1.5">
        {label}
        {required && <Req />}
        {optional && <span className="ml-1 text-xs font-semibold tracking-normal text-muted normal-case">optional</span>}
      </label>
      <div className="mt-2">{children}</div>
      {errId && <ErrorText id={errId} msg={error} />}
    </div>
  );
}

function ErrorText({ id, msg }: { id: string; msg?: string }) {
  return (
    <AnimatePresence initial={false}>
      {msg && (
        <motion.p id={id} className="mt-2 flex items-start gap-1.5 text-[0.9375rem] font-semibold text-error" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
          <svg viewBox="0 0 16 16" className="mt-1 h-3.5 w-3.5 shrink-0" aria-hidden="true">
            <circle cx="8" cy="8" r="7" fill="currentColor" />
            <path d="M8 4.5v4.2M8 11v.3" stroke="#F6F1E7" strokeWidth="2" strokeLinecap="round" />
          </svg>
          {msg}
        </motion.p>
      )}
    </AnimatePresence>
  );
}
