// Single cut-paper pieces used as parallax collage stickers.
import { fanShell, lemonWedge, bread, tomatoSlice, sprig } from "./paper.mjs";

export const pieces = [
  { id: "lemon", viewBox: "0 0 200 120", svg: lemonWedge({ x: 100, y: 108, R: 90 }) },
  { id: "shell", viewBox: "0 0 220 200", svg: fanShell({ x: 110, y: 104, R: 96, seed: 3 }) },
  { id: "bread", viewBox: "0 0 220 140", svg: bread({ x: 110, y: 68, seed: 5, id: "piece-crumb" }) },
  { id: "tomato", viewBox: "0 0 180 180", svg: tomatoSlice({ x: 90, y: 88, R: 80, seed: 12 }) },
  { id: "sprig", viewBox: "0 0 100 120", svg: sprig({ x: 50, y: 64, scale: 1.8 }) },
];
