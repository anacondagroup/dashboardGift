import { createSelector } from 'reselect';
import { pipe } from 'ramda';

import { IRootState } from '../../../store/root.types';
import { ActivateCampaignRoutes, ActivateModes } from '../routePaths';

import { getRestrictedGiftTypesIds } from './steps/gift/gift.selectors';
import { getGiftTypes } from './entities/giftTypes/giftTypes.selectors';

export const getMarketplaceGiftTypeNames = createSelector(
  getGiftTypes,
  getRestrictedGiftTypesIds,
  (giftTypes, restrictedIds) =>
    giftTypes
      .filter(item => !restrictedIds.includes(item.id) && !item.isTeamRestricted && item.countryIds.length > 0)
      .map(item => item.name),
);

const getRouterState = (state: IRootState) => state.router;
const getCurrentPath = pipe(getRouterState, state => state?.location?.pathname);

export const getActivateModuleParams = createSelector(getCurrentPath, path => {
  const params = ActivateCampaignRoutes.matchBasePath(path);
  if (!params) {
    return {
      campaignId: NaN,
      isBuilderMode: false,
      isEditorMode: false,
      mode: '' as ActivateModes,
    };
  }
  return {
    ...params,
    campaignId: Number(params.campaignId),
    isBuilderMode: params?.mode === ActivateModes.Builder,
    isEditorMode: params?.mode === ActivateModes.Editor,
  };
});
