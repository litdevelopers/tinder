import { take, call, put, select, fork, cancel } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { LOCATION_CHANGE } from 'react-router-redux';
import { AUTH_URL } from 'global_constants';

import {
  FETCH_DATA,
  FETCH_UPDATES,
  REHYDRATE_MATCHES,
  REHYDRATE_MATCHES_SUCCESS,
  CHECK_NOTIFICATION_PERMISSIONS
} from './constants';

import {
  fetchDataSuccess,
  fetchDataError,
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
import { storeToken, getToken, storeChunkWithToken, fetchChunkData } from 'utils/operations';
import { requestNotificationPermissions, createNotification } from 'utils/notifications';


function* getUserData() {
  const authToken = yield select(selectAuthToken());
  const postURL = `${AUTH_URL}/tinder/user`;
  try {
    const data = yield call(postRequest, postURL, { authToken });
    if (data.status === 200) {
      yield put(fetchDataSuccess('user', data.data.user));
      yield put(fetchDataSuccess('rating', data.data.rating));
    }
  } catch (error) {
    yield put(fetchDataError(error));
    yield put((newNotification(error)));
    yield put(newNotificationAdded());
  }
}

function* parseSyncData(data) {
  const matchesList = yield getToken('matchesList');
  if (data.data.matches.length !== 0 && matchesList) { // eslint-disable-line
    /*
      *One is that the user is on the matches page, and we push to reducer with saga watcher
      *Two is the user is not on the matches page, and we push to indexdb for fetch
      *Cases for new Messages and likes on messages too
      *Flush messages first
      */
    const messageUpdates = data.data.matches.filter((each) => each.is_new_message);
    const matchUpdates = data.data.matches.filter((each) => !each.is_new_message);
    const notifications = [];
    if (messageUpdates.length !== 0) {
      console.warn('New message Updates');
      const idList = messageUpdates.map((each) => each._id);
      const dataToBeMutated = yield fetchChunkData(idList);
      const selfID = yield select(selectUserID());
      if (!dataToBeMutated) return;
      let iterator = 0;
      for (;iterator < idList.length; iterator++) {
        let inneriter = 0;
        for (;inneriter < messageUpdates[iterator].messages.length; inneriter++) {
          const { from, _id } = messageUpdates[iterator].messages[inneriter];
          if (from !== selfID && dataToBeMutated[iterator].messages.map((each) => each._id).indexOf(_id) === -1) {
            dataToBeMutated[iterator].messages.push(messageUpdates[iterator].messages[inneriter]);
          }
        }

        dataToBeMutated[iterator].last_activity_date = messageUpdates[iterator].last_activity_date;
      }
      // We should probably update the matches list too. I think new messages then new matches.
      yield storeChunkWithToken(dataToBeMutated);
      yield storeToken('matchesList', idList.concat(matchesList.filter((each) => idList.indexOf(each) === -1)));
    }
    if (matchUpdates.length !== 0) {
      console.warn('New Match in incoming action');
      const currentMatchesList = yield getToken('matchesList');
      if (currentMatchesList) { // If the user didn't start storing data locally yet, don't flush to indexD
        const filteredMatchUpdates = matchUpdates.filter((each) => currentMatchesList.indexOf(each.id) === -1);
        const newFilteredMatchesList = yield storeChunkWithToken(filteredMatchUpdates);
        filteredMatchUpdates.forEach((each) => notifications.push(each.person._id));
        yield storeToken('matchesList', newFilteredMatchesList.concat(currentMatchesList));
      }
    }
    if (notifications.length !== 0) {
      yield put(pushNewNotification(notifications));
      yield put(shouldReloadData());
      const notificationsPermission = yield getToken('notificationsAllowed');
      if(notificationsPermission) {
        createNotification('Check out your new matches and messages in lit.', null, "New updates in Tinder!");
      }
    }
  }
  yield call(storeMetadataAction);
}


export function* tinderBackgroundSync() {
  try {
    while (true) { // eslint-disable-line
      const authToken = yield select(selectAuthToken());
      const postURL = `${AUTH_URL}/tinder/updatesnew`;
      yield call(delay, 5000);
      try {
        const data = yield call(postRequest, postURL, { authToken });
        // TODO: Support more than matches
        yield call(parseSyncData, data);
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

function* storeMetadataAction() {
  yield storeToken('last_activity_date', new Date().toISOString());
  yield put(storeMetadataSuccess());
}

function* rehydrateMatchesAction() {
  const authToken = yield select(selectAuthToken());
  const postURL = `${AUTH_URL}/tinder/updatesnew`;
  const lastActivityDate = yield getToken('last_activity_date');

  try {
    const data = yield call(postRequest, postURL, { authToken, lastActivityDate });
    yield call(parseSyncData, data);
    yield put(rehydrateMatchesSuccess());
    yield fork(tinderBackgroundSync);
  } catch (error) {
    yield put(rehydrateMatchesError(error));
    yield put((newNotification(error)));
    yield put(newNotificationAdded());
  }
}

function* getDataFetchWatcher() {
  while (true) {
    const { payload } = yield take(FETCH_DATA);
    switch (payload) {
      case 'USER_DATA':
        yield fork(getUserData);
        break;
      default:
        return;
    }
  }
}

function* checkNotificationPermissionsAction() {
  const permissions = yield requestNotificationPermissions();
  yield storeToken('notificationsAllowed', permissions);
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
  yield take(REHYDRATE_MATCHES_SUCCESS);
  yield cancel(rehydrateMatchesWatch);
}

// All sagas to be loaded
export default [
  dashboardSaga,
];

