import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getSwagTeamAdmins } from '../store/campaign/swagTeamAdmins/swagTeamAdmins.selectors';
import { loadSwagTeamAdminsRequest } from '../store/campaign/swagTeamAdmins/swagTeamAdmins.actions';
import { ITeamMember } from '../store/campaign/swagTeamAdmins/swagTeamAdmins.types';

interface IOption {
  label: string;
  value: number;
}

const useTeamOwnerSelect = (
  teamId: number | undefined,
  {
    selectedId,
    transformMemberToOption,
  }: {
    selectedId: number | undefined;
    transformMemberToOption: (member: ITeamMember) => IOption;
  },
): {
  membersOptions: IOption[];
  ownerId: number | undefined;
  setOwnerId: (id: number) => void;
  isMembersLoading: boolean;
} => {
  const dispatch = useDispatch();

  const { admins, isLoading } = useSelector(getSwagTeamAdmins);

  const [ownerId, setOwnerId] = useState<number | undefined>();
  const [defaultOwnerId, setDefaultOwnerId] = useState<number | undefined>(selectedId);
  const [membersOptions, setMembersOptions] = useState<IOption[]>([]);

  useEffect(() => {
    if (teamId) {
      dispatch(loadSwagTeamAdminsRequest({ teamId }));
    }
  }, [teamId, dispatch]);

  useEffect(() => {
    if (admins.length) {
      const options = admins.map(transformMemberToOption);

      setMembersOptions(options);

      if (defaultOwnerId) {
        setOwnerId(defaultOwnerId);
        setDefaultOwnerId(undefined);
      } else {
        setOwnerId(ownerId || options[0].value);
      }
    }
  }, [admins, defaultOwnerId, ownerId, transformMemberToOption]);

  return {
    membersOptions,
    ownerId,
    setOwnerId,
    isMembersLoading: isLoading,
  };
};

export default useTeamOwnerSelect;
