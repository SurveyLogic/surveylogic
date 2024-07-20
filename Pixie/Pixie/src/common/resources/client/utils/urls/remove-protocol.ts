export function removeProtocol(url: string) {
  if (!url) return url;
  return url.replace(/(^\w+:|^)\/\//, '');
}
