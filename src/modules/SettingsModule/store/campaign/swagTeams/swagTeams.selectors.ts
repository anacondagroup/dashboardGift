import { identity, pipe } from 'ramda';

import { IRootState } from '../../../../../store/root.types';

const pathToCampaignSettingsSwagTeams = (state: IRootState) => state.settings.campaign.swagTeams;

export const getSwagTeams = pipe(pathToCampaignSettingsSwagTeams, identity);
