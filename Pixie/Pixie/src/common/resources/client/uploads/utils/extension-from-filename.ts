export function extensionFromFilename(fullFileName: string): string {
  const re = /(?:\.([^.]+))?$/;
  return re.exec(fullFileName)?.[1] || '';
}
