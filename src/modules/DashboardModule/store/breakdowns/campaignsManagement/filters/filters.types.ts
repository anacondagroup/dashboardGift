import { RowLimit } from '@alycecom/ui';

import { CAMPAIGN_STATUS } from '../../../../../../constants/campaignSettings.constants';
import { TABLE_SORT } from '../../../../../../components/Shared/CustomTable/customTable.constants';

export interface ICampaignsFilters {
  status: CAMPAIGN_STATUS | null;
  search: string | null;
  teamId: number | null;
  includeArchived: boolean | undefined;
  countryIds: number[] | null;
  sortField: string | null;
  sortDirection: TABLE_SORT | null;
  currentPage: number | null;
  limit: RowLimit | null;
}

export type TCampaignTableSetValues = (payload: Partial<ICampaignsFilters>) => void;

export enum SortField {
  Name = 'name',
  Updated = 'updated',
  Created = 'created',
}
