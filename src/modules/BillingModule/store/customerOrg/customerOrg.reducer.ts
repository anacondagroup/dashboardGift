import { createReducer } from 'redux-act';
import { TTransaction, TGroupInfo, TTeamInfo } from '@alycecom/services';

import { ICustomerStats, ITeamsFilter } from './customerOrg.types';
import {
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
  setCurrentGroupSelected,
  setTeamsFilter,
} from './customerOrg.actions';

export interface ICustomerOrgState {
  teams: {
    isLoading: boolean;
    list: TTeamInfo[];
  };
  groups: {
    isLoading: boolean;
    list: TGroupInfo[];
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
  lastInvoice: {
    isLoading: boolean;
    data?: TTransaction;
  };
  selectedGroup: string | null;
}

export const initialState: ICustomerOrgState = {
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
  lastInvoice: {
    isLoading: false,
    data: undefined,
  },
  selectedGroup: null,
};

export const customerOrg = createReducer({}, initialState)
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
