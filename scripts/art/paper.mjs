// Cut-paper drawing helpers. Every shape is a slightly irregular closed path,
// so pieces read as hand-cut paper rather than vector-perfect geometry.
// Only the four palette colors are used; depth comes from the paper filter.

export const C = {
  tomato: "#E4402A",
  brine: "#13283A",
  salt: "#F6F1E7",
  lemon: "#F4C542",
};

export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const f = (n) => Math.round(n * 10) / 10;

function rotate([x, y], deg) {
  const r = (deg * Math.PI) / 180;
  return [x * Math.cos(r) - y * Math.sin(r), x * Math.sin(r) + y * Math.cos(r)];
}

// Catmull-Rom through closed points -> cubic bezier path
export function smooth(points, tension = 1 / 6) {
  const n = points.length;
  let d = `M${f(points[0][0])} ${f(points[0][1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = points[(i - 1 + n) % n];
    const p1 = points[i];
    const p2 = points[(i + 1) % n];
    const p3 = points[(i + 2) % n];
    const c1 = [p1[0] + (p2[0] - p0[0]) * tension, p1[1] + (p2[1] - p0[1]) * tension];
    const c2 = [p2[0] - (p3[0] - p1[0]) * tension, p2[1] - (p3[1] - p1[1]) * tension];
    d += `C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p2[0])} ${f(p2[1])}`;
  }
  return d + "Z";
}

// Irregular blob around (cx, cy)
export function blob({ cx, cy, r, n = 12, jitter = 0.08, seed = 1, rot = 0, sx = 1, sy = 1 }) {
  const rand = rng(seed);
  const pts = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + (rand() - 0.5) * (Math.PI / n) * 0.6;
    const rr = r * (1 + (rand() - 0.5) * jitter * 2);
    const p = rotate([Math.cos(a) * rr * sx, Math.sin(a) * rr * sy], rot);
    pts.push([cx + p[0], cy + p[1]]);
  }
  return smooth(pts);
}

// Pointed leaf
export function leaf({ cx, cy, len, w, rot = 0, bend = 0 }) {
  const pt = (x, y) => {
    const p = rotate([x, y], rot);
    return `${f(cx + p[0])} ${f(cy + p[1])}`;
  };
  const L = len / 2;
  return `M${pt(0, -L)}Q${pt(w + bend, -L * 0.1)} ${pt(0, L)}Q${pt(-w + bend, L * 0.1)} ${pt(0, -L)}Z`;
}

const g = (x, y, rot, inner, scale = 1) =>
  `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(rot)})${scale !== 1 ? ` scale(${scale})` : ""}">${inner}</g>`;

// ---------- Reusable pieces (each returns an SVG string) ----------

// Ribbed fan clam shell: hinge at the bottom, scalloped edge on top
export function fanShell({ x, y, rot = 0, R, ribs = 9, spread = 56, seed = 1 }) {
  const rand = rng(seed);
  const hingeY = R * 0.5;
  const toRad = (d) => (d * Math.PI) / 180;
  const edge = (a, r) => [Math.cos(toRad(a)) * r, hingeY + Math.sin(toRad(a)) * r];
  const a0 = -90 - spread;
  const step = (spread * 2) / ribs;
  const angles = Array.from({ length: ribs + 1 }, (_, i) => a0 + i * step);
  const radii = angles.map(() => R * (1 + (rand() - 0.5) * 0.04));
  const p = (pt) => `${f(pt[0])} ${f(pt[1])}`;
  let body = `M${p([-R * 0.07, hingeY])}L${p(edge(angles[0], radii[0]))}`;
  for (let i = 0; i < ribs; i++) {
    const mid = (angles[i] + angles[i + 1]) / 2;
    body += `Q${p(edge(mid, R * 1.09))} ${p(edge(angles[i + 1], radii[i + 1]))}`;
  }
  body += `L${p([R * 0.07, hingeY])}Q${p([0, hingeY + R * 0.06])} ${p([-R * 0.07, hingeY])}Z`;
  let ribsD = "";
  for (let i = 1; i < ribs; i++) ribsD += `M${p(edge(angles[i], R * 0.14))}L${p(edge(angles[i], radii[i] * 0.97))}`;
  const sw = f(Math.max(2.4, R * 0.045));
  return g(x, y, rot, `<path d="${body}" fill="${C.salt}"/><path d="${ribsD}" fill="none" stroke="${C.brine}" stroke-width="${sw}" stroke-linecap="round"/>`);
}

// Lemon wedge lying on its side, seen from above: flat cut edge, peel arc, pith band, segments
export function lemonWedge({ x, y, rot = 0, R, segs = 5 }) {
  const p = (r, a) => `${f(Math.cos(a) * r)} ${f(Math.sin(a) * r)}`;
  const half = (r) => `M${p(r, Math.PI)}A${f(r)} ${f(r)} 0 0 1 ${p(r, 0)}Z`;
  let flesh = "";
  for (let i = 0; i < segs; i++) {
    const gap = 0.06;
    const a0 = Math.PI + (i / segs) * Math.PI + (i === 0 ? 0.02 : gap);
    const a1 = Math.PI + ((i + 1) / segs) * Math.PI - (i === segs - 1 ? 0.02 : gap);
    flesh += `M${p(R * 0.1, a0)}L${p(R * 0.8, a0)}A${f(R * 0.8)} ${f(R * 0.8)} 0 0 1 ${p(R * 0.8, a1)}L${p(R * 0.1, a1)}Z`;
  }
  return g(x, y, rot, `<path d="${half(R)}" fill="${C.lemon}"/><path d="${half(R * 0.87)}" fill="${C.salt}"/><path d="${flesh}" fill="${C.lemon}"/>`);
}

