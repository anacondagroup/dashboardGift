import { combineReducers } from 'redux';

import previewReducer from './import/import.reducer';
import { BULK_CREATE_GET_TEAMS_REQUEST, BULK_CREATE_GET_TEAMS_SUCCESS } from './bulkCreateContacts.types';

export const initialState = {
  teams: [],
  isLoading: false,
};
const teamsReducer = (state = initialState, action) => {
  switch (action.type) {
    case BULK_CREATE_GET_TEAMS_REQUEST:
      return { ...state, isLoading: true };
    case BULK_CREATE_GET_TEAMS_SUCCESS:
      return { ...state, isLoading: false, teams: action.payload };
    default:
      return state;
  }
};

export default combineReducers({
  teams: teamsReducer,
  preview: previewReducer,
});
