export interface LayoutParams {
  columns?: 1 | 2 | 3 | 4;
  background?: "surface" | "subtle" | "inverse" | "brand" | "muted";
  paddingY?: "compact" | "standard" | "spacious";
  align?: "left" | "center" | "right" | "split";
  maxItems?: number;
  fullBleed?: boolean;
  mediaPosition?: "left" | "right" | "top" | "bottom";
}
