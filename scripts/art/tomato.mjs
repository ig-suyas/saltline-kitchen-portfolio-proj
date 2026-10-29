// Dish: Heirloom tomatoes, stracciatella, basil, lemon oil. Overhead view.
import { C, blob, leaf, plate, tomatoSlice, flakes } from "./paper.mjs";

const layers = [];
const add = (id, label, svg) => layers.push({ id, label, svg });

add("plate", "The plate", plate({ seed: 17 }));

add(
  "tomatoes",
  "Heirloom tomatoes",
  [0, 1, 2, 3, 4, 5]
    .map((i) => {
      const a = ((i * 60 + 15) * Math.PI) / 180;
      return tomatoSlice({ x: 320 + Math.cos(a) * 132, y: 320 + Math.sin(a) * 132, rot: i * 37, R: 72 - (i % 2) * 8, seed: 40 + i * 7 });
    })
    .join(""),
);

add("cheese", "Stracciatella", `<path d="${blob({ cx: 322, cy: 318, r: 84, n: 16, jitter: 0.14, seed: 61 })}" fill="${C.salt}"/>`);

add(
  "oil",
  "Lemon olive oil",
  `<path d="M268 318C268 282 302 270 326 276C356 284 368 312 352 336C338 356 304 354 296 332C290 316 304 302 320 306" fill="none" stroke="${C.lemon}" stroke-width="6" stroke-linecap="round"/>`,
);

add(
  "basil",
  "Basil",
  [
    [236, 214, 54, 16, -30], [430, 236, 50, 15, 50], [452, 412, 54, 16, 130],
    [214, 430, 50, 15, -140], [322, 196, 46, 14, 95], [330, 458, 48, 14, 70],
  ]
    .map(([cx, cy, len, w, rot]) => `<path d="${leaf({ cx, cy, len, w, rot, bend: 2 })}" fill="${C.brine}"/>`)
    .join(""),
);

add(
  "finish",
  "Salt and black pepper",
  flakes({ cx: 320, cy: 320, r0: 110, r1: 200, n: 22, seed: 9 }) +
    flakes({ cx: 322, cy: 318, r0: 10, r1: 70, n: 16, seed: 19, color: C.brine, size: [2.5, 4] }),
);

export const tomato = { id: "tomato", name: "Heirloom tomatoes, stracciatella, basil", layers };
