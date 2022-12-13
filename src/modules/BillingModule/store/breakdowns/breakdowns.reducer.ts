import { createReducer } from 'redux-act';
import moment from 'moment';

import { TGroup, IInventory, IInventoryDeposits } from '../../types';

import {
  acceptedInvitesFailure,
  acceptedInvitesRequest,
  acceptedInvitesSuccess,
  acceptedTeamInventoriesFailure,
  acceptedTeamInventoriesRequest,
  acceptedTeamInventoriesSuccess,
  sentInvitesFailure,
  sentInvitesRequest,
  sentInvitesSuccess,
  setFilters,
} from './breakdowns.actions';
import { IGroupedResources, ITeamResources } from './breakdowns.types';

export interface IBreakdownsState {
  sent: {
    isLoading: boolean;
    totalInvites: number;
    groups: TGroup[];
    filters: {
      from?: string;
      to?: string;
    };
  };
  accepted: {
    isLoading: boolean;
    totalInvites: number;
    totalMoney: number;
    groups: TGroup[];
    inventories: {
      [groupId: string]: {
        [teamId: number]: {
          isLoading: boolean;
          list: IInventoryDeposits[];
        };
      };
    };
    filters: {
      from?: string;
      to?: string;
    };
  };
}

export const initialState: IBreakdownsState = {
  sent: {
    isLoading: false,
    totalInvites: 0,
    groups: [],
    filters: {
      from: moment().utc().startOf('month').format(),
      to: moment().utc().endOf('day').format(),
    },
  },
  accepted: {
    isLoading: false,
    totalInvites: 0,
    totalMoney: 0,
    groups: [],
    inventories: {},
    filters: {
      from: moment().utc().startOf('month').format(),
      to: moment().utc().endOf('day').format(),
    },
  },
};

const sumResourcesCount = (inventory: IInventory[]) => inventory.reduce((acc, { resource }) => acc + resource.count, 0);

const sumTotalGroupInvites = (teams: ITeamResources[]) =>
  teams.reduce((acc, { resources }) => acc + sumResourcesCount(resources.inventory), 0);

const sumTotalInvites = (groupedResources: IGroupedResources) =>
  groupedResources.groupResources.reduce((acc, { teams }) => acc + sumTotalGroupInvites(teams), 0) +
  groupedResources.ungroupedResources.reduce((acc, { resources }) => acc + sumResourcesCount(resources.inventory), 0);

const sumCurrency = (a: number, b: number) => (a * 100 + b * 100) / 100;

const sumTotalGroupDeposit = (teams: ITeamResources[]) =>
  teams.reduce((acc, { resources }) => sumCurrency(acc, resources.deposit[0].money.amount), 0);

const sumTotalDeposit = (groupedResources: IGroupedResources) =>
  sumCurrency(
    groupedResources.groupResources.reduce((acc, { teams }) => sumCurrency(acc, sumTotalGroupDeposit(teams)), 0),
    groupedResources.ungroupedResources.reduce(
      (acc, { resources }) => sumCurrency(acc, resources.deposit[0].money.amount),
      0,
    ),
  );

export const breakdowns = createReducer({}, initialState)
  .on(setFilters, (state, payload) => ({
    ...state,
    sent: {
      ...state.sent,
      filters: payload,
    },
    accepted: {
      ...state.accepted,
      filters: payload,
    },
  }))

  .on(sentInvitesRequest, state => ({
    ...state,
    sent: {
      ...state.sent,
      isLoading: true,
      totalInvites: 0,
    },
  }))
  .on(sentInvitesSuccess, (state, payload) => ({
    ...state,
    sent: {
      ...state.sent,
      isLoading: false,
      totalInvites: sumTotalInvites(payload),
      groups: [
        ...payload.groupResources.map(({ group, teams }) => ({
          ...group,
          totalInvites: sumTotalGroupInvites(teams),
          totalMoney: 0,
          teams: teams.map(({ team, resources }) => ({
            ...team,
            totalInvites: sumResourcesCount(resources.inventory),
            totalMoney: 0,
            resources,
          })),
        })),
        ...(payload.ungroupedResources.length > 0
          ? [
              {
                groupId: 'Ungrouped',
                groupName: 'Remaining Teams',
                totalInvites: sumTotalGroupInvites(payload.ungroupedResources),
                totalMoney: 0,
                teams: payload.ungroupedResources.map(({ team, resources }) => ({
                  ...team,
                  totalInvites: sumResourcesCount(resources.inventory),
                  totalMoney: 0,
                  resources,
                })),
              },
            ]
          : []),
      ],
    },
  }))
  .on(sentInvitesFailure, state => ({
    ...state,
    ent: {
      ...state.sent,
      isLoading: false,
    },
  }))

  .on(acceptedInvitesRequest, state => ({
    ...state,
    accepted: {
      ...state.accepted,
      isLoading: true,
      totalInvites: 0,
      totalMoney: 0,
    },
  }))
  .on(acceptedInvitesSuccess, (state, payload) => ({
    ...state,
    accepted: {
      ...state.accepted,
      isLoading: false,
      totalInvites: sumTotalInvites(payload),
      totalMoney: sumTotalDeposit(payload),
      groups: [
        ...payload.groupResources.map(({ group, teams }) => ({
          ...group,
          totalInvites: sumTotalGroupInvites(teams),
          totalMoney: sumTotalGroupDeposit(teams),
          teams: teams.map(({ team, resources }) => ({
            ...team,
            totalInvites: sumResourcesCount(resources.inventory),
            totalMoney: resources.deposit[0].money.amount,
            resources,
          })),
        })),
        ...(payload.ungroupedResources.length > 0
          ? [
              {
                groupId: 'Ungrouped',
                groupName: 'Remaining Teams',
                totalInvites: sumTotalGroupInvites(payload.ungroupedResources),
                totalMoney: sumTotalGroupDeposit(payload.ungroupedResources),
                teams: payload.ungroupedResources.map(({ team, resources }) => ({
                  ...team,
                  totalInvites: sumResourcesCount(resources.inventory),
                  totalMoney: resources.deposit[0].money.amount,
                  resources,
                })),
              },
            ]
          : []),
      ],
    },
  }))
  .on(acceptedInvitesFailure, state => ({
    ...state,
    accepted: {
      ...state.accepted,
      isLoading: false,
    },
  }))

  .on(acceptedTeamInventoriesRequest, (state, { groupId, teamId }) => ({
    ...state,
    accepted: {
      ...state.accepted,
      inventories: {
        ...state.accepted.inventories,
        [groupId]: {
          ...state.accepted.inventories[groupId],
          [teamId]: {
            isLoading: true,
            list: [],
          },
        },
      },
    },
  }))
  .on(acceptedTeamInventoriesSuccess, (state, { groupId, teamId, inventories }) => ({
    ...state,
    accepted: {
      ...state.accepted,
      inventories: {
        ...state.accepted.inventories,
        [groupId]: {
          ...state.accepted.inventories[groupId],
          [teamId]: {
            isLoading: false,
            list: inventories.map(inventory => ({
              ...inventory,
              totalMoney: inventory.deposits.reduce((sum, deposit) => sumCurrency(sum, deposit.money.amount), 0),
            })),
          },
        },
      },
    },
  }))
  .on(acceptedTeamInventoriesFailure, (state, { groupId, teamId }) => ({
    ...state,
    accepted: {
      ...state.accepted,
      inventories: {
        ...state.accepted.inventories,
        [groupId]: {
          ...state.accepted.inventories[groupId],
          [teamId]: {
            isLoading: false,
            list: [],
          },
        },
      },
    },
  }));
