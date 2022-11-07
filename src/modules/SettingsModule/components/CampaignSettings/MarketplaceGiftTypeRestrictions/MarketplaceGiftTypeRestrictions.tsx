import React, { useEffect, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SettingsItem } from '@alycecom/modules';

import { loadCampaignTypesRequest } from '../../../store/campaign/giftInvites/giftInvites.actions';
import { getRestrictedGiftTypesCount } from '../../../store/campaign/giftInvites/giftInvites.selectors';
import { CAMPAIGN_TYPES } from '../../../../../constants/campaignSettings.constants';
import GiftTypeRestrictionsTable from '../GiftTypeRestrictionsTable';

interface IMarketplaceGiftTypeRestrictionsPropTypes {
  teamId: number;
  campaignId: number;
  campaignType: CAMPAIGN_TYPES;
  campaignName: string;
  campaignLoading: boolean;
  disabled?: boolean;
  subtitle?: string;
}

const MarketplaceGiftTypeRestrictions = ({
  teamId,
  campaignId,
  campaignType,
  campaignName,
  campaignLoading,
  subtitle,
  disabled = false,
}: IMarketplaceGiftTypeRestrictionsPropTypes): JSX.Element => {
  const dispatch = useDispatch();

  const allRestrictedCount = useSelector(getRestrictedGiftTypesCount);

  useEffect(() => {
    dispatch(loadCampaignTypesRequest(campaignId));
  }, [dispatch, campaignId]);

  return (
    <SettingsItem
      title="Gift types"
      description={`Set which gift types are allowed to be viewed and selected inside of the marketplace as well as Alyce gift suggestions (IE Gift cards, Physical Gifts, Subscriptions, etc). ${campaignName} default is currently set to`}
      isLoading={campaignLoading}
      value={`${allRestrictedCount || 'No'} restricted types`}
      disabled={disabled}
      subtitle={subtitle}
    >
      <GiftTypeRestrictionsTable teamId={teamId} campaignId={campaignId} campaignType={campaignType} />
    </SettingsItem>
  );
};

export default memo<IMarketplaceGiftTypeRestrictionsPropTypes>(MarketplaceGiftTypeRestrictions);
