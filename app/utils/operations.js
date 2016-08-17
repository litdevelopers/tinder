import localForage from 'localforage';

function getCurrentYear() {
  return new Date().getFullYear();
}

// Subtract one because I think I've seen so many incorrect ages by one year too many
export function getAge(dateString) {
  return getCurrentYear() - new Date(dateString).getFullYear() - 1;
}

export function parsePingTime(dateString) {
  if (!dateString) return 'Active some time ago';
  const currentDate = new Date().getTime();
  const pingTimeDifferenceMinutes = (currentDate - new Date(dateString).getTime()) / 60000;

  if (pingTimeDifferenceMinutes < 60) {
    const minutes = pingTimeDifferenceMinutes.toFixed(0);
    return `active ${minutes} minute${Number(minutes) === 1 ? '' : 's'} ago`;
  } else if (pingTimeDifferenceMinutes / 60 < 24) {
    const hours = (pingTimeDifferenceMinutes / 60).toFixed(0);
    return `active ${hours} hour${Number(hours) === 1 ? '' : 's'} ago`;
  }
  const days = (pingTimeDifferenceMinutes / 1440).toFixed(0);
  return `active ${days} day${Number(days) === 1 ? '' : 's'} ago`;
}

export const convertDistanceToLocal = (distance) => Math.floor(distance * 1.6);

export function mergeArray(arr1, arr2, length, mapFunc) {
  const allElements = [...arr1, ...arr2];
  const filteredElements = allElements.map(mapFunc);
  if (length) return filteredElements.splice(0, length);
  return filteredElements;
}

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

export function matchesSortByDistance(a, b) {
  return a.distance_mi - b.distance_mi;
}

export function matchesSortByLastActive(a, b) {
  return new Date(b.ping_time).getTime() - new Date(a.ping_time).getTime();
}

export function matchesSortByYoungest(a, b) {
  return getAge(a.birth_date) - getAge(b.birth_date);
}

export function matchesSortByOldest(a, b) {
  return getAge(b.birth_date) - getAge(a.birth_date);
}

export function messagesSortByRecent(a, b) {
  return new Date(b.last_activity_date).getTime() - new Date(a.last_activity_date).getTime();
}
