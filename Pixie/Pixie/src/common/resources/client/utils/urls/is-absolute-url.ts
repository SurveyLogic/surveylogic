export function isAbsoluteUrl(url?: string): boolean {
  if (!url) return false;
  return /^[a-zA-Z][a-zA-Z\d+\-.]*?:/.test(url);
}
