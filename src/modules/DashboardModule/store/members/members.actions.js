import { MEMBERS_LOAD_REQUEST, MEMBERS_LOAD_SUCCESS, MEMBERS_LOAD_FAILS } from './members.types';

export const membersLoadRequest = teamId => ({
  type: MEMBERS_LOAD_REQUEST,
  payload: teamId,
});

export const membersLoadSuccess = members => ({
  type: MEMBERS_LOAD_SUCCESS,
  payload: members,
});

export const membersLoadFail = error => ({
  type: MEMBERS_LOAD_FAILS,
  payload: error,
});
