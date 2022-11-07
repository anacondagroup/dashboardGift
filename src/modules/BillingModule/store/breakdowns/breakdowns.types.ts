import { IAccountResources, IGroupInfo, ITeamInfo } from '../../types';

export interface ITeamResources {
  team: ITeamInfo;
  resources: IAccountResources;
}

export interface IGroupedResources {
  groupResources: {
    group: IGroupInfo;
    teams: ITeamResources[];
  }[];
  ungroupedResources: ITeamResources[];
}
