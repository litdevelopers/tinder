/* eslint no-underscore-dangle: 1 */

import { take, call, put, select, actionChannel, fork, cancel } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { AUTH_URL } from 'global_constants';
import { fetchedRecommendationsWithPrefs } from 'containers/Dashboard/actions';
import { pushNewNotification } from 'containers/Messages/actions';
import { selectAuthToken } from 'containers/Auth/selectors';
import { selectUserID } from 'containers/Dashboard/selectors';
import { postRequest } from 'utils/request';


import {
  LIKE_PERSON,
  PASS_PERSON,
  SUPERLIKE_PERSON,
  FETCH_RECOMMENDATIONS,
  FETCH_RECOMMENDATIONS_LOCALLY,
  DUMP_ALL_RECOMMENDATIONS_START,
  DUMP_ALL_RECOMMENDATIONS_SUCCESS,
} from './constants';

import {
  newNotification,
  newNotificationAdded,
} from 'containers/Notification/actions';

import {
  likePersonSuccess,
  likePersonError,
  passPersonError,
  passPersonSuccess,
  superLikePersonSuccess,
  superLikePersonError,
  detailPerson,
  fetchRecommendationsError,
  fetchRecommendationsSuccess,
  removeRecommendation,
  dumpAllRecommendations,
  dumpAllRecommendationsSuccess,
  sortLikes,
  newMatch,
} from './actions';

import {
  selectRecommendationsList,
  selectLimitedRecommendationsList,
  selectShouldUpdate,
  selectCurrentID,
} from './selectors';

import {
  storeChunkWithToken,
  fetchChunkData,
  storeToken,
  getToken,
} from 'utils/storage';

function* fetchRecommendationsAction() {
  const authToken = yield select(selectAuthToken());
  const postURL = `${AUTH_URL}/tinder/recommendations`;
  try {
    const data = yield call(postRequest, postURL, { authToken });
    if (data.status === 200 && data.data.length !== 0 && typeof (data.data) === 'object') {
      const currentMatches = yield select(selectRecommendationsList());
      if (!currentMatches) {
        yield put(fetchRecommendationsSuccess(data.data));
      } else {
        const currentMatchesIdList = currentMatches.map((each) => each._id);
        const filteredPotentialMatches = [];
        const filteredNewMatches = [];

        for (let matchesIter = 0; matchesIter < data.data.length; matchesIter++) {
          if (currentMatchesIdList.indexOf(data.data[matchesIter]._id) !== -1) {
            filteredPotentialMatches.push(data.data[matchesIter]);
          } else if (currentMatchesIdList.indexOf(data.data[matchesIter]._id) === -1) {
            filteredNewMatches.push(data.data[matchesIter]);
          }
        }

        yield put(sortLikes(filteredPotentialMatches));
        yield put(fetchRecommendationsSuccess(currentMatches.concat(filteredNewMatches)));
      }
    } else {
      yield put(newNotification("We're having a little trouble retrieving your matches."));
      yield put(newNotificationAdded());
    }
  } catch (error) {
    yield put(fetchRecommendationsError(error));
    yield put(newNotification(error));
    yield put(newNotificationAdded());
  }
}

function* newMatchAction(data) {
  yield put(newNotification((`New Match with ${data.name}!`)));
  yield put(newNotificationAdded());
}

