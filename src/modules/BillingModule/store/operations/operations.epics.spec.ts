import moment from 'moment';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { testEpic, waitFor } from '../../../../testUtils';
import { initialState as customerOrgInitialState } from '../customerOrg/customerOrg.reducer';
import { setSelectedHierarchyId } from '../customerOrg';

import { initialState as operationsInitialState } from './operations.reducer';
import { setDateRange } from './operations.actions';
import { getOperationsIsLoading } from './operations.selectors';

describe.skip('operations.epics', () => {
  test('Should trigger load operations when date changed', async () => {
    const deps = {
      apiService: {
        get: jest.fn(url => {
          if (url.startsWith('/api/v1/reporting/resources/deposits/')) {
            return of({
              data: [],
            }).pipe(delay(0));
          }
          return null;
        }),
      },
    };
    const { getState } = testEpic(
      setDateRange({
        from: moment('2020-02-02').utc().subtract(1, 'year').format(),
        to: moment('2020-02-02').format(),
      }),
      {
        billing: {
          operations: {
            ...operationsInitialState,
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

    expect(getOperationsIsLoading(getState())).toBe(true);
    expect(deps.apiService.get).toBeCalledWith(
      '/api/v1/reporting/resources/deposits/acc1/operations?dateRange%5BfromIncluded%5D=true&dateRange%5Bfrom%5D=2019-02-01T21%3A00%3A00Z&dateRange%5BtoIncluded%5D=true&dateRange%5Bto%5D=2020-02-02T00%3A00%3A00%2B03%3A00',
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

  test('Should trigger load operations when account selected', async () => {
    const deps = {
      apiService: {
        get: jest.fn(url => {
          if (url.startsWith('/api/v1/reporting/resources/deposits/')) {
            return of({
              data: [],
            }).pipe(delay(0));
          }
          return null;
        }),
      },
    };
    const { getState } = testEpic(
      setSelectedHierarchyId('team-2'),
      {
        billing: {
          operations: {
            ...operationsInitialState,
            dateRangeFilter: {
              from: moment('2020-02-02').utc().subtract(1, 'year').format(),
              to: moment('2020-02-02').format(),
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
                level: 0,
              },
            },
          },
        },
      },
      deps,
    );

    expect(getOperationsIsLoading(getState())).toBe(true);
    expect(deps.apiService.get).toBeCalledWith(
      '/api/v1/reporting/resources/deposits/acc2/operations?dateRange%5BfromIncluded%5D=true&dateRange%5Bfrom%5D=2019-02-01T21%3A00%3A00Z&dateRange%5BtoIncluded%5D=true&dateRange%5Bto%5D=2020-02-02T00%3A00%3A00%2B03%3A00',
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
