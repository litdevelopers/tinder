/* eslint no-underscore-dangle: 1 */

import { take, call, put, select, fork, cancel } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { LOCATION_CHANGE } from 'react-router-redux';
import { AUTH_URL } from 'global_constants';

import {
  FETCH_DATA,
  REHYDRATE_MATCHES,
  REHYDRATE_MATCHES_SUCCESS,
  CHECK_NOTIFICATION_PERMISSIONS,
} from './constants';

import {
  fetchDataSuccess,
  fetchDataError,
  fetchUpdates,
  fetchUpdatesError,
  fetchUpdatesEnd,
  storeMetadataSuccess,
  rehydrateMatchesSuccess,
  rehydrateMatchesError,
} from './actions';

import {
  newNotification,
  newNotificationAdded,
} from 'containers/Notification/actions';

import {
  shouldReloadData,
  pushNewNotification,
} from 'containers/Messages/actions';

import { selectUserID } from './selectors';
import { selectAuthToken } from 'containers/Auth/selectors';
import { postRequest } from 'utils/request';

import {
  storeToken,
  getToken,
  storeChunkWithToken,
  fetchChunkData,
} from 'utils/storage';

import {
  requestNotificationPermissions,
  createNotification,
} from 'utils/notifications';

function* initializeHistoryStore() {
  const userID = yield select(selectUserID());
  const actionsHistory = yield getToken(`actionsHistory_${userID}`);
  if (!actionsHistory) {
    yield storeToken(`actionsHistory_${userID}`, []);
  }
}

function* getUserData() {
  const authToken = yield select(selectAuthToken());
  const postURL = `${AUTH_URL}/tinder/user`;
  try {
    const data = yield call(postRequest, postURL, { authToken });
    if (data.status === 200) {
      yield put(fetchDataSuccess('user', data.data.user));
      yield put(fetchDataSuccess('rating', data.data.rating));
      yield fork(initializeHistoryStore);
    }
  } catch (error) {
    yield put(fetchDataError(error));
    yield put((newNotification(error)));
    yield put(newNotificationAdded());
  }
}

function* parseNotificationData(data, type) {
  if (type === 'matches') {
    const bodyText = data.length > 1 ? `Check out your ${data.length} new matches in Tinder.` : `You matched with ${data[0].details.text}!`;
    createNotification(bodyText, data[0].details.image, `New ${data.length > 1 ? 'matches' : 'match'} from Tinder!`);
  } else if (type === 'messages') {
    const bodyText = data.length > 1 ? `Check our your ${data.length} new messages in Tinder.` : data[0].details.text;
    const titleText = data.length > 1 ? 'New messages from Tinder matches!' : `New message from ${data[0].details.name}`;
    createNotification(bodyText, data[0].details.image, titleText);
  }
}

function* parseSyncData(data, userID) {
  const matchesList = yield getToken(`matchesList_${userID}`);
  if (matchesList === null) return;

  if (data.matches.length !== 0 && matchesList) { // eslint-disable-line
    /*
      *One is that the user is on the matches page, and we push to reducer with saga watcher
      *Two is the user is not on the matches page, and we push to indexdb for fetch
      *Cases for new Messages and likes on messages too
      *Flush messages first
      */
    const permissionsAllowed = yield getToken('notificationsAllowed');
    const messageUpdates = data.matches.filter((each) => each.is_new_message);
    const matchUpdates = data.matches.filter((each) => !each.is_new_message);
    let reloadFlag = false;

    /* MATCHES NOTIFICATIONS START HERE */
    const matchNotifications = [];

    if (matchUpdates.length !== 0) {
      const currentMatchesList = yield getToken(`matchesList_${userID}`);
      if (currentMatchesList) { // If the user didn't start storing data locally yet, don't flush to indexD
        const filteredMatchUpdates = matchUpdates.filter((each) => currentMatchesList.indexOf(each.id) === -1);
        if (filteredMatchUpdates) {
          const newFilteredMatchesList = yield storeChunkWithToken(filteredMatchUpdates);
          filteredMatchUpdates.forEach((each) => {
            matchNotifications.push({
              id: each.person._id,
              type: 'match',
              details: {
                text: each.person.name,
                image: each.person.photos[0].url,
              } });
          });
          yield storeToken(`matchesList_${userID}`, newFilteredMatchesList.concat(currentMatchesList));
        }
        reloadFlag = true;
      }
    }

    /* MESSAGE NOTIFICATIONS START HERE */
    const messageNotifications = [];

    if (messageUpdates.length !== 0) {
      const idList = messageUpdates.map((each) => each._id);
      const dataToBeMutated = yield fetchChunkData(idList);
      if (!dataToBeMutated) return;
      let iterator = 0;
      for (;iterator < idList.length; iterator++) {
        let inneriter = 0;
        for (;inneriter < messageUpdates[iterator].messages.length; inneriter++) {
          const { from, _id } = messageUpdates[iterator].messages[inneriter];
          if (dataToBeMutated[iterator].messages.map((each) => each._id).indexOf(_id) === -1) {
            dataToBeMutated[iterator].messages.push(messageUpdates[iterator].messages[inneriter]);
            reloadFlag = true;
            if (from !== userID) {
              messageNotifications.push({
                id: from,
                type: 'message',
                details: {
                  name: dataToBeMutated[iterator].person.name,
                  image: dataToBeMutated[iterator].person.photos[0].url,
                  text: messageUpdates[iterator].messages[inneriter].message,
                },
              });
            }
          }
        }
        dataToBeMutated[iterator].last_activity_date = messageUpdates[iterator].last_activity_date;
      }
      // We should probably update the matches list too. I think new messages then new matches.
      yield storeChunkWithToken(dataToBeMutated);
      yield storeToken(`matchesList_${userID}`, idList.concat(matchesList.filter((each) => idList.indexOf(each) === -1)));
    }
    if (permissionsAllowed) {
      if (matchNotifications.length !== 0 && localStorage.getItem('matchesNotification')) yield call(parseNotificationData, matchNotifications, 'matches');
      if (messageNotifications.length !== 0 && localStorage.getItem('messagesNotification')) yield call(parseNotificationData, messageNotifications, 'messages');
    }

    if (reloadFlag) yield put(shouldReloadData());
    if (messageNotifications.length !== 0 || matchNotifications.length !== 0) {
      yield put(pushNewNotification([...matchNotifications, ...messageNotifications]));
    }
  }
}


