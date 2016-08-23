import {
  GLOBAL_NOTIFICATION_ADDED,
  GLOBAL_NOTIFICATION_HANDLED,
  GLOBAL_NOTIFICATION_PUSHED,
  GLOBAL_NOTIFICATION_RECEIVED,
  NOTIFICATION_MANUAL_REMOVE,
} from './constants';

export function dismissNotification() {
  return {
    type: NOTIFICATION_MANUAL_REMOVE,
  };
}

export function newNotification(data) {
  return {
    type: GLOBAL_NOTIFICATION_ADDED,
    payload: data,
  };
}

export function handledNotification() {
  return {
    type: GLOBAL_NOTIFICATION_HANDLED,
  };
}

export function pushNotification(data) {
  return {
    type: GLOBAL_NOTIFICATION_PUSHED,
    payload: data,
  };
}

export function newNotificationAdded() {
  return {
    type: GLOBAL_NOTIFICATION_RECEIVED,
  };
}
