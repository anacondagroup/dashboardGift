import React, { memo, useMemo } from 'react';
import { usersTeammatesAdapter, useGetTeammatesListQuery } from '@alycecom/services';
import { useDispatch, useSelector } from 'react-redux';
import { IMultiAutocompleteProps, MultiAutocomplete } from '@alycecom/ui';
import { Box } from '@mui/material';

import { setRoiFilters } from '../../../store/filters';
import { getRoiCurrentTeamMembers } from '../../../store/filters/filters.selectors';

const styles = {
  filter: {
    width: 300,
  },
  toggle: {
    marginLeft: 1,
    fontSize: '14px',
  },
  button: {
    minWidth: 'auto',
    padding: 0,
    fontSize: '14px',
  },
} as const;

const RoiTeamMembersFilter = (): JSX.Element => {
  const dispatch = useDispatch();
  const selectedMembersIds = useSelector(getRoiCurrentTeamMembers);

  const { data } = useGetTeammatesListQuery(undefined);
  const { selectAll } = usersTeammatesAdapter.getSelectors(() => data ?? usersTeammatesAdapter.getInitialState());
  const teamMembers = useSelector(selectAll);

  const selectedTeamMembers = useMemo(() => teamMembers.filter(member => selectedMembersIds.includes(member.userId)), [
    selectedMembersIds,
    teamMembers,
  ]);

  const handleMembersChange: IMultiAutocompleteProps<typeof teamMembers[number], true>['onChange'] = newTeamMembers => {
    dispatch(setRoiFilters({ teamMemberIds: newTeamMembers.map(member => member.userId) }));
  };

  return (
    <Box sx={styles.filter}>
      <MultiAutocomplete<typeof teamMembers[number], true>
        label="Select Team Member"
        name="teamMemberFilter"
        value={selectedTeamMembers}
        options={teamMembers}
        multiple
        getOptionLabel={option => option.userName}
        onChange={handleMembersChange}
        listboxProps={{ maxVisibleRows: 4 }}
      />
    </Box>
  );
};

export default memo(RoiTeamMembersFilter);
