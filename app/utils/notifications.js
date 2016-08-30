export function createNotification(body, icon, title) {
  if (title.match(/match/) && window.location.pathname === '/dashboard/recommendations') return;
  const n = new Notification(title, { body, icon });
  setTimeout(n.close.bind(n), 4000);
}

export function requestNotificationPermissions() {
  return new Promise((resolve, reject) => {
    Notification.requestPermission()
    .then((permissions) => resolve(permissions === 'granted'))
    .catch((err) => {
      reject(err);
    });
  });
}
