import { useEffect, useRef } from 'react';
import { TrackEvent } from '@alycecom/services';
import { useSelector } from 'react-redux';
import { Auth } from '@alycecom/modules';

import { ICampaignBudget } from '../store/marketplace.types';
import {
  getDonationPrice,
  getGiftCardPrice,
  getMaxPrice,
  getMinPrice,
} from '../store/campaignSettings/campaignSettings.selectors';
import { getEntityIdsFilters } from '../store/products/products.selectors';

import { useCampaignMarketplace } from './useCampaignMarketplace';
import { useCustomMarketplace } from './useCustomMarketplace';

export interface IMarketplaceGeneralPayload {
  adminId: number | null;
  roles: string;
  campaignId: number | null;
  page: string;
  marketplaceId: number | null;
}

export const useGetSenderMarketplaceGeneralPayload = (): IMarketplaceGeneralPayload => {
  const adminId = useSelector(Auth.selectors.getLoginAsAdminId);
  const roles = useSelector(Auth.selectors.getUserRoles);
  const { campaignId } = useCampaignMarketplace();
  const { marketplaceId, isEdit } = useCustomMarketplace();
  const customMarketplacePage = isEdit ? 'EditCustomMarketplace' : 'PreviewCustomMarketplace';
  return {
    adminId,
    roles: roles.join(','),
    campaignId,
    marketplaceId,
    page: marketplaceId ? customMarketplacePage : 'Marketplace',
  };
};

export interface IMarketplaceTrackPayload extends IMarketplaceGeneralPayload {
  filters: ICampaignBudget & { brands: string; merchants: string; types: string };
}

export const useGetSenderMarketplaceDefaultPayload = (): IMarketplaceTrackPayload => {
  const generalPayload = useGetSenderMarketplaceGeneralPayload();
  const minPrice = useSelector(getMinPrice);
  const maxPrice = useSelector(getMaxPrice);
  const donationPrice = useSelector(getDonationPrice);
  const giftCardPrice = useSelector(getGiftCardPrice);
  const { types, brands, merchants } = useSelector(getEntityIdsFilters);

  return {
    ...generalPayload,
    filters: {
      minPrice,
      maxPrice,
      donationPrice,
      giftCardPrice,
      brands: brands.join(','),
      merchants: merchants.join(','),
      types: types.join(','),
    },
  };
};

export const useTrackSenderMarketplace = (eventName: string, options: Record<string, unknown> = {}): void => {
  const { trackEvent } = TrackEvent.useTrackEvent();
  const payload = useGetSenderMarketplaceDefaultPayload();
  const componentMounted = useRef(false);
  useEffect(() => {
    const { current: isMounted } = componentMounted;
    if (!isMounted) {
      trackEvent(eventName, {
        ...payload,
        ...options,
      });
      componentMounted.current = true;
    }
  }, [componentMounted, trackEvent, payload, options, eventName]);
};
