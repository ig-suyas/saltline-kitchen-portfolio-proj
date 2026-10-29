// Dish: Wood-grilled porgy, romesco, lemon. Overhead view.
import { C, blob, smooth, plate, lemonWedge, sprig, flakes } from "./paper.mjs";

const layers = [];
const add = (id, label, svg) => layers.push({ id, label, svg });

add("plate", "The plate", plate({ seed: 13 }));
add("sauce", "Romesco", `<path d="${blob({ cx: 318, cy: 336, r: 168, n: 14, jitter: 0.12, seed: 8, sx: 1.42, sy: 0.6, rot: -24 })}" fill="${C.tomato}"/>`);

{
  const pts = [
    [168, 4], [150, -26], [112, -50], [60, -62], [0, -60], [-60, -48], [-112, -28], [-148, -12],
    [-178, -40], [-204, -60], [-190, -20], [-182, 0], [-190, 22], [-204, 60], [-178, 40], [-148, 12],
    [-112, 30], [-60, 50], [0, 58], [60, 54], [112, 40], [150, 22],
  ];
  const body = smooth(pts);
  let bars = "";
  [-96, -46, 4, 54].forEach((o) => {
    bars += `<rect x="${o - 6}" y="-90" width="12" height="180" rx="6" fill="${C.brine}" transform="rotate(28 ${o} 0)"/>`;
  });
  const gill = "M104 -50Q78 0 104 46";
  const tail = "M-160 -6L-192 -42M-160 6L-192 42M-162 0L-184 0";
  add(
    "fish",
    "Whole porgy off the grill",
    `<defs><clipPath id="porgy-body"><path d="${body}"/></clipPath></defs><g transform="translate(318 330) rotate(-24) scale(1.12)"><path d="${body}" fill="${C.salt}"/><g clip-path="url(#porgy-body)">${bars}</g><path d="${gill}" fill="none" stroke="${C.brine}" stroke-width="4" stroke-linecap="round"/><path d="${tail}" fill="none" stroke="${C.brine}" stroke-width="3" stroke-linecap="round"/></g>`,
  );
}

add("lemon", "Lemon wedges", lemonWedge({ x: 196, y: 222, rot: -60, R: 52 }) + lemonWedge({ x: 446, y: 452, rot: 140, R: 48 }));
add(
  "herbs",
  "Parsley",
  [
    { x: 252, y: 168, rot: 30 },
    { x: 392, y: 476, rot: -120 },
    { x: 516, y: 356, rot: 80 },
    { x: 150, y: 330, rot: -100 },
  ]
    .map((s) => sprig(s))
    .join(""),
);
add("finish", "Flaky salt", flakes({ cx: 318, cy: 330, r0: 120, r1: 230, n: 22, seed: 5 }));

export const porgy = { id: "porgy", name: "Wood-grilled porgy, romesco, lemon", layers };
