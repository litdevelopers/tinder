import { getToken } from 'utils/operations';

export function createNotification(body, icon, title) {
  var options = {
    body,
    icon,
  };
  var n = new Notification(title,options);
}

export function requestNotificationPermissions() {
  return new Promise((resolve, reject) => {
  	Notification.requestPermission()
  	.then((permissions) => resolve(permissions === 'granted' ? true: false))
  	.catch((err) => {
      reject(err);
  	});
  });	
}