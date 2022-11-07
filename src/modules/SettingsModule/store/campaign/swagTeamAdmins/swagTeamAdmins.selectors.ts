import { identity, pipe } from 'ramda';

import { IRootState } from '../../../../../store/root.types';

const pathToCampaignSettingsSwagTeamAdmins = (state: IRootState) => state.settings.campaign.swagTeamAdmins;

export const getSwagTeamAdmins = pipe(pathToCampaignSettingsSwagTeamAdmins, identity);
