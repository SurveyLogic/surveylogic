export function moveMultipleItemsInArray<T>(
  array: T[],
  indexOrIndexes: number | number[],
  newIndex: number
) {
  const indexes = Array.isArray(indexOrIndexes)
    ? indexOrIndexes
    : [indexOrIndexes];
  const insertBefore = array[newIndex + (newIndex < indexes[0] ? 0 : 1)];
  const itemsToBeMoved = indexes.map(i => array[i]);

  // in original sequence order, check for presence in the removal
  // list, *and* remove them from the original array
  const moved = [];
  for (let i = 0; i < array.length; ) {
    const value = array[i];
    if (itemsToBeMoved.indexOf(value) >= 0) {
      moved.push(value);
      array.splice(i, 1);
    } else {
      ++i;
    }
  }

  // find the new index of the insertion point
  let insertionIndex = array.indexOf(insertBefore);
  if (insertionIndex < 0) {
    insertionIndex = array.length;
  }

  // and add the elements back in
  array.splice(insertionIndex, 0, ...moved);

  return array;
}
