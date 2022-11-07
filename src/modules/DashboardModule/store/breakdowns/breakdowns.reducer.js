import { combineReducers } from 'redux';

import { reducer as teamsReducer } from './teams/teams.reducer';
import { reducer as teamMembersReducer } from './teamMembers/teamMembers.reducer';
import { reducer as giftReducer } from './gift/gift.reducer';
import { reducer as campaignsReducer } from './campaigns/campaigns.reducer';
import { reducer as contactsReducer } from './contacts/contacts.reducer';
import { reducer as contactsAvatarsReducer } from './contactsAvatars/contactsAvatars.reducer';
import giftTransfer from './giftTransfer/giftTransfer.reducer';
import { reducer as swagBatchesReducer } from './swagBatches/swagBatches.reducer';
import campaignsManagement from './campaignsManagement/campaignsManagement.reducer';
import { giftBatches } from './giftBatches/giftBatches.reducer';

export const reducer = combineReducers({
  teams: teamsReducer,
  teamMembers: teamMembersReducer,
  gift: giftReducer,
  campaigns: campaignsReducer,
  contacts: contactsReducer,
  contactsAvatars: contactsAvatarsReducer,
  giftTransfer,
  swagBatches: swagBatchesReducer,
  campaignsManagement,
  giftBatches,
});
