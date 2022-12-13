import { combineReducers } from 'redux';

import { breakdowns, IBreakdownsState } from './breakdowns/breakdowns.reducer';
import { customerOrg, ICustomerOrgState } from './customerOrg/customerOrg.reducer';
import { billingGroups, IBillingGroupsState } from './billingGroups/billingGroups.reducer';
import {
  billingGroupsContacts,
  TBillingGroupsContactsState,
} from './billingGroupsContacts/billingGroupsContacts.reducer';
import { editBillingGroups, IEditBillingGroupsState } from './editBillingGroups/editBillingGroups.reducer';
import { giftDeposits, IGiftDepositsState } from './giftDeposits/giftDeposits.reducer';
import { editTeams, IEditTeamsState } from './editTeams/editTeams.reducer';
import { ui, TBillingUIState } from './ui';

export interface IBillingState {
  breakdowns: IBreakdownsState;
  customerOrg: ICustomerOrgState;
  billingGroups: IBillingGroupsState;
  editBillingGroups: IEditBillingGroupsState;
  billingGroupsContacts: TBillingGroupsContactsState;
  giftDeposits: IGiftDepositsState;
  editTeams: IEditTeamsState;
  ui: TBillingUIState;
}

export default combineReducers<IBillingState>({
  breakdowns,
  customerOrg,
  billingGroups,
  editBillingGroups,
  billingGroupsContacts,
  giftDeposits,
  editTeams,
  ui,
});
