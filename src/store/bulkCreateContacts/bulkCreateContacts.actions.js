import { BULK_CREATE_GET_TEAMS_REQUEST, BULK_CREATE_GET_TEAMS_SUCCESS } from './bulkCreateContacts.types';

export const getAvailableTeams = () => ({
  type: BULK_CREATE_GET_TEAMS_REQUEST,
});

export const getAvailableTeamsSuccess = campaigns => ({
  type: BULK_CREATE_GET_TEAMS_SUCCESS,
  payload: campaigns,
});
