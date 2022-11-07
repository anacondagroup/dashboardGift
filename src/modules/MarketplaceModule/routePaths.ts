import { generatePath, matchPath } from 'react-router-dom';
import { stringify } from 'query-string';

import { MarketplaceMode } from './types';
import { IFilters } from './store/products/products.types';

const modes = `${MarketplaceMode.Edit}|${MarketplaceMode.Preview}`;

export const MARKETPLACE_ROUTES = {
  ANY_MARKETPLACE_PATH: '/marketplace/:type(campaign|custom)',
  SHARED_PATH: '/marketplace/campaign',
  CAMPAIGN_PATH: '/campaign/:campaignId?',
  CUSTOM_PATH: `/custom/:marketplaceId(\\d+)/:mode(${modes})?`,
  buildCampaignPath(campaignId?: number | string) {
    return `/marketplace${generatePath(this.CAMPAIGN_PATH, { campaignId })}`;
  },
  buildCustomPath(marketplaceId: number | string, mode?: MarketplaceMode) {
    return `/marketplace${generatePath(this.CUSTOM_PATH, { marketplaceId, mode })}`;
  },
  buildMarketplacePathWithFilter(filters: Partial<IFilters>) {
    return `${this.SHARED_PATH}?${stringify(filters, { arrayFormat: 'comma' })}`;
  },
  matchAnyMarketplacePath(path: string) {
    return matchPath(path, { path: this.ANY_MARKETPLACE_PATH, exact: false });
  },
  matchSharedPath(path: string, exact = true) {
    return matchPath(path, { path: this.SHARED_PATH, exact });
  },
  matchCampaignPath(path: string) {
    return matchPath<{ campaignId: string }>(path, { path: `/marketplace${this.CAMPAIGN_PATH}`, exact: true });
  },
  matchCustomPath(path: string) {
    return matchPath<{ marketplaceId: string; mode?: MarketplaceMode }>(path, {
      path: `/marketplace${this.CUSTOM_PATH}`,
      exact: true,
    });
  },
} as const;
