import localForage from 'localforage';

export function storeToken(key, token) {
  return new Promise((resolve, reject) => {
    localForage.setItem(key, token)
    .then(() => resolve('Token Stored'))
    .catch((err) => reject(err));
  });
}

export function getToken(key) {
  return new Promise((resolve, reject) => {
    localForage.getItem(key)
    .then((token) => resolve(token))
    .catch((error) => reject(error));
  });
}

export function removeToken(key) {
  return new Promise((resolve, reject) => {
    localForage.removeItem(key)
    .then((token) => resolve(token))
    .catch((error) => reject(error));
  });
}

export function storeChunkWithToken(arrayData) {
  return new Promise((resolve, reject) => {
    const arrayId = [];
    if (!arrayData) reject(new Error('Array Data Missing'));
    for (let iter = 0; iter < arrayData.length; iter++) {
      localForage.setItem(arrayData[iter]._id, (arrayData[iter])); // eslint-disable-line
      arrayId.push(arrayData[iter]._id); // eslint-disable-line
    }
    resolve(arrayId);
  });
}

export function removeChunkWithArray(arrayData) {
  return new Promise((resolve, reject) => {
    const actionsArray = [];
    for (let iter = 0; iter < arrayData.length; iter++) {
      actionsArray.push(localForage.removeItem(arrayData[iter]));
    }
    Promise.all(actionsArray).then(() => {
      resolve('Done!');
    })
    .catch((err) => reject(err));
  });
}

export function fetchChunkData(list) {
  return new Promise((resolve) => {
    const actionsArray = [];
    for (let i = 0; i < list.length; i++) {
      actionsArray.push(localForage.getItem(list[i]));
    }
    Promise.all(actionsArray).then((data) => {
      resolve(data);
    });
  });
}

export function getStoreLength() {
  return new Promise((resolve, reject) => {
    localForage.length().then((length) => resolve(length)).catch((errors) => reject(errors));
  });
}

export function createStore(storeName) {
  return localForage.createInstance({
    name: storeName,
  });
}

export function clearStore() {
  return new Promise((resolve, reject) => {
    localForage.clear().then(() => resolve('done')).catch((err) => reject(err));
  });
}

export function appendDataWithtoken(token, data) {
  return new Promise((resolve, reject) => {
    getToken(token)
    .then((retrivedData) => {
      storeToken(token, retrivedData.concat(data)).then(() => resolve('done!'));
    })
    .catch((err) => reject(err));
  });
}
