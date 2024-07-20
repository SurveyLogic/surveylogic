export function removeEmptyValuesFromObject<T extends Record<string, unknown>>(
  obj: T
): T {
  const copy = {...obj};
  Object.keys(copy).forEach(key => {
    if (copy[key] == null || copy[key] === '') {
      delete copy[key];
    }
  });
  return copy;
}
