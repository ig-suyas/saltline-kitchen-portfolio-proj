// A decorative, non-scannable QR-style tile cut from lemon paper.
const N = 21;

function cells() {
  let s = 7;
  const rand = () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
  const out: [number, number][] = [];
  const finder = (x: number, y: number) => x < 8 && y < 8 ? [x, y] : x > N - 9 && y < 8 ? [x - (N - 7), y] : x < 8 && y > N - 9 ? [x, y - (N - 7)] : null;
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const f = finder(x, y);
      if (f) {
        const [fx, fy] = f;
        const ring = fx === 0 || fy === 0 || fx === 6 || fy === 6;
        const core = fx >= 2 && fx <= 4 && fy >= 2 && fy <= 4;
        if (fx < 7 && fy < 7 && (ring || core)) out.push([x, y]);
      } else if (rand() > 0.52) {
        out.push([x, y]);
      }
    }
  }
  return out;
}

const filled = cells();

export function QrSticker({ className, label = "Table 7" }: { className?: string; label?: string }) {
  return (
    <div className={`rounded-md bg-lemon p-3 shadow-[var(--shadow-paper-lg)] ${className ?? ""}`} aria-hidden="true">
      <svg viewBox={`-1 -1 ${N + 2} ${N + 2}`} className="block h-auto w-full rounded-sm bg-salt">
        {filled.map(([x, y]) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="1.02" height="1.02" fill="#13283A" />
        ))}
      </svg>
      <p className="mt-2 text-center font-display text-lg leading-none font-extrabold tracking-[-0.03em] text-brine">{label}</p>
    </div>
  );
}
