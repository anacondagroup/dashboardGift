import { TGroupInfo } from '@alycecom/services';

import { TTeam } from './Team.types';

export type TGroup = TGroupInfo & {
  teams: TTeam[];
  totalInvites: number;
  totalMoney: number;
};
