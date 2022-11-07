import { breakdowns as reducer, initialState } from './breakdowns.reducer';
import {
  getAcceptedGroups,
  getAcceptedTotalInvites,
  getAcceptedTotalMoney,
  getSentGroups,
  getSentTotalInvites,
} from './breakdowns.selectors';
import { acceptedInvitesSuccess, acceptedTeamInventoriesSuccess, sentInvitesSuccess } from './breakdowns.actions';

describe('breakdowns.reducer', () => {
  test('Should calculate inventory total amount', () => {
    const state = reducer(
      initialState,
      acceptedTeamInventoriesSuccess({
        groupId: 'g1',
        teamId: 123,
        inventories: [
          {
            deposits: [
              {
                money: {
                  amount: 100.2,
                },
              },
              {
                money: {
                  amount: 21.01,
                },
              },
            ],
          },
        ],
      }),
    );

    expect(state.accepted.inventories.g1['123'].list[0].totalMoney).toBe(121.21);
  });

  test('Should calculate sent by groups total invites', () => {
    const state = reducer(
      initialState,
      sentInvitesSuccess({
        groupResources: [
          {
            group: {
              groupId: 'g1',
              groupName: 'Group 1',
            },
            teams: [
              {
                team: {
                  teamId: 1,
                  teamName: 'Team 1',
                },
                resources: {
                  inventory: [
                    {
                      resource: {
                        count: 2,
                      },
                    },
                    {
                      resource: {
                        count: 100500,
                      },
                    },
                  ],
                  deposit: [],
                },
              },
            ],
          },
          {
            group: {
              groupId: 'g2',
              groupName: 'Group 2',
            },
            teams: [
              {
                team: {
                  teamId: 1,
                  teamName: 'Team 1',
                },
                resources: {
                  inventory: [
                    {
                      resource: {
                        count: 3,
                      },
                    },
                    {
                      resource: {
                        count: 4,
                      },
                    },
                  ],
                  deposit: [],
                },
              },
            ],
          },
        ],
        ungroupedResources: [],
      }),
    );

    expect(getSentTotalInvites({ billing: { breakdowns: state } })).toBe(100509);
    expect(getSentGroups({ billing: { breakdowns: state } })).toHaveLength(2);
    expect(getSentGroups({ billing: { breakdowns: state } })[1].totalInvites).toBe(7);
  });

  test('Should flatten group info object', () => {
    const state = reducer(
      initialState,
      sentInvitesSuccess({
        groupResources: [
          {
            group: {
              groupId: 'g1',
              groupName: 'Group 1',
            },
            teams: [],
          },
        ],
        ungroupedResources: [],
      }),
    );

    expect(getSentGroups({ billing: { breakdowns: state } })[0]).toMatchObject({
      groupId: 'g1',
      groupName: 'Group 1',
      totalInvites: 0,
      teams: [],
    });
  });

  test('Should calculate total accepted', () => {
    const state = reducer(
      initialState,
      acceptedInvitesSuccess({
        groupResources: [
          {
            group: {
              groupId: 'g1',
              groupName: 'Group 1',
            },
            teams: [
              {
                team: {
                  teamId: 1,
                  teamName: 'Team 1',
                },
                resources: {
                  inventory: [
                    {
                      resource: { count: 2 },
                    },
                    {
                      resource: { count: 100500 },
                    },
                  ],
                  deposit: [
                    {
                      money: { amount: 1234.21 },
                    },
                  ],
                },
              },
            ],
          },
        ],
        ungroupedResources: [
          {
            team: {
              teamId: 2,
              teamName: 'Team 2',
            },
            resources: {
              inventory: [
                {
                  resource: { count: 1 },
                },
              ],
              deposit: [
                {
                  money: { amount: 1 },
                },
              ],
            },
          },
        ],
      }),
    );

    expect(getAcceptedTotalInvites({ billing: { breakdowns: state } })).toBe(100503);
    expect(getAcceptedTotalMoney({ billing: { breakdowns: state } })).toBe(1235.21);
    expect(getAcceptedGroups({ billing: { breakdowns: state } })).toHaveLength(2);
    expect(getAcceptedGroups({ billing: { breakdowns: state } })[0].teams[0].totalMoney).toBe(1234.21);
  });
});
