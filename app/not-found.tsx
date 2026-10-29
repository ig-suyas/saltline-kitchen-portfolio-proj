import Link from "next/link";
import { Piece } from "@/components/Art";

export default function NotFound() {
  return (
    <section className="relative overflow-hidden py-24 md:py-36" aria-labelledby="nf-title">
      <div className="wrap grid grid-cols-1 items-center gap-12 md:grid-cols-12">
        <div className="md:col-span-7">
          <p className="eyebrow text-muted">Error 404</p>
          <h1 id="nf-title" className="mt-4 max-w-[10ch] text-[clamp(3.25rem,8vw+1rem,8.5rem)] leading-[0.88]">
            This table&rsquo;s been <span className="text-tomato">cleared.</span>
          </h1>
          <p className="mt-6 max-w-md text-lead">The page you were after isn&rsquo;t here. It may have moved, or the link has a typo.</p>
          <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
            <Link href="/" className="btn">
              <span className="btn-face">Back to the home page</span>
            </Link>
            <Link href="/menu" className="ulink">
              See the menu <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
        <div className="relative mx-auto aspect-square w-[min(80vw,440px)] md:col-span-5" aria-hidden="true">
          <div className="absolute inset-0 rounded-full bg-brine shadow-[6px_8px_0_rgb(19_40_58/0.25)]" />
          <Piece id="lemon" className="paper-drop absolute top-[38%] left-[28%] w-[44%] rotate-[-20deg]" />
        </div>
      </div>
    </section>
  );
}