// Herb sprig: stem with three leaves
export function sprig({ x, y, rot = 0, scale = 1 }) {
  const ls = [
    leaf({ cx: 0, cy: -20, len: 26, w: 8, bend: 1 }),
    leaf({ cx: -10, cy: -4, len: 22, w: 7, rot: -55, bend: -1 }),
    leaf({ cx: 10, cy: 2, len: 22, w: 7, rot: 55, bend: 1 }),
  ];
  return g(
    x,
    y,
    rot,
    `<path d="M0 26Q3 8 0 -10" fill="none" stroke="${C.brine}" stroke-width="2.6" stroke-linecap="round"/>${ls.map((d) => `<path d="${d}" fill="${C.brine}"/>`).join("")}`,
    scale,
  );
}

// Grilled sourdough slice: tomato-toned crust, golden crumb, three char bars
export function bread({ x, y, rot = 0, seed = 1, id, scale = 1 }) {
  const crumb = blob({ cx: 0, cy: 0, r: 54, n: 12, jitter: 0.05, seed: seed + 1, sx: 1.55, sy: 0.88 });
  const crust = blob({ cx: 0, cy: 0, r: 62, n: 12, jitter: 0.04, seed, sx: 1.55, sy: 0.9 });
  let bars = "";
  [-34, 0, 34].forEach((o, k) => {
    const w = 11 + k * 1.5;
    bars += `<rect x="${o - w / 2}" y="-70" width="${w}" height="140" rx="${w / 2}" fill="${C.brine}" transform="rotate(28 ${o} 0)"/>`;
  });
  return g(
    x,
    y,
    rot,
    `<defs><clipPath id="${id}"><path d="${crumb}"/></clipPath></defs><path d="${crust}" fill="${C.tomato}"/><path d="${crumb}" fill="${C.lemon}"/><g clip-path="url(#${id})">${bars}</g>`,
    scale,
  );
}

// Tomato slice: red disc, salt wall ring, curved seed chambers outlined in salt
export function tomatoSlice({ x, y, rot = 0, R, seed = 1, lobes = 4 }) {
  const rand = rng(seed);
  let inner = `<path d="${blob({ cx: 0, cy: 0, r: R, n: 14, jitter: 0.03, seed })}" fill="${C.tomato}"/>`;
  inner += `<path d="${blob({ cx: 0, cy: 0, r: R * 0.84, n: 14, jitter: 0.03, seed: seed + 3 })}" fill="none" stroke="${C.salt}" stroke-width="${f(R * 0.05)}"/>`;
  for (let i = 0; i < lobes; i++) {
    const a = (i / lobes) * 360 + rand() * 12;
    const ar = (a * Math.PI) / 180;
    const d = blob({ cx: Math.cos(ar) * R * 0.45, cy: Math.sin(ar) * R * 0.45, r: R * 0.24, n: 9, jitter: 0.08, seed: seed + 10 + i, rot: a, sx: 1.3, sy: 0.75 });
    inner += `<path d="${d}" fill="none" stroke="${C.salt}" stroke-width="${f(R * 0.045)}" stroke-linejoin="round"/>`;
  }
  return g(x, y, rot, inner);
}

// Scatter of flaky salt
export function flakes({ cx, cy, r0, r1, n, seed, color = C.salt, size = [3.5, 7] }) {
  const rand = rng(seed);
  let svg = "";
  for (let i = 0; i < n; i++) {
    const a = rand() * Math.PI * 2;
    const r = r0 + rand() * (r1 - r0);
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r;
    const s = size[0] + rand() * (size[1] - size[0]);
    svg += `<rect x="${f(x - s / 2)}" y="${f(y - s / 2)}" width="${f(s)}" height="${f(s)}" transform="rotate(${Math.round(rand() * 90)} ${f(x)} ${f(y)})" fill="${color}"/>`;
  }
  return svg;
}

export function plate({ cx = 320, cy = 320, r = 278, seed = 11 }) {
  return `<path d="${blob({ cx, cy, r, n: 30, jitter: 0.012, seed })}" fill="${C.brine}"/>`;
}

// Paper effects, built for render cost:
// "lift" is a cheap crisp offset shadow on every paper layer (pieces lift off the sheet).
// Grain is one pre-rendered PNG tile (see grain.mjs), repeated and masked to the paper shapes.
// No turbulence filters are computed in the browser.
export function paperDefs(w, h, grainDataUri) {
  return `<filter id="lift" x="-5%" y="-5%" width="112%" height="112%" color-interpolation-filters="sRGB"><feOffset in="SourceAlpha" dx="3" dy="4" result="off"/><feFlood flood-color="${C.brine}" flood-opacity="0.3"/><feComposite in2="off" operator="in" result="shadow"/><feMerge><feMergeNode in="shadow"/><feMergeNode in="SourceGraphic"/></feMerge></filter><pattern id="grainTile" width="64" height="64" patternUnits="userSpaceOnUse"><image href="${grainDataUri}" width="64" height="64"/></pattern><mask id="artMask" mask-type="alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="${w}" height="${h}"><use href="#art"/></mask>`;
}

// Wraps drawn layers with the shared paper treatment
export function paperBody(w, h, layers) {
  return `<g id="art">${layers.map((l) => `<g filter="url(#lift)">${l}</g>`).join("")}</g><rect width="${w}" height="${h}" fill="url(#grainTile)" mask="url(#artMask)"/>`;
}
