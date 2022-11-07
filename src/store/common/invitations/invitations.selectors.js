import * as R from 'ramda';

export const getInvitationsAmount = R.path(['common', 'invitations', 'amount']);

export const getIsInvitationsLoaded = R.pathEq(['common', 'invitations', 'status'], 'fulfilled');
