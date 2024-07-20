export function ucFirst<T extends string>(string: T): T {
  if (!string) return string;
  return (string.charAt(0).toUpperCase() + string.slice(1)) as T;
}
