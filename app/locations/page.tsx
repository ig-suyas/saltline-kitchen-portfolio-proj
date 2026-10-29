import type { Metadata } from "next";
import Link from "next/link";
import { Dish, Piece, type PieceId } from "@/components/Art";
import { BrooklynMap } from "@/components/locations/BrooklynMap";
import { Parallax } from "@/components/Parallax";
import { SplitWords } from "@/components/SplitWords";
import { HOURS_NOTE, locations } from "@/lib/locations";

export const metadata: Metadata = {
  title: "Locations",
  description: "Saltline Kitchen in Red Hook, Greenpoint and Carroll Gardens: addresses, hours and what each room is good for (concept).",
  alternates: { canonical: "/locations" },
};

const looks = [
  { bg: "bg-salt", piece: "lemon" as PieceId },
  { bg: "bg-lemon", piece: "shell" as PieceId },
  { bg: "bg-salt-deep", piece: "bread" as PieceId },
];

export default function LocationsPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-10 pb-20 md:pt-16 md:pb-28" aria-labelledby="loc-title">
        <div className="wrap grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="eyebrow fade-in text-muted">Brooklyn, New York</p>
            <SplitWords as="h1" id="loc-title" trigger="load" delay={120} text="Three rooms across Brooklyn" accent={[3]} className="mt-4 max-w-[10ch] text-[clamp(3.25rem,7vw+1rem,8rem)] leading-[0.88]" />
            <p className="fade-in mt-8 max-w-lg text-lead" style={{ ["--d" as string]: "500ms" }}>
              Each room has its own shape and its own reason to visit. The fish, the grill and the people running it are the same.
            </p>
            <ul className="fade-in mt-8 flex flex-wrap gap-2" style={{ ["--d" as string]: "600ms" }}>
              {locations.map((l, i) => (
                <li key={l.id}>
                  <a href={`#${l.id}`} className="flex min-h-11 items-center gap-2 rounded-full border-2 border-brine px-4 font-semibold transition-colors hover:bg-brine hover:text-salt">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-tomato text-sm font-extrabold text-salt">{i + 1}</span>
                    {l.neighborhood}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative lg:col-span-6">
            <Parallax speed={-60}>
              <div className="paper-drop rotate-[2deg]" style={{ ["--r0" as string]: "-8deg", ["--d" as string]: "250ms" }}>
                <BrooklynMap className="h-auto w-full rounded-[10px] shadow-[var(--shadow-paper-lg)]" />
              </div>
            </Parallax>
            <Parallax speed={-220} rotate={30} className="absolute -top-8 -right-2 w-[22%]" >
              <Piece id="tomato" className="h-auto w-full" />
            </Parallax>
            <p className="mt-4 text-sm text-muted">Map is illustrative and not to scale.</p>
          </div>
        </div>
      </section>

      {locations.map((l, i) => {
        const look = looks[i];
        const flip = i % 2 === 1;
        return (
          <section key={l.id} id={l.id} className={`relative scroll-mt-[72px] overflow-hidden py-20 md:py-32 ${look.bg}`} aria-labelledby={`${l.id}-title`}>
            <div className="wrap grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
              <div className={`lg:col-span-7 ${flip ? "lg:order-2 lg:col-start-6" : ""}`}>
                <p className="eyebrow">
                  0{i + 1} · {l.room}
                </p>
                <SplitWords text={l.neighborhood} id={`${l.id}-title`} className="mt-3 text-[clamp(3.25rem,8vw,8.5rem)] leading-[0.86]" />
                <p className="mt-3 font-display text-2xl font-bold tracking-[-0.02em]">{l.kind}</p>
                <p className="mt-6 max-w-[60ch] text-lead">{l.intro}</p>

                <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2">
                  <div>
                    <h3 className="eyebrow">Address</h3>
                    <p className="mt-2">
                      {l.address}
                      <br />
                      {l.cityLine}
                    </p>
                    <h3 className="eyebrow mt-6">Phone</h3>
                    <p className="mt-2">{l.phone}</p>
                  </div>
                  <div>
                    <h3 className="eyebrow">Hours</h3>
                    <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
                      {l.hours.map((h) => (
                        <div key={h.days} className="contents">
                          <dt className="font-semibold">{h.days}</dt>
                          <dd>{h.time}</dd>
                        </div>
                      ))}
                    </dl>
                    <p className="mt-2 text-sm text-muted">{HOURS_NOTE}</p>
                  </div>
                </div>

                <h3 className="eyebrow mt-8">Good to know</h3>
                <ul className="mt-3 grid gap-2">
                  {l.notes.map((n) => (
                    <li key={n} className="flex gap-3">
                      <span aria-hidden="true" className="mt-[0.55em] h-2 w-2 shrink-0 rotate-45 bg-tomato" />
                      {n}
                    </li>
                  ))}
                </ul>

                <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
                  <Link href={`/reserve?location=${l.id}`} className={`btn ${i === 1 ? "btn-brine" : ""}`}>
                    <span className="btn-face">Book {l.neighborhood}</span>
                  </Link>
                  <Link href={`/order?location=${l.id}&table=7`} className="ulink">
                    Table ordering demo <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>

              <div className={`relative lg:col-span-5 ${flip ? "lg:order-1 lg:col-start-1" : ""}`}>
                <Parallax speed={-140} rotate={flip ? -20 : 20}>
                  <Dish id={l.dish} decorative className="mx-auto h-auto w-[86%] lg:w-full" />
                </Parallax>
                <Parallax speed={-320} rotate={flip ? 40 : -40} className={`absolute top-[-4%] w-[30%] ${flip ? "right-[-2%]" : "left-[-4%]"}`}>
                  <Piece id={look.piece} className="h-auto w-full" />
                </Parallax>
                <div className="ticket relative z-10 mx-auto -mt-10 w-fit -rotate-3 px-5 py-3 text-center">
                  <p className="font-display text-xl font-extrabold tracking-[-0.03em]">{l.seats} seats</p>
                  <p className="text-sm text-muted">{l.tables} tables with order-at-table codes</p>
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}
