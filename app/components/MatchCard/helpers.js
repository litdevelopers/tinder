function getCurrentYear() {
  return new Date().getFullYear();
}

export function getAge(dateString) {
  return getCurrentYear() - new Date(dateString).getFullYear();
}
