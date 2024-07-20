import {clamp} from '../number/clamp';

export function moveItemInArray<T = any>(
  array: T[],
  fromIndex: number,
  toIndex: number
): T[] {
  const from = clamp(fromIndex, 0, array.length - 1);
  const to = clamp(toIndex, 0, array.length - 1);

  if (from === to) {
    return array;
  }

  const target = array[from];
  const delta = to < from ? -1 : 1;

  for (let i = from; i !== to; i += delta) {
    array[i] = array[i + delta];
  }

  array[to] = target;

  return array;
}
