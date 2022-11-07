import { INVITATIONS_AMOUNT } from './invitations.types';

export const getInvitations = () => ({
  type: INVITATIONS_AMOUNT.REQUEST,
});

export const getInvitationsSuccess = amount => ({
  type: INVITATIONS_AMOUNT.SUCCESS,
  payload: amount,
});

export const getInvitationsFailed = () => ({
  type: INVITATIONS_AMOUNT.FAIL,
});
