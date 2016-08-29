import {
  LIKE_PERSON,
  PASS_PERSON,
  SUPERLIKE_PERSON,
} from '../containers/Recommendations/constants';

import { shiftDataWithToken } from './storage';

const recordedActions = [
  LIKE_PERSON,
  PASS_PERSON,
  SUPERLIKE_PERSON,
];

const actionLoggerMiddleware = () => next => action => {
  if (recordedActions.indexOf(action.type) !== -1) {
    shiftDataWithToken(`actionsHistory_${localStorage.getItem('tinderUserID')}`, action);
  }
  return next(action);
};

export default actionLoggerMiddleware;
