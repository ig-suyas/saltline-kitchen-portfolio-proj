import type { Metadata } from "next";
import Link from "next/link";
import { Dish, Piece } from "@/components/Art";
import { MenuNav } from "@/components/menu/MenuNav";
import { Parallax } from "@/components/Parallax";
import { SplitWords } from "@/components/SplitWords";
import { menu, money, tagLabels, type Tag } from "@/lib/menu";

export const metadata: Metadata = {
  title: "Menu",
  description: "Raw bar, small plates, whole fish from the oak grill, and one very good olive-oil cake. The Saltline Kitchen menu (concept).",
  alternates: { canonical: "/menu" },
};

const sectionBg = ["bg-salt", "bg-salt-deep", "bg-salt", "bg-lemon", "bg-salt-deep"];

function Tags({ tags }: { tags: Tag[] }) {
  if (!tags.length) return null;
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Dietary notes">
      {tags.map((t) => (
        <li key={t} title={tagLabels[t].long} className="rounded-full border-[1.5px] border-current px-2 py-0.5 text-xs leading-none font-bold">
          <abbr title={tagLabels[t].long} className="no-underline">
            {tagLabels[t].short}
          </abbr>
          <span className="sr-only"> ({tagLabels[t].long})</span>
        </li>
      ))}
    </ul>
  );
}

export default function MenuPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-10 pb-16 md:pt-16 md:pb-24" aria-labelledby="menu-title">
        <div className="wrap grid grid-cols-1 items-center gap-10 md:grid-cols-12">
          <div className="relative z-10 md:col-span-7">
            <p className="eyebrow fade-in text-muted">Same menu at all three rooms</p>
            <SplitWords as="h1" id="menu-title" trigger="load" delay={120} text="The menu" className="mt-4 text-h1" />
            <p className="fade-in mt-8 max-w-xl text-lead" style={{ ["--d" as string]: "450ms" }}>
              Day-boat fish from Montauk and Point Judith, vegetables from upstate farms, and almost everything touches the oak grill on the way out.
            </p>
            <p className="fade-in mt-4 max-w-xl text-muted" style={{ ["--d" as string]: "550ms" }}>
              Tell your server about allergies. Raw or undercooked seafood may increase your risk of foodborne illness.
            </p>
          </div>
          <div className="relative md:col-span-5" aria-hidden="true">
            <Parallax speed={-120} rotate={24}>
              <Dish id="tomato" decorative className="paper-drop mx-auto h-auto w-[78%] md:w-full" />
            </Parallax>
            <Parallax speed={-260} rotate={-30} className="absolute top-[-6%] left-[2%] w-[24%]">
              <Piece id="sprig" className="h-auto w-full rotate-[-20deg]" />
            </Parallax>
          </div>
        </div>
      </section>

      <MenuNav sections={menu.map(({ id, title }) => ({ id, title }))} />

      {menu.map((section, si) => (
        <section key={section.id} id={section.id} className={`relative scroll-mt-[136px] overflow-hidden py-16 md:py-24 ${sectionBg[si]}`} aria-labelledby={`${section.id}-title`}>
          <div className="wrap grid grid-cols-1 gap-10 md:grid-cols-12">
            <div className={`md:col-span-4 ${si % 2 ? "md:order-2 md:col-start-9" : ""}`}>
              <p className={`font-display text-xl font-extrabold tabular-nums ${sectionBg[si] === "bg-lemon" ? "text-brine" : "text-tomato"}`} aria-hidden="true">
                0{si + 1}
              </p>
              <SplitWords text={section.title} id={`${section.id}-title`} className="mt-2 text-[clamp(2.5rem,4vw+1rem,4.5rem)] leading-[0.92]" />
              <p className="mt-4 max-w-xs text-muted">{section.blurb}</p>
              {section.dish && (
                <Parallax speed={-90} rotate={si % 2 ? -16 : 16} className="mt-8 hidden w-[88%] md:block">
                  <Dish id={section.dish} className="h-auto w-full" />
                </Parallax>
              )}
            </div>

            <ul className={`md:col-span-8 ${si % 2 ? "md:order-1 md:col-start-1" : ""}`}>
              {section.items.map((item) => (
                <li key={item.id} className="border-b-2 border-brine/15 py-6 first:pt-0 md:py-7">
                  <div className="flex items-baseline gap-3">
                    <h3 className={`font-display text-[clamp(1.375rem,1.2vw+1rem,1.875rem)] leading-tight font-bold tracking-[-0.03em] ${item.soldOut ? "text-brine/60" : ""}`}>
                      {item.name}
                    </h3>
                    <span aria-hidden="true" className="mb-1.5 flex-1 border-b-2 border-dotted border-brine/30" />
                    <p className="font-display text-[clamp(1.375rem,1.2vw+1rem,1.875rem)] font-extrabold tabular-nums">{money(item.price)}</p>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
                    <p className="text-muted">{item.description}</p>
                    <div className="flex items-center gap-3">
                      {item.soldOut && <span className="rounded-full bg-brine px-2.5 py-1 text-xs font-bold text-salt">Sold out tonight</span>}
                      <Tags tags={item.tags} />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ))}

      <section className="bg-salt py-16 md:py-20">
        <div className="wrap flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <dl className="grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-4">
            {(Object.keys(tagLabels) as Tag[]).map((t) => (
              <div key={t} className="flex items-center gap-2">
                <dt className="rounded-full border-[1.5px] border-current px-2 py-0.5 text-xs font-bold">{tagLabels[t].short}</dt>
                <dd className="text-[0.9375rem] text-muted">{tagLabels[t].long}</dd>
              </div>
            ))}
          </dl>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link href="/reserve" className="btn">
              <span className="btn-face">Book a table</span>
            </Link>
            <Link href="/order" className="ulink">
              Order from your table (demo) <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
