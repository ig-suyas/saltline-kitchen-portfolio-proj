// Dish: Littleneck clams, charred tomato broth, lemon wedges, grilled sourdough. Overhead view.
// Layers are ordered the way the plate is built in the home-page sequence.
import { C, blob, rng, plate, fanShell, lemonWedge, sprig, bread, flakes } from "./paper.mjs";

const layers = [];
const add = (id, label, svg) => layers.push({ id, label, svg });

{
  const rand = rng(91);
  let rim = "";
  for (let i = 0; i < 9; i++) {
    const a = 1.2 + i * 0.5 + rand() * 0.25;
    const r = 250 + rand() * 14;
    const s = 3 + rand() * 3;
    const x = 320 + Math.cos(a) * r;
    const y = 320 + Math.sin(a) * r;
    rim += `<rect x="${(x - s / 2).toFixed(1)}" y="${(y - s / 2).toFixed(1)}" width="${s.toFixed(1)}" height="${s.toFixed(1)}" transform="rotate(${(rand() * 90).toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})" fill="${C.salt}"/>`;
  }
  add("plate", "The plate", plate({}) + rim);
}

add("broth", "Charred tomato broth", `<path d="${blob({ cx: 318, cy: 346, r: 196, n: 16, jitter: 0.06, seed: 4 })}" fill="${C.tomato}"/>`);

add(
  "bread",
  "Grilled sourdough",
  bread({ x: 462, y: 132, rot: -24, seed: 21, id: "clams-crumb-0" }) + bread({ x: 546, y: 252, rot: -66, seed: 22, id: "clams-crumb-1" }),
);

add(
  "clams",
  "Littleneck clams",
  [
    { x: 250, y: 262, rot: -30, R: 58, seed: 31 },
    { x: 338, y: 236, rot: 12, R: 54, seed: 32 },
    { x: 412, y: 300, rot: 58, R: 56, seed: 33 },
    { x: 300, y: 340, rot: -8, R: 62, seed: 34 },
    { x: 222, y: 380, rot: -72, R: 52, seed: 35 },
    { x: 384, y: 404, rot: 128, R: 58, seed: 36 },
    { x: 302, y: 452, rot: 176, R: 54, seed: 37 },
    { x: 446, y: 470, rot: 96, R: 46, seed: 38 },
  ]
    .map((s) => fanShell(s))
    .join(""),
);

add("lemon", "Lemon wedges", lemonWedge({ x: 150, y: 452, rot: -118, R: 54 }) + lemonWedge({ x: 196, y: 530, rot: -150, R: 48 }));

add(
  "herbs",
  "Parsley",
  [
    { x: 356, y: 330, rot: 20 },
    { x: 262, y: 424, rot: -50 },
    { x: 452, y: 384, rot: 110 },
    { x: 214, y: 314, rot: 160 },
  ]
    .map((s) => sprig(s))
    .join(""),
);

{
  const rand = rng(1077);
  let zest = "";
  for (let i = 0; i < 10; i++) {
    const a = rand() * Math.PI * 2;
    const r = 60 + rand() * 130;
    const x = 318 + Math.cos(a) * r;
    const y = 346 + Math.sin(a) * r;
    const t = rand() * Math.PI;
    const dx = Math.cos(t) * 8;
    const dy = Math.sin(t) * 8;
    zest += `<path d="M${(x - dx).toFixed(1)} ${(y - dy).toFixed(1)}L${(x + dx).toFixed(1)} ${(y + dy).toFixed(1)}" fill="none" stroke="${C.lemon}" stroke-width="3" stroke-linecap="round"/>`;
  }
  add("finish", "Flaky salt and lemon zest", flakes({ cx: 318, cy: 346, r0: 40, r1: 190, n: 30, seed: 77 }) + zest);
}

export const clams = { id: "clams", name: "Littleneck clams, charred tomato broth", layers };
