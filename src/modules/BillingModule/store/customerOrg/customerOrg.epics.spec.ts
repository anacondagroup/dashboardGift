import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import moment from 'moment';

import { testEpic, waitFor } from '../../../../testUtils';
import { getOperationsIsLoading } from '../operations';
import { initialState as operationsInitialState } from '../operations/operations.reducer';

import { loadHierarchyRequest } from './customerOrg.actions';
import { getHierarchy, getHierarchyIsLoading, getSelectedGroupOrTeamId } from './customerOrg.selectors';
import { initialState as customerOrgInitialState } from './customerOrg.reducer';

describe.skip('customerOrg.epics', () => {
  test('Should set single group selected by default', async () => {
    const deps = {
      apiService: {
        get: jest.fn(url => {
          if (url.startsWith('/api/v1/reporting/resources/hierarchy-with-deposits-group-grouped')) {
            return of({
              data: {
                groupGrouped: [
                  {
                    groupInfo: {
                      groupId: 'g1',
                      groupName: 'Group 1',
                    },
                    deposits: [],
                    teams: [],
                  },
                ],
                ungrouped: [
                  {
                    teamInfo: {
                      teamId: 1,
                      teamName: 'Team 1',
                    },
                    deposits: [
                      {
                        accountId: 'acc2',
                        money: { amount: 123 },
                      },
                    ],
                  },
                ],
              },
            }).pipe(delay(0));
          }
          if (url.startsWith('/api/v1/reporting/resources/deposits/')) {
            return of({ data: [] });
          }
          return null;
        }),
      },
    };
    const { getState } = testEpic(loadHierarchyRequest(), {}, deps);

    expect(getHierarchyIsLoading(getState())).toBe(true);
    await waitFor(
      () => {
        expect(getHierarchyIsLoading(getState())).toBe(false);
      },
      { interval: 10 },
    );
    expect(getHierarchy(getState()).groupGrouped).toHaveLength(1);
    expect(getSelectedGroupOrTeamId(getState())).toEqual({
      id: 'g1',
      name: 'Group 1',
      accountId: undefined,
    });
  });

  test('Should set first ungrouped team selected by default', async () => {
    const deps = {
      apiService: {
        get: jest.fn(url => {
          if (url.startsWith('/api/v1/reporting/resources/hierarchy-with-deposits-group-grouped')) {
            return of({
              data: {
                groupGrouped: [],
                ungrouped: [
                  {
                    teamInfo: {
                      teamId: 2,
                      teamName: 'Team 2',
                    },
                    deposits: [
                      {
                        accountId: 'acc2',
                        money: { amount: 123 },
                      },
                    ],
                  },
                  {
                    teamInfo: {
                      teamId: 1,
                      teamName: 'Team 1',
                    },
                    deposits: [
                      {
                        accountId: 'acc1',
                        money: { amount: 123 },
                      },
                    ],
                  },
                ],
              },
            }).pipe(delay(0));
          }
          if (url.startsWith('/api/v1/reporting/resources/deposits/')) {
            return of({ data: [] });
          }
          return null;
        }),
      },
    };
    const { getState } = testEpic(loadHierarchyRequest(), {}, deps);

    expect(getHierarchyIsLoading(getState())).toBe(true);
    await waitFor(
      () => {
        expect(getHierarchyIsLoading(getState())).toBe(false);
      },
      { interval: 10 },
    );
    expect(getSelectedGroupOrTeamId(getState())).toEqual({
      id: 2,
      name: 'Team 2',
      accountId: 'acc2',
    });
  });

  test('Should trigger load operations when complete', async () => {
    const deps = {
      apiService: {
        get: jest.fn(url => {
          if (url.startsWith('/api/v1/reporting/resources/hierarchy-with-deposits-group-grouped')) {
            return of({
              data: {
                groupGrouped: [],
                ungrouped: [
                  {
                    teamInfo: {
                      teamId: 2,
                      teamName: 'Team 2',
                    },
                    deposits: [
                      {
                        accountId: 'acc2',
                        money: { amount: 123 },
                      },
                    ],
                  },
                ],
              },
            }).pipe(delay(0));
          }
          if (url.startsWith('/api/v1/reporting/resources/deposits/')) {
            return of({ data: [] }).pipe(delay(0));
          }
          return null;
        }),
      },
    };
    const { getState } = testEpic(
      loadHierarchyRequest(),
      {
        billing: {
          operations: {
            ...operationsInitialState,
            dateRangeFilter: {
              from: moment('2020-02-02').utc().subtract(1, 'year').format(),
              to: moment('2020-02-02').utc().format(),
            },
          },
          customerOrg: {
            ...customerOrgInitialState,
            hierarchy: {
              ...customerOrgInitialState.hierarchy,
              selectedAccount: {
                id: 'g1',
                name: 'Group 1',
                accountId: 'acc1',
              },
            },
          },
        },
      },
      deps,
    );

    expect(getHierarchyIsLoading(getState())).toBe(true);
    expect(getOperationsIsLoading(getState())).toBe(false);
    await waitFor(
      () => {
        expect(getHierarchyIsLoading(getState())).toBe(false);
      },
      { interval: 10 },
    );

    expect(deps.apiService.get).toBeCalledWith(
      '/api/v1/reporting/resources/deposits/acc2/operations?dateRange%5BfromIncluded%5D=true&dateRange%5Bfrom%5D=2019-02-01T21%3A00%3A00Z&dateRange%5BtoIncluded%5D=true&dateRange%5Bto%5D=2020-02-01T21%3A00%3A00Z',
      {},
      true,
    );
    await waitFor(
      () => {
        expect(getOperationsIsLoading(getState())).toBe(false);
      },
      { interval: 10 },
    );
  });
});
