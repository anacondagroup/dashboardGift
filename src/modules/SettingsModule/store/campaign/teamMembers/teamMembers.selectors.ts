import { identity } from 'ramda';
import { createSelector } from 'reselect';

import { IRootState } from '../../../../../store/root.types';

const pathToCampaignSettingsTeamAdmins = (state: IRootState) => state.settings.campaign.teamMembers;

export const getTeamMembers = createSelector(pathToCampaignSettingsTeamAdmins, identity);
