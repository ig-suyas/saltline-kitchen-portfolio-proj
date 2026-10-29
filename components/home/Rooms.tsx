import Link from "next/link";
import { Piece, type PieceId } from "@/components/Art";
import { Parallax } from "@/components/Parallax";
import { SplitWords } from "@/components/SplitWords";
import { HOURS_NOTE, locations, weekdayHours, weekendHours } from "@/lib/locations";

const rowPieces: PieceId[] = ["shell", "bread", "tomato"];

export function Rooms() {
  return (
    <section className="grain relative overflow-hidden py-24 md:py-36" aria-labelledby="rooms-title">
      <Parallax speed={-220} rotate={30} className="pointer-events-none absolute top-16 right-[4%] w-[22vw] max-w-[220px] min-w-[110px]">
        <Piece id="lemon" className="h-auto w-full rotate-[-14deg]" />
      </Parallax>

      <div className="wrap">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:items-end">
          <SplitWords text="Three rooms, one oak fire." id="rooms-title" className="text-h2 md:col-span-8" accent={[3, 4]} />
          <p className="max-w-md text-lead text-muted md:col-span-4 md:pb-2">
            The same kitchen and the same suppliers, in three neighborhoods. Pick the room that fits the night.
          </p>
        </div>

        <ul className="mt-14 border-t-2 border-brine md:mt-20">
          {locations.map((l, i) => (
            <li key={l.id} className="border-b-2 border-brine">
              <Link
                href={`/locations#${l.id}`}
                className="group relative isolate grid min-h-[132px] grid-cols-[auto_1fr_auto] items-center gap-x-4 gap-y-2 overflow-hidden py-6 transition-colors duration-300 hover:text-salt focus-visible:text-salt md:grid-cols-12 md:gap-x-6 md:py-8"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-0 -z-10 origin-bottom scale-y-0 bg-brine transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-y-100 group-focus-visible:scale-y-100"
                />
                <span className="self-start pt-2 font-display text-lg font-bold tabular-nums md:col-span-1 md:self-center md:pl-4 md:pt-0">0{i + 1}</span>
                <span className="md:col-span-6">
                  <span className="block font-display text-[clamp(2.5rem,6vw,5.75rem)] leading-[0.9] font-extrabold tracking-[-0.05em]">{l.neighborhood}</span>
                  <span className="sr-only">. </span>
                  <span aria-hidden="true" className="mt-3 block h-[3px] w-12 rounded-full bg-tomato" />
                  <span className="mt-3 block font-semibold">
                    {l.room} · {l.kind}
                  </span>
                  <span className="sr-only">. </span>
                </span>
                <span className="col-span-3 col-start-2 border-t-2 border-current/20 pt-3 text-[0.9375rem] md:col-span-4 md:col-start-auto md:border-t-0 md:border-l-2 md:pt-0 md:pl-6">
                  <span className="block font-semibold">{l.address}</span>
                  <span className="sr-only">. </span>
                  <span className="mt-1 block opacity-80">
                    Weekdays: {weekdayHours(l).days}, {weekdayHours(l).time}
                  </span>
                  <span className="sr-only">. </span>
                  <span className="block opacity-80">Weekend: {weekendHours(l).map((h) => `${h.days}, ${h.time}`).join("; ")}</span>
                </span>
                <span
                  aria-hidden="true"
                  className="col-start-3 row-start-1 flex h-12 w-12 items-center justify-center self-start rounded-full border-2 border-current text-xl transition-transform duration-300 group-hover:-rotate-45 md:col-span-1 md:col-start-auto md:row-start-auto md:self-center md:justify-self-end md:mr-4"
                >
                  →
                </span>
                <Piece
                  id={rowPieces[i]}
                  className="pointer-events-none absolute top-1/2 right-[24%] hidden w-[150px] -translate-y-1/2 scale-50 rotate-[-30deg] opacity-0 transition-[transform,opacity] duration-500 ease-[var(--ease-drop)] group-hover:scale-100 group-hover:rotate-[8deg] group-hover:opacity-100 lg:block"
                />
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-muted">{HOURS_NOTE}. Addresses and phone numbers are placeholders too.</p>
      </div>
    </section>
  );
}
