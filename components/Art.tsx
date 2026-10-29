/* eslint-disable @next/next/no-img-element -- static, self-contained SVG art served from /public */
import type { CSSProperties } from "react";
import { dishes, type DishId } from "@/lib/art/dishes";

const pieceSizes = {
  lemon: [200, 120],
  shell: [220, 200],
  bread: [220, 140],
  tomato: [180, 180],
  sprig: [100, 120],
} as const;

export type PieceId = keyof typeof pieceSizes;

type ImgProps = { className?: string; style?: CSSProperties; priority?: boolean };

/**
 * A finished cut-paper dish (all layers in one SVG).
 * `raster` serves a pre-rendered 2x WebP of the same art (porgy, tomato, cake), for spots
 * where the image moves every frame and repainting the SVG's filters and grain mask is too costly.
 */
export function Dish({ id, className, style, priority, decorative, raster }: ImgProps & { id: DishId; decorative?: boolean; raster?: boolean }) {
  return (
    <img
      src={`/art/${id}.${raster ? "webp" : "svg"}`}
      width={640}
      height={640}
      alt={decorative ? "" : `Cut-paper illustration: ${dishes[id].name}`}
      aria-hidden={decorative || undefined}
      className={className}
      style={style}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      draggable={false}
    />
  );
}

/** A single cut-paper ingredient used as a collage sticker. Always decorative. */
export function Piece({ id, className, style, priority }: ImgProps & { id: PieceId }) {
  const [w, h] = pieceSizes[id];
  return (
    <img
      src={`/art/pieces/${id}.svg`}
      width={w}
      height={h}
      alt=""
      aria-hidden="true"
      className={className}
      style={style}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      draggable={false}
    />
  );
}
