import { billingGroups as reducer, initialState } from './billingGroups.reducer';

import { getGroupsListSuccess, getSearchGroupsListSuccess } from './billingGroups.actions';
import { searchGroupResultsMock } from './billingGroups.mocks';

describe('billingGroups.reducer', () => {
  test('Should shows count of teams', () => {
    const state = reducer(
      initialState,
      getGroupsListSuccess({
        data: [
          {
            groupId: '123e4567-e89b-12d3-a456-426655440000',
            groupName: 'test 1',
            orgId: 21,
            firstName: 'Carl',
            lastName: 'Johns',
            email: 'john@gmail.com',
            emailsCc: ['carl@gmail.com'],
            poNumber: '7645131',
            teamsCount: 1,
          },
        ],
        pagination: {
          currentPage: 1,
          perPage: 10,
          total: 100,
        },
      }),
    );

    expect(state.billingInfoComplete.billingGroups[0].billingInfo.teamsCount).toBe(1);
  });

  test('Should return group ids list', () => {
    const state = reducer(initialState, getSearchGroupsListSuccess(searchGroupResultsMock));
    const responseMock = searchGroupResultsMock.data.map(({ groupId }) => groupId);

    expect(state.searchGroupResults).toEqual(responseMock);
    expect(state.billingInfoComplete.pagination).toEqual(searchGroupResultsMock.pagination);
  });
});
