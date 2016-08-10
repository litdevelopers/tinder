export function mergeArray(arr1, arr2, length, mapFunc) {
  const allElements = [...arr1, ...arr2];
  const filteredElements = allElements.map(mapFunc);
  console.log(filteredElements);
  if (length) return filteredElements.splice(0, length);
  return filteredElements;
}
