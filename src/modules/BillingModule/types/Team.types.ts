import { TTeamInfo } from '@alycecom/services';

import { IAccountResources } from './AccountResources.types';

export type TTeam = TTeamInfo & {
  resources: IAccountResources;
  totalInvites: number;
  totalMoney: number;
};
