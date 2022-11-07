import { UPDATE_STATE_UPDATED_TIME } from './stateUpdatedTime.types';

export default (state = 0, action) => {
  switch (action.type) {
    case UPDATE_STATE_UPDATED_TIME:
      return Date.now();
    default:
      return state;
  }
};
