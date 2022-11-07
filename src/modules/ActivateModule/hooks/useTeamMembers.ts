import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { EntityId, TDictionary } from '@alycecom/utils';
import { CampaignSettings, ITeamMember } from '@alycecom/modules';

interface ITeamMembersAdapter {
  ids: EntityId[];
  isLoading: boolean;
  isLoaded: boolean;
  entities: TDictionary<ITeamMember>;
}

export const useTeamMembers = (teamId: EntityId): ITeamMembersAdapter => {
  const dispatch = useDispatch();

  const isLoading = useSelector(CampaignSettings.selectors.getIsTeamMembersLoading);
  const isLoaded = useSelector(CampaignSettings.selectors.getIsTeamMembersLoaded);
  const ids = useSelector(CampaignSettings.selectors.getTeamMembersIds);
  const entities = useSelector(CampaignSettings.selectors.getTeamMembersMap);

  useEffect(() => {
    if (teamId) {
      dispatch(CampaignSettings.actions.loadTeamMembersRequest(Number(teamId)));
    }
  }, [dispatch, teamId]);

  return {
    isLoading,
    isLoaded,
    ids,
    entities,
  };
};
