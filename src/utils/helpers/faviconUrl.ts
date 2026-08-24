export function faviconUrl(destUrl: string) {
  try {
    const host = new URL(destUrl).hostname;
    return `https://www.google.com/s2/favicons?domain=${host}&sz=32`;
  } catch {
    return null;
  }
}
