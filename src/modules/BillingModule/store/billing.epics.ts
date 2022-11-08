import breakdownsEpics from './breakdowns/breakdowns.epics';
import customerOrgEpics from './customerOrg/customerOrg.epics';
import operationsEpics from './operations/operations.epics';
import billingGroupsEpics from './billingGroups/billingGroups.epics';
import editBillingGroupsEpics from './editBillingGroups/editBillingGroups.epics';
import billingGroupsContactsEpics from './billingGroupsContacts/billingGroupsContacts.epics';
import giftDeposits from './giftDeposits/giftDeposits.epics';
import editTeamsEpics from './editTeams/editTeams.epics';

export default [
  ...breakdownsEpics,
  ...customerOrgEpics,
  ...operationsEpics,
  ...giftDeposits,
  ...billingGroupsEpics,
  ...editBillingGroupsEpics,
  ...billingGroupsContactsEpics,
  ...editTeamsEpics,
];