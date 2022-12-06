import { createReducer } from 'redux-act';
import { StateStatus } from '@alycecom/utils';

import { IGroupInfo, IOperation, ITeamInfo } from '../../types';
import { GroupsTeamsConstants } from '../../constants/groupsTeams.constants';

import { ICustomerStats, IOrgHierarchy, IOrgInfo, ITeamsFilter } from './customerOrg.types';
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
  setCurrentGroupSelected,
  setSelectedHierarchyId,
  setTeamsFilter,
} from './customerOrg.actions';
import { AllGroupsAndTeamsOption, UngroupedTeamsOption } from './customerOrg.constants';
import { makeGroupHierarchyId } from './customerOrg.helpers';

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
    status: StateStatus;
    data: IOrgHierarchy;
    selectedHierarchyId: string;
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
    status: StateStatus.Idle,
    data: {
      depositsTotal: {
        accountId: AllGroupsAndTeamsOption.accountId,
        money: {
          amount: 0,
        },
      },
      remainingTeamsTotal: {
        accountId: UngroupedTeamsOption.accountId,
        money: {
          amount: 0,
        },
      },
      groupGrouped: [],
      ungrouped: [],
    },
    selectedHierarchyId: makeGroupHierarchyId(GroupsTeamsConstants.AllGroupsAndTeams),
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
      status: StateStatus.Pending,
    },
  }))
  .on(loadHierarchySuccess, (state, payload) => ({
    ...state,
    hierarchy: {
      ...state.hierarchy,
      status: StateStatus.Fulfilled,
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
    },
  }))
  .on(loadHierarchyFail, state => ({
    ...state,
    hierarchy: {
      ...state.hierarchy,
      status: StateStatus.Rejected,
    },
  }))

  .on(setSelectedHierarchyId, (state, payload) => ({
    ...state,
    hierarchy: {
      ...state.hierarchy,
      selectedHierarchyId: payload,
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
