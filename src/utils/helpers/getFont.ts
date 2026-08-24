import { theme } from "../../theme";

const { colors: C, font: F, radius: R, shadow: S } = theme;
export const fontInfo = { C, F, R, S };
export const getFont = (
  sz: number,
  wt: number,
  extra?: React.CSSProperties,
): React.CSSProperties => ({
  fontSize: sz,
  fontWeight: wt,
  fontFamily: F.family,
  ...extra,
});
