import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';

import { getMarketplaceRestrictionsVendors } from '../../../../../store/teams/giftInvites/marketplaceRestrictions/marketplaceRestrictions.selectors';
import MarketplaceVendorsRestrictionsTable from '../../../../MarketplaceVendorsRestrictionsTable/MarketplaceVendorsRestrictionsTable';
import {
  teamSettingsGiftInvitesUpdateVendorsRequest,
  teamSettingsGiftInvitesVendorsRequest,
} from '../../../../../store/teams/giftInvites/marketplaceRestrictions/marketplaceRestrictions.actions';

const TeamSettingsGiftVendors = ({ teamId }) => {
  const dispatch = useDispatch();
  const { vendors, isLoading } = useSelector(getMarketplaceRestrictionsVendors);
  const [giftMerchantVendors, setGiftMerchants] = useState([]);
  const [giftBrandVendors, setGiftBrands] = useState([]);

  useEffect(() => {
    setGiftBrands(vendors.filter(vendor => vendor.type === 'brand'));
    setGiftMerchants(vendors.filter(vendor => vendor.type === 'merchant'));
  }, [vendors]);

  useEffect(() => {
    dispatch(teamSettingsGiftInvitesVendorsRequest(teamId));
  }, [dispatch, teamId]);

  const onChange = useCallback(
    ({ id, type }, value) => {
      if (type === 'brand') {
        setGiftBrands(
          giftBrandVendors.map(vendor => (vendor.id === id ? { ...vendor, is_restricted: value } : vendor)),
        );
      } else {
        setGiftMerchants(
          giftMerchantVendors.map(vendor => (vendor.id === id ? { ...vendor, is_restricted: value } : vendor)),
        );
      }
    },
    [giftMerchantVendors, giftBrandVendors],
  );

  const onCheckAll = useCallback(
    restrictionValue => {
      setGiftMerchants(giftMerchantVendors.map(vendor => ({ ...vendor, is_restricted: restrictionValue })));
      setGiftBrands(giftBrandVendors.map(vendor => ({ ...vendor, is_restricted: restrictionValue })));
    },
    [giftMerchantVendors, giftBrandVendors],
  );

  const onSubmit = useCallback(() => {
    const brandIds = giftBrandVendors.filter(vendor => vendor.is_restricted).map(vendor => vendor.id);
    const merchantIds = giftMerchantVendors.filter(vendor => vendor.is_restricted).map(type => type.id);

    dispatch(teamSettingsGiftInvitesUpdateVendorsRequest({ teamId, brandIds, merchantIds }));
  }, [dispatch, giftBrandVendors, giftMerchantVendors, teamId]);

  const giftVendors = useMemo(() => [...giftMerchantVendors, ...giftBrandVendors], [
    giftMerchantVendors,
    giftBrandVendors,
  ]);

  return (
    <>
      <MarketplaceVendorsRestrictionsTable
        area="team"
        vendors={giftVendors}
        isLoading={isLoading}
        onChangeVendorRestricted={onChange}
        onCheckAll={onCheckAll}
        onSubmit={onSubmit}
      />
    </>
  );
};

TeamSettingsGiftVendors.propTypes = {
  teamId: PropTypes.number.isRequired,
};

export default TeamSettingsGiftVendors;
