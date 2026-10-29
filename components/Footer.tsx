import Link from "next/link";
import { locations } from "@/lib/locations";
import { ShellMark } from "./Logo";

export function Footer() {
  return (
    <footer className="on-dark relative overflow-hidden bg-brine text-salt">
      <div className="wrap pt-20 pb-10 md:pt-28">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="font-display text-[clamp(3rem,7vw,6.5rem)] leading-[0.85] font-extrabold tracking-[-0.05em]">
              Saltline
              <br />
              Kitchen
            </p>
            <p className="mt-6 max-w-sm text-salt/80">Seafood and vegetables cooked over oak, in three Brooklyn neighborhoods.</p>
          </div>

          <div className="grid grid-cols-1 gap-10 sm:grid-cols-3 md:col-span-7">
            {locations.map((l) => (
              <div key={l.id}>
                <h2 className="font-display text-2xl leading-none font-extrabold tracking-[-0.03em] text-lemon">{l.neighborhood}</h2>
                <p className="mt-3 text-salt/80">
                  {l.address}
                  <br />
                  {l.cityLine}
                </p>
                <p className="mt-2 text-salt/80">{l.phone}</p>
                <Link href={`/locations#${l.id}`} className="ulink mt-1 text-salt">
                  Hours and details
                </Link>
              </div>
            ))}
          </div>
        </div>

        <nav aria-label="Footer" className="mt-16 flex flex-wrap gap-x-8 gap-y-1 border-t border-salt/20 pt-6">
          {[
            ["/", "Home"],
            ["/menu", "Menu"],
            ["/locations", "Locations"],
            ["/reserve", "Reservations"],
            ["/order", "Order at Table"],
          ].map(([href, label]) => (
            <Link key={href} href={href} className="ulink">
              {label}
            </Link>
          ))}
        </nav>

        <div className="mt-8 flex flex-col gap-4 rounded-md border-2 border-dashed border-lemon/70 p-5 sm:flex-row sm:items-center">
          <span className="inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-lemon px-3 py-1 text-sm font-bold text-brine">
            <ShellMark className="h-4 w-4 [--mark-fill:#13283A] [--mark-line:#F4C542]" />
            Concept project
          </span>
          <p className="text-[0.9375rem] text-salt/85">
            Saltline Kitchen is a fictional restaurant group made for a design portfolio. Addresses, phone numbers, menus and prices are placeholders. No reservations or orders are
            sent anywhere.
          </p>
        </div>
      </div>
    </footer>
  );
}
