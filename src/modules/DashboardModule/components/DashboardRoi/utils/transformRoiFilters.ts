import { TGlobalRoiFilters, TRoiBreakdownQueryParams } from '@alycecom/services';

import { TDebouncedFilters } from '../hooks';

export const transformRoiFilters = <BreakdownItem>({
  field,
  direction,
  limit,
  offset,
  ...filters
}: TDebouncedFilters<BreakdownItem>): TGlobalRoiFilters & TRoiBreakdownQueryParams<BreakdownItem> => {
  const sort = { field, direction };
  const pagination = { limit, offset };
  return { ...filters, sort, pagination };
};
