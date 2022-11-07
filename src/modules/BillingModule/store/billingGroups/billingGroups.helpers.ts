import qs from 'query-string';

import { IPagination } from './billingGroups.types';

const buildGroupsUrl = (pagination: IPagination, isSearching: boolean, groupIds: string[]): string => {
  const params = { currentPage: isSearching ? 1 : pagination.currentPage, perPage: pagination.perPage, orderByName: 1 };
  const urlString = isSearching
    ? `/api/v1/groups?${qs.stringify({ 'groupIds[]': groupIds, ...params })}`
    : `/api/v1/groups?${qs.stringify(params)}`;
  return urlString;
};

const buildSearchUrl = (pagination: IPagination, term: string): string =>
  `/api/v1/hierarchy/search?term=${term}&currentPage=${pagination.currentPage}&perPage=${pagination.perPage}`;

export { buildGroupsUrl, buildSearchUrl };
