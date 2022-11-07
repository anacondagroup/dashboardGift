import { createSelector } from 'reselect';
import { StateStatus } from '@alycecom/utils';

import { IRootState } from '../../../../../../../store/root.types';
import { ICampaignListItem } from '../../../../campaigns/campaigns.types';

import { TActiveOneToManyCampaignsState } from './activeOneToManyCampaigns.reducer';

export const getActiveOneToManyCampaignsState = (state: IRootState): TActiveOneToManyCampaignsState =>
  state.settings.organisation.integrations.workato.activeOneToManyCampaigns;

export const getIsLoadingWorkatoAutocompleteOptionsByIdentifier = (
  autocompleteIdentifier: string,
): ((state: IRootState) => boolean) =>
  createSelector(getActiveOneToManyCampaignsState, state =>
    state[autocompleteIdentifier] ? state[autocompleteIdentifier].status === StateStatus.Pending : false,
  );

export const getWorkatoAutocompleteOptionsByIdentifier = (
  autocompleteIdentifier: string,
): ((state: IRootState) => ICampaignListItem[]) =>
  createSelector(getActiveOneToManyCampaignsState, state =>
    state[autocompleteIdentifier] ? state[autocompleteIdentifier].campaigns : [],
  );
