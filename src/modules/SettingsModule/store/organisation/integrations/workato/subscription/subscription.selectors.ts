import { equals, pipe, prop } from 'ramda';
import { StateStatus } from '@alycecom/utils';
import { createSelector } from 'reselect';

import { IRootState } from '../../../../../../../store/root.types';
import { getIsCurrentIntegrationActive } from '../recipes/recipes.selectors';

import { TSubscriptionState } from './subscription.reducer';

const getSubscriptionState = (state: IRootState): TSubscriptionState =>
  state.settings.organisation.integrations.workato.subscription;
const getSubscriptionStatus = pipe(getSubscriptionState, prop('status'));

export const getIsSubscriptionLoading = pipe(getSubscriptionStatus, equals(StateStatus.Pending));
export const getSubscription = pipe(getSubscriptionState, state => state.data);
export const getIsActiveIntegrationsLimitExceeded = createSelector(getSubscription, subscription => {
  if (!subscription) {
    return true;
  }
  return subscription.allowed - subscription.enabled === 0;
});

export const getIsRecipeRunnable = createSelector(
  getIsActiveIntegrationsLimitExceeded,
  getIsCurrentIntegrationActive,
  (isActiveIntegrationsLimitExceeded, isIntegrationActive) =>
    isActiveIntegrationsLimitExceeded ? isIntegrationActive : true,
);