function* actionPerson(action, type, removePerson) {
  const userToken = yield select(selectAuthToken());
  const postURL = `${AUTH_URL}/tinder/${type}`;
  let removedPerson = false;

  if (type === 'pass' && removePerson) {
    yield put(removeRecommendation(action.id));
    removedPerson = true;
  }

  try {
    const data = yield call(postRequest, postURL, { userToken, userID: action.id, hash: action.hash });
    if (data.status === 200) {
      if (removePerson && !removedPerson) {
        yield put(removeRecommendation(action.id));
      }
      const selectedID = yield select(selectCurrentID());
      if (selectedID === action.id) yield put(detailPerson(''));
      if (type === 'like') yield put(likePersonSuccess({ id: action.id, action: 'like' }));
      if (type === 'superlike') yield put(superLikePersonSuccess({ id: action.id, action: 'superlike' }));
      if (type === 'pass') yield put(passPersonSuccess({ id: action.id, action: 'pass' }));
      if ((type === 'like' || type === 'superlike') && data.data.match && removePerson) {
        const match = data.data.match;
        const userID = yield select(selectUserID());
        const currentMatchesList = yield getToken(`matchesList_${userID}`);

        if (currentMatchesList) {
          const selfId = yield select(selectUserID());
          const fetchUserURL = `${AUTH_URL}/tinder/getuser`;
          const userData = yield call(postRequest, fetchUserURL, { userToken, userId: match.participants.filter((each) => each !== selfId)[0] });
          match.person = userData.data.results;
          yield newMatchAction(userData.data.results);
          yield storeToken(match._id, match);
          yield storeToken(`matchesList_${userID}`, [match._id].concat(currentMatchesList));
          yield put(pushNewNotification([{ id: userData.data.results._id }]));
          yield put(newMatch(match.person.name, match._id));
        }
      }
    }
  } catch (error) {
    if (type === 'like') yield put(likePersonError(error));
    if (type === 'superlike') yield put(superLikePersonError(error));
    if (type === 'pass') yield put(passPersonError(error));
    yield call(handleError, type, error);
  }
}

function* handleError(type, error) {
  let dispatchedError;
  if (type === 'like' || type === 'superlike') {
    dispatchedError = `We just had trouble ${type.split('like')[0]}liking a recommendation. Try again later!`;
  } else {
    dispatchedError = error;
  }
  yield put(newNotification(dispatchedError));
  yield put(newNotificationAdded());
}

function* dataDumpAction() {
  const data = yield select(selectLimitedRecommendationsList());
  if (data !== null && data.length !== 0) {
    yield put(dumpAllRecommendations());
    const userID = yield select(selectUserID());
    const idList = yield storeChunkWithToken(data);
    yield storeToken(`recommendationsList_${userID}`, idList);
    yield put(dumpAllRecommendationsSuccess());
  }
}

export function* loadLocalData() {
  const userID = yield select(selectUserID());
  const recommendationsList = yield getToken(`recommendationsList_${userID}`);
  const shouldUpdate = yield select(selectShouldUpdate());
  if (recommendationsList && !shouldUpdate) {
    const matchesList = yield getToken(`recommendationsList_${userID}`);
    const matches = yield fetchChunkData(matchesList);
    yield put(fetchRecommendationsSuccess(matches));
  } else {
    if (shouldUpdate) yield put(dumpAllRecommendations());
    yield put(fetchedRecommendationsWithPrefs());
    for (let fetchIter = 0; fetchIter < 3; fetchIter++) {
      yield call(fetchRecommendationsAction);
    }
  }
}


export function* actionWatcher(removePerson = true) {
  const actionWatch = yield actionChannel([LIKE_PERSON, SUPERLIKE_PERSON, PASS_PERSON]);
  while (true) { // eslint-disable-line
    const action = yield take(actionWatch);
    if (action.type === LIKE_PERSON) yield actionPerson(action, 'like', removePerson);
    if (action.type === SUPERLIKE_PERSON) yield actionPerson(action, 'superlike', removePerson);
    if (action.type === PASS_PERSON) yield actionPerson(action, 'pass', removePerson);
  }
}

export function* recommendationsFetchWatcher() {
  while (yield take(FETCH_RECOMMENDATIONS)) {
    yield call(fetchRecommendationsAction);
  }
}

export function* dataDumpWatcher() {
  while (yield take(DUMP_ALL_RECOMMENDATIONS_START)) {
    yield call(dataDumpAction);
  }
}

export function* dataLoadLocalWatcher() {
  while (yield take(FETCH_RECOMMENDATIONS_LOCALLY)) {
    yield call(loadLocalData);
  }
}


export function* matchesSaga() {
  const actionWatch = yield fork(actionWatcher);
  const dataWatch = yield fork(recommendationsFetchWatcher);
  const dataDumpWatch = yield fork(dataDumpWatcher);
  const dataLoadLocalWatch = yield fork(dataLoadLocalWatcher);

  yield take(LOCATION_CHANGE);
  yield cancel(actionWatch);
  yield cancel(dataWatch);
  yield cancel(dataLoadLocalWatch);
  yield take(DUMP_ALL_RECOMMENDATIONS_SUCCESS);
  yield cancel(dataDumpWatch);
}


// All sagas to be loaded
export default [
  matchesSaga,
];
