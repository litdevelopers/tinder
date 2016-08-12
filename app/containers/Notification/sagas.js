import { takeLatest } from 'redux-saga';
import { take, call, put, select, fork, cancel, actionChannel } from 'redux-saga/effects';

import {
  GLOBAL_ERROR_HANDLED,
  GLOBAL_ERROR_RECEIVED,
} from './constants';


export function* notificationSaga() {
  yield actionChannel([GLOBAL_ERROR_RECEIVED]);
}

export default [
  notificationSaga,
];
