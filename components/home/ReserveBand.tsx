import Link from "next/link";
import { Piece } from "@/components/Art";
import { Parallax } from "@/components/Parallax";
import { SplitWords } from "@/components/SplitWords";

export function ReserveBand() {
  return (
    <section className="grain relative overflow-hidden bg-tomato py-24 text-salt md:py-32" aria-labelledby="band-title">
      <Parallax speed={-300} rotate={40} className="pointer-events-none absolute top-[8%] right-[6%] w-[30vw] max-w-[260px]">
        <Piece id="shell" className="h-auto w-full rotate-[20deg]" />
      </Parallax>
      <Parallax speed={-140} rotate={-30} className="pointer-events-none absolute bottom-[-4%] left-[48%] w-[26vw] max-w-[220px]">
        <Piece id="lemon" className="h-auto w-full rotate-[-160deg]" />
      </Parallax>

      <div className="wrap relative">
        <SplitWords text="Pull up a chair." id="band-title" className="max-w-[9ch] text-[clamp(3.5rem,11vw,11rem)] leading-[0.84]" />
        <p className="mt-8 max-w-xl font-display text-[clamp(1.5rem,2.2vw,2rem)] leading-tight font-bold tracking-[-0.02em]">
          Book any of the three rooms up to 30 days out. Raw bar seats stay open for walk-ins.
        </p>
        <Link href="/reserve" className="btn btn-salt mt-10">
          <span className="btn-face">Reserve a table</span>
        </Link>
      </div>
    </section>
  );
}
