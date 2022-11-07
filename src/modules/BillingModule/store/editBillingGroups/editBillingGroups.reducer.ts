import { createReducer } from 'redux-act';

import { StateStatus } from '../../../../store/stateStatuses.types';
import { createEmptyBillingGroupData } from '../../shapes/billingGroupContact.shape';

import { TCreateBillingGroupForm } from './editBillingGroups.types';
import {
  createBillingGroupRequest,
  updateBillingGroupRequest,
  updateBillingGroupSuccess,
  updateBillingGroupFail,
  createBillingGroupSuccess,
  createBillingGroupFail,
  setCreateBillingGroupData,
  setModalOpen,
  clearCachedBillingGroup,
  setCreateBillingGroupName,
  setCreateBillingGroupPoNumber,
  setCreateBillingGroupPrimaryContact,
  setCreateBillingGroupSendInvoicesTo,
} from './editBillingGroups.actions';

export interface IEditBillingGroupsState {
  saveInProgress: StateStatus;
  billingGroupData: TCreateBillingGroupForm;
  isModalOpen: boolean;
  cachedBillingGroup: TCreateBillingGroupForm | null;
}

export const initialState: IEditBillingGroupsState = {
  saveInProgress: StateStatus.Idle,
  billingGroupData: createEmptyBillingGroupData(),
  isModalOpen: false,
  cachedBillingGroup: null,
};

export const editBillingGroups = createReducer({}, initialState);

editBillingGroups
  .on(createBillingGroupRequest, state => ({
    ...state,
    saveInProgress: StateStatus.Pending,
    cachedBillingGroup: null,
  }))
  .on(createBillingGroupSuccess, (state, payload) => ({
    ...state,
    saveInProgress: StateStatus.Fulfilled,
    billingGroupData: createEmptyBillingGroupData(),
    isModalOpen: false,
    cachedBillingGroup: {
      ...state.billingGroupData,
      groupId: payload.id,
    },
  }))
  .on(createBillingGroupFail, state => ({
    ...state,
    saveInProgress: StateStatus.Rejected,
    cachedBillingGroup: null,
  }));

editBillingGroups
  .on(updateBillingGroupRequest, state => ({
    ...state,
    saveInProgress: StateStatus.Pending,
    cachedBillingGroup: null,
  }))
  .on(updateBillingGroupSuccess, (state, payload) => ({
    ...state,
    saveInProgress: StateStatus.Fulfilled,
    billingGroupData: createEmptyBillingGroupData(),
    isModalOpen: false,
    cachedBillingGroup: {
      groupId: payload.id,
      name: state.billingGroupData.name,
      primaryBillingContact: state.billingGroupData.primaryBillingContact,
      sendInvoicesTo: state.billingGroupData.sendInvoicesTo,
      poNumber: state.billingGroupData.poNumber,
    },
  }))
  .on(updateBillingGroupFail, state => ({
    ...state,
    saveInProgress: StateStatus.Rejected,
    cachedBillingGroup: null,
  }));

editBillingGroups.on(setCreateBillingGroupData, (state, payload) => ({
  ...state,
  billingGroupData: payload,
}));

editBillingGroups.on(setCreateBillingGroupName, (state, payload) => ({
  ...state,
  billingGroupData: {
    ...state.billingGroupData,
    name: payload,
  },
}));

editBillingGroups.on(setCreateBillingGroupPoNumber, (state, payload) => ({
  ...state,
  billingGroupData: {
    ...state.billingGroupData,
    poNumber: payload,
  },
}));

editBillingGroups.on(setCreateBillingGroupPrimaryContact, (state, payload) => ({
  ...state,
  billingGroupData: {
    ...state.billingGroupData,
    primaryBillingContact: payload,
  },
}));

editBillingGroups.on(setCreateBillingGroupSendInvoicesTo, (state, payload) => ({
  ...state,
  billingGroupData: {
    ...state.billingGroupData,
    sendInvoicesTo: payload,
  },
}));

editBillingGroups.on(setModalOpen, (state, payload) => ({
  ...state,
  isModalOpen: payload,
}));

editBillingGroups.on(clearCachedBillingGroup, state => ({
  ...state,
  cachedBillingGroup: null,
}));
