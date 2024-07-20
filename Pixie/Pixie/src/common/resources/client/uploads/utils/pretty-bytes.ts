// Adapted from https://github.com/Flet/prettier-bytes/
// Changing 1000 bytes to 1024, so we can keep uppercase KB vs kB
// ISC License (c) Dan Flettre https://github.com/Flet/prettier-bytes/blob/master/LICENSE
export function prettyBytes(num?: number): string {
  if (num == null || Number.isNaN(num)) return '';
  const neg = num < 0;
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  if (neg) {
    num = -num;
  }

  if (num < 1) {
    return `${(neg ? '-' : '') + num} B`;
  }

  const exponent = Math.min(
    Math.floor(Math.log(num) / Math.log(1024)),
    units.length - 1
  );
  num = Number(num / Math.pow(1024, exponent));
  const unit = units[exponent];

  if (num >= 10 || num % 1 === 0) {
    // Do not show decimals when the number is two-digit, or if the number has no
    // decimal component.
    return `${(neg ? '-' : '') + num.toFixed(0)} ${unit}`;
  }
  return `${(neg ? '-' : '') + num.toFixed(1)} ${unit}`;
}
