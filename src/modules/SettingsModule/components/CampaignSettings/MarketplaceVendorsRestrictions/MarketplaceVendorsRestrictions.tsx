import React, { useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { SettingsItem } from '@alycecom/modules';
import * as R from 'ramda';

import MarketplaceVendorsRestrictionsTable from '../../MarketplaceVendorsRestrictionsTable/MarketplaceVendorsRestrictionsTable';
import {
  getGiftInvitesVendors,
  getIsGiftInvitesVendorsLoading,
} from '../../../store/campaign/giftInvites/giftInvites.selectors';
import {
  loadCampaignVendorsRequest,
  saveCampaignVendorRestrictionsRequest,
  setRestrictedCampaignVendors,
} from '../../../store/campaign/giftInvites/giftInvites.actions';
import { IGiftVendor } from '../../../store/campaign/giftInvites/giftInvites.types';
import { CAMPAIGN_TYPES } from '../../../../../constants/campaignSettings.constants';

interface IMarketplaceVendorsRestrictionsPropTypes {
  campaignId: number;
  campaignType: CAMPAIGN_TYPES;
  campaignName: string;
  campaignLoading: boolean;
  disabled?: boolean;
  subtitle?: string;
}

const MarketplaceVendorsRestrictions = ({
  campaignId,
  campaignType,
  campaignName,
  campaignLoading,
  subtitle,
  disabled = false,
}: IMarketplaceVendorsRestrictionsPropTypes): JSX.Element => {
  const dispatch = useDispatch();

  const giftVendors = useSelector(getGiftInvitesVendors) as Array<IGiftVendor>;
  const isLoading = useSelector(getIsGiftInvitesVendorsLoading);

  const restrictedVendors = useMemo(
    () => giftVendors.filter(type => type.is_campaign_restricted || type.is_team_restricted).length,
    [giftVendors],
  );

  useEffect(() => {
    dispatch(loadCampaignVendorsRequest(campaignId));
  }, [dispatch, campaignId]);

  const onChangeVendorRestricted = (ido: IGiftVendor, value: boolean) => {
    const getIndex = R.findIndex((vendor: IGiftVendor) => vendor.id === ido.id && vendor.type === ido.type);
    const updateItem = R.always(R.assoc('is_campaign_restricted', value));
    const updatedCampaignVendors = R.converge(R.adjust, [getIndex, updateItem, R.identity])(giftVendors);

    dispatch(setRestrictedCampaignVendors(updatedCampaignVendors));
  };

  const onCheckAll = (allNotRestricted: boolean) => {
    let updatedCampaignVendors;
    if (allNotRestricted) {
      updatedCampaignVendors = R.map((vendor: IGiftVendor) => ({ ...vendor, is_campaign_restricted: true }))(
        giftVendors,
      );
    } else {
      updatedCampaignVendors = R.map((vendor: IGiftVendor) => ({ ...vendor, is_campaign_restricted: false }))(
        giftVendors,
      );
    }
    dispatch(setRestrictedCampaignVendors(updatedCampaignVendors));
  };

  const onUpdateVendors = useCallback(() => {
    const restrictedBrandIds = giftVendors
      .filter(vendor => vendor.is_campaign_restricted && vendor.type === 'brand')
      .map(vendor => vendor.id);
    const restrictedMerchantIds = giftVendors
      .filter(vendor => vendor.is_campaign_restricted && vendor.type === 'merchant')
      .map(vendor => vendor.id);
    dispatch(
      saveCampaignVendorRestrictionsRequest({
        campaignId,
        campaignType,
        restrictedBrandIds,
        restrictedMerchantIds,
      }),
    );
  }, [dispatch, giftVendors, campaignId, campaignType]);

  return (
    <SettingsItem
      title="Gift vendors"
      description={`Set which gift vendors are allowed to be viewed and selected inside of the marketplace as well as Alyce gift suggestions (IE the brands who create or supply the gift). ${campaignName} default is currently set to`}
      isLoading={campaignLoading}
      value={`${restrictedVendors || 'No'} restricted vendors`}
      disabled={disabled}
      subtitle={subtitle}
    >
      <MarketplaceVendorsRestrictionsTable
        vendors={giftVendors}
        isLoading={isLoading}
        onChangeVendorRestricted={onChangeVendorRestricted}
        onCheckAll={onCheckAll}
        onSubmit={onUpdateVendors}
      />
    </SettingsItem>
  );
};

MarketplaceVendorsRestrictions.propTypes = {
  campaignId: PropTypes.number.isRequired,
  campaignType: PropTypes.oneOf(Object.values(CAMPAIGN_TYPES)).isRequired,
  campaignName: PropTypes.string.isRequired,
  campaignLoading: PropTypes.bool.isRequired,
};

export default MarketplaceVendorsRestrictions;
