import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { EntityId, TDictionary } from '@alycecom/utils';
import { CampaignSettings, ITeam } from '@alycecom/modules';

interface ExtendTeam {
  archivedAt?: string | null;
}

interface ITeamsAdapter {
  ids: EntityId[];
  isLoading: boolean;
  isLoaded: boolean;
  entities: TDictionary<ITeam & ExtendTeam>;
}

export const useTeams = (): ITeamsAdapter => {
  const dispatch = useDispatch();

  const isLoading = useSelector(CampaignSettings.selectors.getIsTeamsLoading);
  const isLoaded = useSelector(CampaignSettings.selectors.getIsTeamsLoaded);
  const ids = useSelector(CampaignSettings.selectors.getTeamsIds);
  const entities = useSelector(CampaignSettings.selectors.getTeamsMap);

  useEffect(() => {
    dispatch(CampaignSettings.actions.loadTeamsRequest());
  }, [dispatch]);

  return {
    isLoading,
    isLoaded,
    ids,
    entities,
  };
};
