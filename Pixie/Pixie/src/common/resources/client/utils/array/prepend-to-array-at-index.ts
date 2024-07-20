export function prependToArrayAtIndex<T>(array: T[], toAdd: T[], index = 0): T[] {
  const copyOfArray = [...array];
  const tail = copyOfArray.splice(index + 1);
  return [...copyOfArray, ...toAdd, ...tail];
}
