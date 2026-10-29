import { locations } from "@/lib/locations";

/**
 * Abstract cut-paper map of the Brooklyn waterfront. Not to scale: it only
 * shows roughly where the three rooms sit relative to each other and the water.
 */
export function BrooklynMap({ className }: { className?: string }) {
  const pins = [
    { id: "greenpoint", x: 470, y: 120 },
    { id: "carroll-gardens", x: 330, y: 380 },
    { id: "red-hook", x: 210, y: 470 },
  ];
  return (
    <svg viewBox="0 0 640 600" className={className} role="img" aria-labelledby="map-title map-desc">
      <title id="map-title">Map of the three Saltline Kitchen rooms</title>
      <desc id="map-desc">Greenpoint is in north Brooklyn on the East River. Carroll Gardens and Red Hook are in south Brooklyn, with Red Hook closest to the harbor. Not to scale.</desc>
      <defs>
        <filter id="map-paper" x="-10%" y="-10%" width="125%" height="125%">
          <feOffset in="SourceAlpha" dx="4" dy="5" result="o" />
          <feFlood floodColor="#13283A" floodOpacity="0.28" />
          <feComposite in2="o" operator="in" result="s" />
          <feMerge>
            <feMergeNode in="s" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Water */}
      <rect width="640" height="600" rx="10" fill="#13283A" />
      {/* Land, cut from salt paper */}
      <path
        filter="url(#map-paper)"
        d="M640 0H452C440 40 470 70 452 104 436 134 404 150 402 190 400 232 378 262 344 284 312 304 298 330 292 364 286 398 262 412 232 418 196 424 160 440 150 478 142 510 176 534 168 568L162 600H640Z"
        fill="#F6F1E7"
      />
      {/* Manhattan edge */}
      <path filter="url(#map-paper)" d="M0 0H330C320 60 296 110 270 168 244 226 200 262 150 300 104 334 50 352 0 362Z" fill="#ECE4D4" />
      {/* Governors Island */}
      <path filter="url(#map-paper)" d="M120 470C134 452 162 450 172 466 180 480 166 498 146 500 128 502 110 488 120 470Z" fill="#ECE4D4" />
      <text x="160" y="140" fill="#13283A" className="font-sans" fontWeight="700" fontSize="16" letterSpacing="2.4">MANHATTAN</text>
      <text x="200" y="356" fill="#F6F1E7" className="font-sans" fontWeight="700" fontSize="14" letterSpacing="2.4" transform="rotate(-48 200 356)">EAST RIVER</text>
      <text x="40" y="560" fill="#F6F1E7" className="font-sans" fontWeight="700" fontSize="14" letterSpacing="2.4">UPPER BAY</text>
      <text x="470" y="300" fill="#13283A" className="font-sans" fontWeight="700" fontSize="16" letterSpacing="2.4">BROOKLYN</text>
      {pins.map((p) => {
        const l = locations.find((x) => x.id === p.id)!;
        return (
          <g key={p.id} filter="url(#map-paper)">
            <circle cx={p.x} cy={p.y} r="24" fill="#E4402A" />
            <text x={p.x} y={p.y + 7} textAnchor="middle" fill="#F6F1E7" className="font-display" fontWeight="800" fontSize="20">
              {locations.indexOf(l) + 1}
            </text>
            <rect x={p.x + 30} y={p.y - 16} width={l.neighborhood.length * 10.5 + 20} height="32" rx="16" fill="#F4C542" />
            <text x={p.x + 40} y={p.y + 6} fill="#13283A" className="font-sans" fontWeight="700" fontSize="16">
              {l.neighborhood}
            </text>
            <title>{`${locations.indexOf(l) + 1}. ${l.neighborhood}`}</title>
          </g>
        );
      })}
    </svg>
  );
}
