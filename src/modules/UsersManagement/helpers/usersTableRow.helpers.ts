import { always, equals, identity, ifElse, join, map, pipe, toLower, uniq } from 'ramda';
import { upperFirstLetter } from '@alycecom/utils';
import moment from 'moment';

import { IntegrationName } from '../constants/integrations.constants';
import { IUserTeam } from '../store/usersManagement.types';

const renameOutlookProvider = ifElse(equals(IntegrationName.graph), always(IntegrationName.outlook), identity);
const formatIntegrationFn = pipe(toLower, renameOutlookProvider, upperFirstLetter);

export const formatIntegration = (integrationName: string | null): string => {
  if (!integrationName) {
    return '-';
  }
  return formatIntegrationFn(integrationName);
};

export const formatAccess = pipe(
  map((team: IUserTeam) => upperFirstLetter(team.access)),
  uniq,
  join(', '),
);

export const formatTeams = (teams: IUserTeam[]): string => {
  if (teams.length === 1) {
    return teams[0].name;
  }
  if (teams.length > 1) {
    return `${teams[0].name}, +${teams.length - 1}`;
  }
  return '-';
};

const LAST_ACTIVITY_FORMAT = 'MMMM DD, YYYY';
export const formatLastActivity = (date: string | null): string =>
  date ? moment(date).format(LAST_ACTIVITY_FORMAT) : 'Invitation pending';
