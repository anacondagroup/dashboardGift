import { TrackEvent } from '@alycecom/services';
import { TBaseEventPayload, TBaseEventOptions } from '@alycecom/modules';

export const trackCustomMarketplaceCreateClicked = (
  payload: TBaseEventPayload,
  options: TBaseEventOptions,
): ReturnType<typeof TrackEvent.actions.trackEvent> =>
  TrackEvent.actions.trackEvent({
    name: 'Custom Marketplace - Create Marketplace Clicked',
    payload,
    options,
  });

export const trackCustomMarketplaceCreated = (
  payload: TBaseEventPayload & {
    marketplaceId: number;
    minPrice: number | null;
    maxPrice: number | null;
    giftCardPrice: number | null;
    donationPrice: number | null;
    countryIds: number[];
    teamIds: number[];
  },
  options: TBaseEventOptions,
): ReturnType<typeof TrackEvent.actions.trackEvent> =>
  TrackEvent.actions.trackEvent({
    name: 'Custom Marketplace - Marketplace Created',
    payload: {
      ...payload,
      teamIds: payload.teamIds.join(', '),
    },
    options,
  });

export const trackCustomMarketplaceProductAdded = (
  payload: TBaseEventPayload & {
    marketplaceId: number;
    from: 'bulk' | 'single' | 'preview';
    productId: number | null;
  },
  options: TBaseEventOptions,
): ReturnType<typeof TrackEvent.actions.trackEvent> =>
  TrackEvent.actions.trackEvent({
    name: 'Custom Marketplace - Product Added',
    payload,
    options,
  });

export const trackCustomMarketplaceSettingsChanged = (
  payload: TBaseEventPayload & {
    marketplaceId: number;
    minPrice: number | null;
    maxPrice: number | null;
    giftCardPrice: number | null;
    donationPrice: number | null;
    countryIds: number[];
    teamIds: number[];
  },
  options: TBaseEventOptions,
): ReturnType<typeof TrackEvent.actions.trackEvent> =>
  TrackEvent.actions.trackEvent({
    name: 'Custom Marketplace - Settings Changed',
    payload: {
      ...payload,
      teamIds: payload.teamIds.join(', '),
    },
    options,
  });

export const trackCustomMarketplaceFilterApplied = (
  payload: TBaseEventPayload & {
    marketplaceId: number;
    name: 'interests' | 'productTypes' | 'productVendors' | 'search';
  },
  options: TBaseEventOptions,
): ReturnType<typeof TrackEvent.actions.trackEvent> =>
  TrackEvent.actions.trackEvent({
    name: 'Custom Marketplace - Filter Applied',
    payload,
    options,
  });

export const trackCustomMarketplaceProductDetailsViewed = (
  payload: TBaseEventPayload & {
    marketplaceId: number;
    productId: number;
  },
  options: TBaseEventOptions,
): ReturnType<typeof TrackEvent.actions.trackEvent> =>
  TrackEvent.actions.trackEvent({
    name: 'Custom Marketplace - Product Details Viewed',
    payload,
    options,
  });

export const trackCustomMarketplaceModeChanged = (
  payload: TBaseEventPayload & {
    marketplaceId: number;
    mode: 'edit' | 'preview';
  },
  options: TBaseEventOptions,
): ReturnType<typeof TrackEvent.actions.trackEvent> =>
  TrackEvent.actions.trackEvent({
    name: 'Custom Marketplace - Mode Changed',
    payload,
    options,
  });

export const trackCustomMarketplaceExportResults = (
  payload: TBaseEventPayload & {
    marketplaceId: number;
    mode: 'edit' | 'preview';
  },
  options: TBaseEventOptions,
): ReturnType<typeof TrackEvent.actions.trackEvent> =>
  TrackEvent.actions.trackEvent({
    name: 'Custom Marketplace - Export Results',
    payload,
    options,
  });
