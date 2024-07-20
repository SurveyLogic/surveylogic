import {parseColor} from '@react-stately/color';

export function colorToThemeValue(color: string): string {
  return parseColor(color)
    .toString('rgb')
    .replace('rgb(', '')
    .replace(')', '')
    .replace(/, ?/g, ' ');
}
