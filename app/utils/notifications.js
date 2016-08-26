export function createNotification(body, icon, title) {
  const n = new Notification(title, { body, icon });
  setTimeout(n.close.bind(n), 2000);
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
