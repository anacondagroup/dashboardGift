import { campaignsEpic } from './campaigns/campaigns.epics';
import { contactsEpic } from './contacts/contacts.epics';
import { contactsAvatarsEpic } from './contactsAvatars/contactsAvatars.epics';
import { giftEpic } from './gift/gift.epics';
import { giftReportEpics } from './giftReport/giftReport.epics';
import giftTransferringEpics from './giftTransfer/giftTransfer.epics';
import { swagBatchesBreakdownEpics } from './swagBatches/swagBatches.epics';
import { teamMembersEpic } from './teamMembers/teamMembers.epics';
import { teamsEpic } from './teams/teams.epics';
import { campaignsManagementEpics } from './campaignsManagement/campaignsManagement.epics';
import getGiftBatchesEpics from './giftBatches/giftBatches.epics';

export default [
  ...campaignsEpic,
  ...contactsEpic,
  ...contactsAvatarsEpic,
  ...giftEpic,
  ...giftReportEpics,
  ...giftTransferringEpics,
  ...swagBatchesBreakdownEpics,
  ...teamMembersEpic,
  ...teamsEpic,
  ...campaignsManagementEpics,
  ...getGiftBatchesEpics,
];
