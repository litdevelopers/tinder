import localForage from 'localforage';

export function mergeArray(arr1, arr2, length, mapFunc) {
  const allElements = [...arr1, ...arr2];
  const filteredElements = allElements.map(mapFunc);
  if (length) return filteredElements.splice(0, length);
  return filteredElements;
}

export function storeAuthToken(key, token) {
  return new Promise((resolve, reject) => {
    localForage.setItem(key, token)
    .then(() => resolve('Token Stored'))
    .catch((err) => reject(err));
  });
}

export function getAuthToken(key) {
  return new Promise((resolve, reject) => {
    localForage.getItem(key)
    .then((token) => resolve(token))
    .catch((error) => reject(error));
  });
}