export function* tinderBackgroundSync() {
  try {
    yield put(fetchUpdates());
    while (true) { // eslint-disable-line
      const authToken = yield select(selectAuthToken());
      const postURL = `${AUTH_URL}/tinder/updatesnew`;
      yield call(delay, 5000);
      try {
        const data = yield call(postRequest, postURL, { authToken });
        // TODO: Support more than matches
        if (data.status === 200) {
          const userID = yield select(selectUserID());
          yield call(parseSyncData, data.data, userID);
          yield call(storeMetadataAction, userID);
        }
      } catch (error) {
        yield put(fetchUpdatesError(error));
        yield put((newNotification(error)));
        yield put(newNotificationAdded());
      }
    }
  } finally {
    yield put(fetchUpdatesEnd());
  }
}

function* storeMetadataAction(userID) {
  if (!localStorage.getItem('tinderUserID') || userID !== localStorage.getItem('tinderUserID')) {
    localStorage.setItem('tinderUserID', userID);
  }
  yield storeToken(`last_activity_date_${userID}`, new Date().toISOString());
  yield put(storeMetadataSuccess());
}

function* rehydrateMatchesAction() {
  const authToken = yield select(selectAuthToken());
  const userID = yield select(selectUserID());
  const lastActivityDate = yield getToken(`last_activity_date_${localStorage.getItem('tinderUserID')}`);
  const postURL = `${AUTH_URL}/tinder/updatesnew`;

  try {
    if (lastActivityDate) {
      const data = yield call(postRequest, postURL, { authToken, lastActivityDate });
      yield call(parseSyncData, data, userID);
      yield put(rehydrateMatchesSuccess());
    }
    yield fork(tinderBackgroundSync);
  } catch (error) {
    yield put(rehydrateMatchesError(error));
    yield put((newNotification(error)));
    yield put(newNotificationAdded());
  }
}


function* checkNotificationPermissionsAction() {
  const currentPermissions = yield getToken('notificationsAllowed');
  const permissions = yield requestNotificationPermissions();
  if (permissions && currentPermissions === null) {
    yield storeToken('notificationsAllowed', permissions);
    localStorage.setItem('matchesNotification', permissions);
    localStorage.setItem('messageNotification', permissions);
    localStorage.setItem('messagesLikeNotification', permissions);
  }
}

function* getDataFetchWatcher() {
  while (yield take(FETCH_DATA)) {
    yield fork(getUserData);
  }
}

function* rehydrateMatchesWatcher() {
  while (yield take(REHYDRATE_MATCHES)) {
    yield fork(rehydrateMatchesAction);
  }
}

function* notificationCheckWatcher() {
  while (yield take(CHECK_NOTIFICATION_PERMISSIONS)) {
    yield fork(checkNotificationPermissionsAction);
  }
}

// Individual exports for testing
export function* dashboardSaga() {
  const rehydrateMatchesWatch = yield fork(rehydrateMatchesWatcher);
  const dataFetchWatcher = yield fork(getDataFetchWatcher);
  const notificationCheckWatch = yield fork(notificationCheckWatcher);
  // yield fork(getUpdatesWatcher);


  yield take(LOCATION_CHANGE);
  yield cancel(dataFetchWatcher);
  yield cancel(notificationCheckWatch);
  yield take(REHYDRATE_MATCHES_SUCCESS);
  yield cancel(rehydrateMatchesWatch);
}

// All sagas to be loaded
export default [
  dashboardSaga,
];

