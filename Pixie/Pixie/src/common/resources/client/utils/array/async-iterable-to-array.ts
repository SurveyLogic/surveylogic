export async function asyncIterableToArray<T>(
  iterator: AsyncIterable<T>
): Promise<T[]> {
  const items: T[] = [];
  for await (const item of iterator) {
    items.push(item);
  }
  return items;
}
