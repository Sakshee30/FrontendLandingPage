export function normalizeUrl(v = "") {
  const t = v.trim();
  return !t ? "" : /^https?:\/\//i.test(t) ? t : `https://${t}`;
}
