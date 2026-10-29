// Pre-renders the paper grain once as a small tileable PNG (brine-colored, alpha noise),
// replacing the per-image SVG turbulence filters.
import { deflateSync } from "node:zlib";
import { rng } from "./paper.mjs";

const crcTable = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
const crc32 = (buf) => {
  let c = 0xffffffff;
  for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
const chunk = (type, data) => {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
};

export function grainPng(size = 64) {
  const rand = rng(7);
  const raw = Buffer.alloc(size * (size * 4 + 1));
  let o = 0;
  for (let y = 0; y < size; y++) {
    raw[o++] = 0; // filter: none
    for (let x = 0; x < size; x++) {
      const u = (rand() + rand()) / 2; // soft, centred noise like fractal turbulence
      const a = Math.max(0, 0.35 * u - 0.08 + (u - 0.5) * 0.25);
      raw[o++] = 0x13;
      raw[o++] = 0x28;
      raw[o++] = 0x3a;
      raw[o++] = Math.round(Math.min(1, a / 0.4) * 7) * 15; // 8 alpha steps (0 to ~40%) keep the tile tiny
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  return Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), chunk("IHDR", ihdr), chunk("IDAT", deflateSync(raw, { level: 9 })), chunk("IEND", Buffer.alloc(0))]);
}
