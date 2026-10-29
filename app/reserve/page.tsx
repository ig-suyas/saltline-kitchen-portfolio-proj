import type { Metadata } from "next";
import { Dish, Piece } from "@/components/Art";
import { Parallax } from "@/components/Parallax";
import { ReserveForm } from "@/components/reserve/ReserveForm";
import { SplitWords } from "@/components/SplitWords";
import { partyLimits } from "@/lib/locations";

export const metadata: Metadata = {
  title: "Reservations",
  description: "Book a table at Saltline Kitchen in Red Hook, Greenpoint or Carroll Gardens. Front-end demo: no booking is made.",
  alternates: { canonical: "/reserve" },
};

const notes = [
  ["Up to 30 days out", "New dates open every morning at 10."],
  ["Walk-ins welcome", "Raw bar and counter seats are kept for walk-ins every night."],
  ["Big groups", `Carroll Gardens seats up to ${partyLimits["carroll-gardens"]} online. For larger parties, call the room.`],
];

export default function ReservePage() {
  return (
    <section className="relative overflow-hidden pt-10 pb-24 md:pt-16 md:pb-32" aria-labelledby="reserve-title">
      <div className="wrap grid grid-cols-1 gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="eyebrow fade-in text-muted">Reservations</p>
          <SplitWords as="h1" id="reserve-title" trigger="load" delay={120} text="Book a table" accent={[2]} className="mt-4 max-w-[8ch] text-[clamp(3.25rem,7vw+1rem,8rem)] leading-[0.88]" />
          <dl className="mt-10 grid gap-6">
            {notes.map(([t, d], i) => (
              <div key={t} className="fade-in border-t-2 border-brine pt-4" style={{ ["--d" as string]: `${400 + i * 90}ms` }}>
                <dt className="font-display text-xl font-bold tracking-[-0.02em]">{t}</dt>
                <dd className="mt-1 text-muted">{d}</dd>
              </div>
            ))}
          </dl>
          <div className="relative mt-12 hidden lg:block" aria-hidden="true">
            <Parallax speed={-120} rotate={-18}>
              <Dish id="cake" decorative className="h-auto w-[78%]" />
            </Parallax>
            <Parallax speed={-260} rotate={30} className="absolute top-[-6%] right-[8%] w-[26%]">
              <Piece id="lemon" className="h-auto w-full" />
            </Parallax>
          </div>
        </div>

        <div className="lg:col-span-7">
          <ReserveForm />
        </div>
      </div>
    </section>
  );
}
