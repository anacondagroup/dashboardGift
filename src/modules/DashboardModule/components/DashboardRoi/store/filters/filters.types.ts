import { TGlobalRoiFilters } from '@alycecom/services';

export type TSetRoiFiltersPayload = TGlobalRoiFilters & { periodName: string | null };
