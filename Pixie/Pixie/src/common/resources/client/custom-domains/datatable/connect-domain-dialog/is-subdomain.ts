export function isSubdomain(host: string): boolean {
  return (host.replace('www.', '').match(/\./g) || []).length > 1;
}
