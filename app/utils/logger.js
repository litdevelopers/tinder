import {
  LIKE_PERSON,
  PASS_PERSON,
  SUPERLIKE_PERSON,
  NEW_MATCH,
} from '../containers/Recommendations/constants';

import { shiftDataWithToken } from './storage';

const recordedActions = [
  LIKE_PERSON,
  PASS_PERSON,
  SUPERLIKE_PERSON,
  NEW_MATCH,
];

const actionLoggerMiddleware = () => next => action => {
  if (recordedActions.indexOf(action.type) !== -1) {
    shiftDataWithToken(`actionsHistory_${localStorage.getItem('tinderUserID')}`, action);
  }
  return next(action);
};

export default actionLoggerMiddleware;
