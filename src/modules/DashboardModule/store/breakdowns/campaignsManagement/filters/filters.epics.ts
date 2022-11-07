import { Epic, ofType as classicOfType } from 'redux-observable';
import { ofType, pickNotEmptyAndNil } from '@alycecom/utils';
import { filter, map, take, withLatestFrom } from 'rxjs/operators';
import { applySpec } from 'ramda';
import { parse, stringify } from 'query-string';
import { LOCATION_CHANGE, replace } from 'connected-react-router';

import { fetchCampaignsSuccess } from '../campaignsBreakdown/campaignsBreakdown.actions';
import { CAMPAIGN_ROUTES } from '../../../../helpers/campaignsManagement.helpers';

import {
  getCountriesFilter,
  getCurrentPageFilter,
  getLimitFilter,
  getSearchFilter,
  getSortDirectionFilter,
  getSortFieldFilter,
  getStatusFilter,
  getTeamIdFilter,
} from './filters.selectors';
import { setFilters } from './filters.actions';
import { ICampaignsFilters } from './filters.types';
import { initialCampaignsFiltersState } from './filters.reducer';

export const initCampaignsFilterEpic: Epic = (action$, state$) =>
  action$.pipe(classicOfType(LOCATION_CHANGE), take(1)).pipe(
    filter(() => CAMPAIGN_ROUTES.matchAnyCampaignsPath(window.location.pathname) !== null),
    withLatestFrom(state$),
    map(() => {
      const { status, search, teamId, countryIds, sortField, sortDirection, currentPage, limit } = parse(
        window.location.search,
        { arrayFormat: 'comma', parseNumbers: true },
      ) as Partial<ICampaignsFilters>;
      const parsedCountryIds = countryIds?.length ? countryIds : [Number(countryIds)];
      return setFilters({
        status: status ?? null,
        search: search ?? null,
        teamId: teamId ? Number(teamId) : null,
        countryIds: countryIds ? parsedCountryIds : null,
        sortField: sortField || initialCampaignsFiltersState.sortField,
        sortDirection: sortField ? sortDirection : initialCampaignsFiltersState.sortDirection,
        currentPage: Number.isInteger(currentPage) ? currentPage : initialCampaignsFiltersState.currentPage,
        limit: Number.isInteger(limit) ? limit : initialCampaignsFiltersState.limit,
      });
    }),
  );

export const syncCampaignsFilterToUrlQueryEpic: Epic = (action$, state$) =>
  action$.pipe(
    ofType(fetchCampaignsSuccess),
    filter(() => CAMPAIGN_ROUTES.matchAnyCampaignsPath(window.location.pathname) !== null),
    withLatestFrom(state$),
    map(([, state]) => {
      const { status, search, teamId, countryIds, sortField, sortDirection, currentPage, limit } = applySpec({
        status: getStatusFilter,
        search: getSearchFilter,
        teamId: getTeamIdFilter,
        countryIds: getCountriesFilter,
        sortField: getSortFieldFilter,
        sortDirection: getSortDirectionFilter,
        currentPage: getCurrentPageFilter,
        limit: getLimitFilter,
      })(state);
      const currentParams = parse(window.location.search);
      const queryString = stringify(
        pickNotEmptyAndNil({
          ...currentParams,
          status,
          search,
          teamId,
          countryIds,
          sortField,
          sortDirection,
          currentPage,
          limit,
        }),
        { arrayFormat: 'comma' },
      );
      return replace({
        search: queryString,
      });
    }),
  );

export const campaignFiltersEpics = [initCampaignsFilterEpic, syncCampaignsFilterToUrlQueryEpic];
