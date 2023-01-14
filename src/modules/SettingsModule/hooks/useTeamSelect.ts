import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getSwagTeams } from '../store/campaign/swagTeams/swagTeams.selectors';
import { loadSwagTeamsRequest } from '../store/campaign/swagTeams/swagTeams.actions';
import { ITeamMember } from '../store/campaign/swagTeams/swagTeams.types';

interface IOption {
  label: string;
  value: number;
}

const useTeamSelect = ({
  selectedId,
  transformMemberToOption,
}: {
  selectedId: number | undefined;
  transformMemberToOption: (member: ITeamMember) => IOption;
}): {
  teamsOptions: IOption[];
  teamId: number | undefined;
  setTeamId: (id: number) => void;
  isTeamsLoading: boolean;
} => {
  const dispatch = useDispatch();

  const [teamsOptions, setTeamsOptions] = useState<IOption[]>([]);
  const [teamId, setTeamId] = useState(selectedId);

  const { teams, isLoading } = useSelector(getSwagTeams);

  useEffect(() => {
    dispatch(loadSwagTeamsRequest());
  }, [dispatch]);

  useEffect(() => {
    setTeamsOptions(teams.filter(team => team?.archivedAt === null).map(transformMemberToOption));
  }, [teams, transformMemberToOption]);

  useEffect(() => {
    if (teamId || teamsOptions.length) {
      setTeamId(teamId || teamsOptions[0].value);
    }
  }, [teamsOptions, teamId]);

  return {
    teamsOptions,
    teamId,
    setTeamId,
    isTeamsLoading: isLoading,
  };
};

export default useTeamSelect;
