// Dish: Olive-oil cake, roasted rhubarb, whipped cream. Overhead view.
import { C, blob, leaf, plate, flakes, f } from "./paper.mjs";

const layers = [];
const add = (id, label, svg) => layers.push({ id, label, svg });

add("plate", "The plate", plate({ seed: 23 }));

{
  const A = [196, 474];
  const at = (deg, r) => [A[0] + Math.cos((deg * Math.PI) / 180) * r, A[1] + Math.sin((deg * Math.PI) / 180) * r];
  // Ring sector between radii r0..r1 (r0 = 0 gives a full wedge to the tip)
  const sector = (r0, r1, a0, a1) => {
    const o0 = at(a0, r1);
    const o1 = at(a1, r1);
    if (r0 === 0) return `M${f(A[0])} ${f(A[1])}L${f(o0[0])} ${f(o0[1])}A${r1} ${r1} 0 0 1 ${f(o1[0])} ${f(o1[1])}Z`;
    const i0 = at(a0, r0);
    const i1 = at(a1, r0);
    return `M${f(i0[0])} ${f(i0[1])}L${f(o0[0])} ${f(o0[1])}A${r1} ${r1} 0 0 1 ${f(o1[0])} ${f(o1[1])}L${f(i1[0])} ${f(i1[1])}A${r0} ${r0} 0 0 0 ${f(i0[0])} ${f(i0[1])}Z`;
  };
  add(
    "cake",
    "Olive-oil cake",
    `<path d="${sector(0, 270, -64, -26)}" fill="${C.lemon}"/><path d="${sector(250, 270, -64, -26)}" fill="${C.tomato}"/>` +
      flakes({ cx: 318, cy: 330, r0: 0, r1: 60, n: 12, seed: 33, size: [3, 5] }),
  );
}

add(
  "rhubarb",
  "Roasted rhubarb",
  [
    [360, 500, 15], [424, 516, -25], [500, 442, 60], [512, 370, 100], [470, 300, -40],
  ]
    .map(([x, y, r], i) => `<rect x="${x - 36 - i}" y="${y - 9}" width="${72 + i * 2}" height="18" rx="9" fill="${C.tomato}" transform="rotate(${r} ${x} ${y})"/>`)
    .join(""),
);

add("cream", "Whipped cream", `<path d="${blob({ cx: 432, cy: 424, r: 48, n: 12, jitter: 0.06, seed: 71, sx: 1.55, sy: 0.92, rot: -28 })}" fill="${C.salt}"/>`);

add(
  "mint",
  "Mint",
  [
    [470, 396, 30, 10, 40], [446, 386, 26, 9, -20], [402, 452, 28, 9, 150],
  ]
    .map(([cx, cy, len, w, rot]) => `<path d="${leaf({ cx, cy, len, w, rot, bend: 1 })}" fill="${C.brine}"/>`)
    .join(""),
);

add("finish", "Lemon zest", flakes({ cx: 320, cy: 320, r0: 150, r1: 235, n: 14, seed: 44, color: C.lemon, size: [3, 6] }));

export const cake = { id: "cake", name: "Olive-oil cake, roasted rhubarb, cream", layers };
