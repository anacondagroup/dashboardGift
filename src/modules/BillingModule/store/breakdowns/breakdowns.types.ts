import { TGroupInfo, TTeamInfo } from '@alycecom/services';

import { IAccountResources } from '../../types';

export interface ITeamResources {
  team: TTeamInfo;
  resources: IAccountResources;
}

export interface IGroupedResources {
  groupResources: {
    group: TGroupInfo;
    teams: ITeamResources[];
  }[];
  ungroupedResources: ITeamResources[];
}
