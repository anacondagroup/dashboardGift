import { pipe } from 'ramda';

import { IRootState } from '../../../../../store/root.types';

const getCreateCampaignState = (state: IRootState) => state.settings.campaign.createCampaign;

export const getIsInProgress = pipe(getCreateCampaignState, state => state.isLoading);
export const getErrors = pipe(getCreateCampaignState, state => state.errors);
