import {parseColor} from '@react-stately/color';

export function getColorBrightness(value: string) {
  const parsed = parseColor(value).toFormat('rgb');
  //http://www.w3.org/TR/AERT#color-contrast
  const red = parsed.getChannelValue('red');
  const green = parsed.getChannelValue('green');
  const blue = parsed.getChannelValue('blue');
  return (red * 299 + green * 587 + blue * 114) / 1000;
}
