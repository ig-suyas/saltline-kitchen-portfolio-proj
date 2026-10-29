import { ImageResponse } from "next/og";

export const alt = "Saltline Kitchen: wood-fired seafood in Brooklyn. Portfolio concept.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Social card drawn in code: navy plate, tomato broth, lemon wedge, wordmark.
export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#F6F1E7", position: "relative" }}>
        <div style={{ position: "absolute", right: -120, top: 35, width: 560, height: 560, borderRadius: 999, background: "#13283A", display: "flex" }} />
        <div style={{ position: "absolute", right: 0, top: 130, width: 340, height: 340, borderRadius: 999, background: "#E4402A", display: "flex" }} />
        <div style={{ position: "absolute", right: 120, top: 210, width: 170, height: 85, borderRadius: "170px 170px 0 0", background: "#F4C542", display: "flex" }} />
        <div style={{ display: "flex", flexDirection: "column", padding: "72px 80px", width: 760 }}>
          <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: 4, color: "#445566" }}>RED HOOK · GREENPOINT · CARROLL GARDENS</div>
          <div style={{ fontSize: 124, fontWeight: 800, lineHeight: 0.9, letterSpacing: -6, color: "#13283A", marginTop: 36 }}>Saltline Kitchen</div>
          <div style={{ fontSize: 40, color: "#13283A", marginTop: 30 }}>Brooklyn seafood, cooked over live fire.</div>
          <div style={{ display: "flex", marginTop: 44 }}>
            <div style={{ fontSize: 24, fontWeight: 700, background: "#F4C542", color: "#13283A", padding: "10px 20px", borderRadius: 999 }}>Portfolio concept</div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
