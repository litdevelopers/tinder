function getCurrentYear() {
  return new Date().getFullYear();
}

// Subtract one because I think I've seen so many incorrect ages by one year too many
export function getAge(dateString) {
  return getCurrentYear() - new Date(dateString).getFullYear() - 1;
}

export const convertDistanceToLocal = (distance) => Math.floor(distance * 1.6);
