import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { EntityId, TDictionary } from '@alycecom/utils';
import { CampaignSettings, ITeamOwner } from '@alycecom/modules';

interface ITeamOwnersAdapter {
  ids: EntityId[];
  isLoading: boolean;
  isLoaded: boolean;
  entities: TDictionary<ITeamOwner>;
}

export const useTeamOwners = (teamId?: EntityId): ITeamOwnersAdapter => {
  const dispatch = useDispatch();

  const isLoading = useSelector(CampaignSettings.selectors.getIsTeamOwnersLoading);
  const isLoaded = useSelector(CampaignSettings.selectors.getIsTeamOwnersLoaded);
  const ids = useSelector(CampaignSettings.selectors.getTeamOwnersIds);
  const entities = useSelector(CampaignSettings.selectors.getTeamOwnersMap);

  useEffect(() => {
    if (teamId) {
      dispatch(CampaignSettings.actions.loadTeamOwnersRequest(+teamId));
    }
  }, [dispatch, teamId]);

  return {
    isLoading,
    isLoaded,
    ids,
    entities,
  };
};
