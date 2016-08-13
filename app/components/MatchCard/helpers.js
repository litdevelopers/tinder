function getCurrentYear() {
  return new Date().getFullYear();
}

// Subtract one because I think I've seen so many incorrect ages by one year too many
export function getAge(dateString) {
  return getCurrentYear() - new Date(dateString).getFullYear() - 1;
}

export function parsePingTime(dateString) {
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
