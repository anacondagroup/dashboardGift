import { pipe, prop, propEq } from 'ramda';
import { createSelector } from 'reselect';
import { StateStatus } from '@alycecom/utils';

import { IRootState } from '../../../../../store/root.types';

import { TGiftInvitationMethodsState, giftInvitationMethodsAdapter } from './invitationMethods.reducer';
import { getIsInvitationMethodPermitted } from './invitationMethods.helpers';

const getGiftInvitationMethodsState = (state: IRootState): TGiftInvitationMethodsState =>
  state.settings.campaign.invitationMethods;

const selectors = giftInvitationMethodsAdapter.getSelectors(getGiftInvitationMethodsState);

export const getIsLoading = pipe(getGiftInvitationMethodsState, propEq('status', StateStatus.Pending));
export const getIsLoaded = pipe(getGiftInvitationMethodsState, propEq('status', StateStatus.Fulfilled));

export const getGiftInvitationMethods = selectors.getAll;
export const getGiftInvitationMethodsMap = selectors.getEntities;
export const getGIftInvitationMethodIds = selectors.getIds;

export const getSelectedGiftInvitationMethodNames = createSelector(getGiftInvitationMethods, methods =>
  methods.filter(getIsInvitationMethodPermitted).map(prop('label')).join(', '),
);
