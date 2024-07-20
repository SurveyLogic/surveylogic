export function lowerFirst(string: string): string {
  if (!string) return '';
  return string.charAt(0).toLowerCase() + string.slice(1);
}
