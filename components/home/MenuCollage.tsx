import Link from "next/link";
import { Dish } from "@/components/Art";
import { Parallax } from "@/components/Parallax";
import { SplitWords } from "@/components/SplitWords";

const plates = [
  { id: "porgy", name: "Whole porgy", note: "Romesco, lemon, parsley", price: "$34", section: "From the grill" },
  { id: "tomato", name: "Heirloom tomatoes", note: "Stracciatella, basil, lemon oil", price: "$16", section: "Raw and cold" },
  { id: "cake", name: "Olive-oil cake", note: "Roasted rhubarb, whipped cream", price: "$12", section: "Sweets" },
] as const;

function Ticket({ p, className }: { p: (typeof plates)[number]; className?: string }) {
  return (
    <div className={`ticket max-w-[260px] px-5 py-4 ${className ?? ""}`}>
      <p className="eyebrow text-[0.6875rem] text-muted">{p.section}</p>
      <p className="mt-1 font-display text-[1.375rem] leading-tight font-extrabold tracking-[-0.03em]">{p.name}</p>
      <p className="mt-1 text-[0.9375rem] leading-snug text-muted">{p.note}</p>
      <p className="mt-2 font-display text-2xl font-extrabold text-tomato">{p.price}</p>
    </div>
  );
}

export function MenuCollage() {
  return (
    <section className="relative overflow-hidden bg-salt-deep py-24 md:py-36" aria-labelledby="pass-title">
      <div className="wrap">
        <div className="max-w-3xl">
          <p className="eyebrow text-muted">On the pass this week</p>
          <SplitWords text="Whatever came off the boat, near the fire." id="pass-title" className="mt-4 text-h2" accent={[6]} />
        </div>

        <div className="relative mt-16 grid gap-16 md:mt-10 md:block md:h-[1180px] lg:h-[1080px]">
          <Parallax speed={-60} rotate={-8} className="will-change-transform relative md:absolute md:top-[2%] md:left-0 md:w-[54%]">
            <Dish id="porgy" raster className="h-auto w-full" />
            <Ticket p={plates[0]} className="absolute right-0 bottom-[-6%] rotate-[4deg] md:right-[6%] md:bottom-[2%]" />
          </Parallax>
          <Parallax speed={-240} rotate={14} className="will-change-transform relative w-[86%] justify-self-end md:absolute md:top-[18%] md:right-0 md:w-[38%]">
            <Dish id="tomato" raster className="h-auto w-full" />
            <Ticket p={plates[1]} className="absolute bottom-[-10%] left-0 -rotate-[5deg] md:left-[-14%] md:bottom-[4%]" />
          </Parallax>
          <Parallax speed={-380} rotate={-12} className="will-change-transform relative w-[72%] md:absolute md:top-[62%] md:left-[40%] md:w-[30%]">
            <Dish id="cake" raster className="h-auto w-full" />
            <Ticket p={plates[2]} className="absolute right-[-14%] bottom-[-8%] rotate-[6deg] md:right-[-46%] md:bottom-[18%]" />
          </Parallax>
        </div>

        <div className="mt-24 flex flex-wrap items-center gap-6 md:mt-0">
          <Link href="/menu" className="btn btn-brine">
            <span className="btn-face">See the full menu</span>
          </Link>
          <p className="text-muted">Dishes change with the catch. Prices shown are placeholders.</p>
        </div>
      </div>
    </section>
  );
}
