import { createReducer } from 'redux-act';

import { IGroupInfo, IOperation, ITeamInfo } from '../../types';

import { ICustomerStats, IOrgHierarchy, IOrgInfo, ISelectedAccount, ITeamsFilter } from './customerOrg.types';
import {
  customerOrgFailure,
  customerOrgRequest,
  customerOrgSuccess,
  loadHierarchyFail,
  loadHierarchyRequest,
  loadHierarchySuccess,
  loadLastInvoiceFail,
  loadLastInvoiceRequest,
  loadLastInvoiceSuccess,
  loadResourcesFail,
  loadResourcesRequest,
  loadResourcesSuccess,
  loadStatsFail,
  loadStatsRequest,
  loadStatsSuccess,
  orgGroupsFailure,
  orgGroupsRequest,
  orgGroupsSuccess,
  orgTeamsFailure,
  orgTeamsRequest,
  orgTeamsSuccess,
  setSelectedAccount,
  setTeamsFilter,
  setCurrentGroupSelected,
} from './customerOrg.actions';

export interface ICustomerOrgState {
  org: IOrgInfo & { isLoading: boolean };
  teams: {
    isLoading: boolean;
    list: ITeamInfo[];
  };
  groups: {
    isLoading: boolean;
    list: IGroupInfo[];
  };
  teamsFilter: ITeamsFilter;
  stats: ICustomerStats & {
    isLoading: boolean;
  };
  resources: {
    isLoading: boolean;
    remainingInvites: number;
    remainingDeposit: number;
  };
  hierarchy: {
    isLoading: boolean;
    data: IOrgHierarchy;
    selectedAccount: ISelectedAccount;
  };
  lastInvoice: {
    isLoading: boolean;
    data?: IOperation;
  };
  selectedGroup: string | null;
}

export const initialState: ICustomerOrgState = {
  org: {
    id: 0,
    name: '',
    isLoading: false,
  },
  teams: {
    isLoading: false,
    list: [],
  },
  groups: {
    isLoading: false,
    list: [],
  },
  teamsFilter: {
    teamIds: [],
    groupIds: [],
  },
  stats: {
    isLoading: false,
    users: 0,
    teams: 0,
  },
  resources: {
    isLoading: false,
    remainingInvites: 0,
    remainingDeposit: 0,
  },
  hierarchy: {
    isLoading: false,
    data: {
      depositsTotal: {
        accountId: '0',
        money: {
          amount: 0,
        },
      },
      remainingTeamsTotal: {
        accountId: 'Ungrouped',
        money: {
          amount: 0,
        },
      },
      groupGrouped: [],
      ungrouped: [],
    },
    selectedAccount: {
      id: 'ALLG&T',
      name: 'All Groups and Teams',
      accountId: '',
      level: 0,
    },
  },
  lastInvoice: {
    isLoading: false,
    data: undefined,
  },
  selectedGroup: null,
};

export const customerOrg = createReducer({}, initialState)
  .on(customerOrgRequest, state => ({
    ...state,
    org: {
      ...state.org,
      isLoading: true,
    },
  }))
  .on(customerOrgSuccess, (state, payload) => ({
    ...state,
    org: {
      ...payload,
      isLoading: false,
    },
  }))
  .on(customerOrgFailure, state => ({
    ...state,
    org: {
      ...state.org,
      isLoading: false,
    },
  }))
  .on(orgTeamsRequest, state => ({
    ...state,
    teams: {
      ...state.teams,
      isLoading: true,
    },
  }))
  .on(orgTeamsSuccess, (state, payload) => ({
    ...state,
    teams: {
      list: payload,
      isLoading: false,
    },
  }))
  .on(orgTeamsFailure, state => ({
    ...state,
    teams: {
      ...state.teams,
      isLoading: false,
    },
  }))
  .on(orgGroupsRequest, state => ({
    ...state,
    groups: {
      ...state.groups,
      isLoading: true,
    },
  }))
  .on(orgGroupsSuccess, (state, payload) => ({
    ...state,
    groups: {
      list: payload,
      isLoading: false,
    },
  }))
  .on(orgGroupsFailure, state => ({
    ...state,
    groups: {
      ...state.groups,
      isLoading: false,
    },
  }))

  .on(setTeamsFilter, (state, payload) => ({
    ...state,
    teamsFilter: payload,
  }))
  .on(setCurrentGroupSelected, (state, payload) => ({
    ...state,
    selectedGroup: payload,
  }))

  .on(loadStatsRequest, state => ({
    ...state,
    stats: {
      ...state.stats,
      isLoading: true,
    },
  }))
  .on(loadStatsSuccess, (state, payload) => ({
    ...state,
    stats: {
      ...payload,
      isLoading: false,
    },
  }))
  .on(loadStatsFail, state => ({
    ...state,
    stats: {
      ...state.stats,
      isLoading: false,
    },
  }))

  .on(loadResourcesRequest, state => ({
    ...state,
    resources: {
      ...state.resources,
      isLoading: true,
    },
  }))
  .on(loadResourcesSuccess, (state, payload) => {
    const remainingInvites = payload.inventory
      .filter(({ resourceName }) => resourceName !== 'Email')
      .reduce((acc, { resource }) => acc + resource.count, 0);
    const remainingDeposit = payload.deposit.reduce((acc, { money }) => (acc * 100 + money.amount * 100) / 100, 0);
    return {
      ...state,
      resources: {
        ...payload,
        isLoading: false,
        remainingInvites,
        remainingDeposit,
      },
    };
  })
  .on(loadResourcesFail, state => ({
    ...state,
    resources: {
      ...state.resources,
      isLoading: false,
    },
  }))

  .on(loadHierarchyRequest, state => ({
    ...state,
    hierarchy: {
      ...state.hierarchy,
      isLoading: true,
    },
  }))
  .on(loadHierarchySuccess, (state, payload) => ({
    ...state,
    hierarchy: {
      ...state.hierarchy,
      isLoading: false,
      data: {
        ...payload,
        remainingTeamsTotal: {
          ...state.hierarchy.data.remainingTeamsTotal,
          money: {
            amount: payload.ungrouped.reduce(
              (acc, team) =>
                acc + team.deposits.reduce((teamTotal, depositTeam) => teamTotal + depositTeam.money.amount, 0),
              0,
            ),
          },
        },
      },
      selectedAccount: {
        ...state.hierarchy.selectedAccount,
        accountId: payload.depositsTotal.accountId,
      },
    },
  }))
  .on(loadHierarchyFail, state => ({
    ...state,
    hierarchy: {
      ...state.hierarchy,
      isLoading: false,
    },
  }))

  .on(setSelectedAccount, (state, payload) => ({
    ...state,
    hierarchy: {
      ...state.hierarchy,
      selectedAccount: payload,
    },
  }))

  .on(loadLastInvoiceRequest, state => ({
    ...state,
    lastInvoice: {
      ...state.lastInvoice,
      isLoading: true,
    },
  }))
  .on(loadLastInvoiceSuccess, (state, payload) => ({
    ...state,
    lastInvoice: {
      ...state.lastInvoice,
      isLoading: false,
      data: payload,
    },
  }))
  .on(loadLastInvoiceFail, state => ({
    ...state,
    lastInvoice: {
      ...state.lastInvoice,
      isLoading: false,
    },
  }));
