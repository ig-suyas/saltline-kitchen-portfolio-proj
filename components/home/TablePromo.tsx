import Link from "next/link";
import { Parallax } from "@/components/Parallax";
import { QrSticker } from "@/components/QrSticker";
import { SplitWords } from "@/components/SplitWords";
import { itemById, money } from "@/lib/menu";

const steps = [
  ["Scan", "Every table has its own code, so the kitchen knows where the food goes."],
  ["Order", "Browse the menu on your phone and add another round whenever you like."],
  ["Stay", "Nobody waves down a server for a second dozen. Pay at the table when you leave."],
];

// Phone mock tray. Names, prices and totals all come from the menu data.
const preview = [
  { id: "oysters", qty: 2 },
  { id: "sourdough", qty: 1 },
  { id: "spritz", qty: 0 },
].map((p) => ({ ...p, item: itemById(p.id)! }));
const trayCount = preview.reduce((n, p) => n + p.qty, 0);
const trayTotal = preview.reduce((n, p) => n + p.qty * p.item.price, 0);

export function TablePromo() {
  return (
    <section className="on-dark relative overflow-hidden bg-brine py-24 text-salt md:py-36" aria-labelledby="table-title">
      <div className="wrap grid grid-cols-1 items-center gap-16 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <p className="eyebrow text-lemon">Order at Table</p>
          <SplitWords text="Scan the code, order another dozen." id="table-title" className="mt-4 text-h2" accent={[4, 5]} accentClass="text-lemon" />
          <ol className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {steps.map(([t, d], i) => (
              <li key={t} className="border-t-2 border-salt/25 pt-4">
                <p className="font-display text-2xl font-extrabold tracking-[-0.03em]">
                  <span className="mr-2 text-lemon tabular-nums">0{i + 1}</span>
                  {t}
                </p>
                <p className="mt-2 text-salt/80">{d}</p>
              </li>
            ))}
          </ol>
          <Link href="/order" className="btn btn-lemon mt-12">
            <span className="btn-face">Try the table demo</span>
          </Link>
        </div>

        <div className="relative mx-auto w-full max-w-[420px] lg:col-span-5 lg:col-start-8">
          {/* Phone mock of the ordering screen */}
          <Parallax speed={-60}>
            <div className="rounded-[44px] bg-salt p-3 shadow-[10px_14px_0_rgb(0_0_0/0.25)]" aria-hidden="true">
              <div className="overflow-hidden rounded-[34px] bg-salt text-brine ring-2 ring-brine/10">
                <div className="flex items-center justify-between bg-lemon px-5 pt-6 pb-4 text-brine">
                  <p className="font-display text-xl font-extrabold tracking-[-0.03em]">Table 7</p>
                  <p className="text-sm font-semibold">Red Hook</p>
                </div>
                <div className="flex gap-2 px-5 pt-4 text-sm font-semibold">
                  <span className="rounded-full bg-brine px-3 py-1 text-salt">Raw and cold</span>
                  <span className="rounded-full px-3 py-1 ring-1 ring-brine/25">Small plates</span>
                </div>
                <ul className="px-5 py-3">
                  {preview.map((p) => (
                    <li key={p.id} className="flex items-center justify-between gap-3 border-b border-line py-3.5">
                      <span>
                        <span className="block leading-tight font-semibold">{p.item.name}</span>
                        <span className="block text-sm text-muted">{p.qty ? `${money(p.item.price)} × ${p.qty} = ${money(p.item.price * p.qty)}` : `${money(p.item.price)} each`}</span>
                      </span>
                      <span className={`flex h-9 min-w-9 shrink-0 items-center justify-center rounded-full px-3 text-sm font-bold ${p.qty ? "bg-brine text-salt" : "ring-2 ring-brine"}`}>
                        {p.qty ? `× ${p.qty}` : "Add"}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="m-4 mt-2 flex items-center justify-between rounded-full bg-brine px-5 py-3.5 text-salt">
                  <span className="font-semibold">
                    {trayCount} items · {money(trayTotal)}
                  </span>
                  <span className="font-display font-extrabold">View tray →</span>
                </div>
              </div>
            </div>
          </Parallax>
          <Parallax speed={-260} rotate={-24} className="absolute -top-10 -left-6 w-[38%] sm:-left-16">
            <QrSticker className="rotate-[-10deg]" />
          </Parallax>
        </div>
      </div>
    </section>
  );
}
