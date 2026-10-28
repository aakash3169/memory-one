import { SVG_ASSETS_A } from "./svgAssetsA";
import { SVG_ASSETS_B } from "./svgAssetsB";
export function getAssetUrl(path: string): string {
  const clean = path.split("?")[0];
  return SVG_ASSETS_A[clean] || SVG_ASSETS_B[clean] || path;
}
