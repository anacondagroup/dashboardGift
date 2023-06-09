import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { ICampaign } from '../../../store/campaigns/campaigns.types';
import { CAMPAIGN_TYPES } from '../../../constants/campaignSettings.constants';
import {
  duplicate1ToManyCampaign,
  duplicateCampaign,
  duplicateProspectingCampaign,
} from '../store/breakdowns/campaignsManagement/campaignsBreakdown/campaignsBreakdown.actions';
import { ICampaignBreakdownListItem } from '../store/breakdowns/campaignsManagement/campaignsBreakdown/campaignsBreakdown.types';

export type ICampaignParam = Pick<ICampaign | ICampaignBreakdownListItem, 'id' | 'type'>;

export type TUseDuplicateCampaignValue = (campaign: ICampaignParam, teamId?: number | null) => void;

export const useDuplicateCampaign = (): TUseDuplicateCampaignValue => {
  const dispatch = useDispatch();

  return useCallback(
    (campaign: ICampaignParam, teamId?: number | null) => {
      if (campaign.type === CAMPAIGN_TYPES.STANDARD) {
        dispatch(duplicateCampaign.pending({ id: campaign.id, teamId }));
        return;
      }

      if (campaign.type === CAMPAIGN_TYPES.PROSPECTING) {
        dispatch(duplicateProspectingCampaign.pending({ id: campaign.id }));
      }

      if (campaign.type === CAMPAIGN_TYPES.ACTIVATE) {
        dispatch(duplicate1ToManyCampaign.pending({ id: campaign.id }));
      }
    },
    [dispatch],
  );
};
