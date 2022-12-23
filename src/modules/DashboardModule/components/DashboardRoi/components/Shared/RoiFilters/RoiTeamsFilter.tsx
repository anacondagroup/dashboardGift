import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { teamListAdapter, useGetTeamListQuery } from '@alycecom/services';
import { useDispatch, useSelector } from 'react-redux';
import { MultiAutocomplete } from '@alycecom/ui';
import { Box } from '@mui/material';

import { getRoiCurrentTeams } from '../../../store/filters/filters.selectors';
import { setRoiFilters } from '../../../store/filters';

const styles = {
  filter: {
    width: 300,
  },
  toggle: {
    marginLeft: 1,
    fontSize: '14px',
  },
  button: {
    padding: 0,
    fontSize: '14px',
  },
} as const;

const RoiTeamsFilter = (): JSX.Element => {
  const dispatch = useDispatch();
  const selectedTeamIds = useSelector(getRoiCurrentTeams);
  const isTeamsFilterInitialized = useRef(false);

  const { data } = useGetTeamListQuery(undefined);
  const { selectAll } = teamListAdapter.getSelectors(() => data ?? teamListAdapter.getInitialState());
  const teams = useSelector(selectAll);
  const selectedTeams = useMemo(() => teams.filter(team => selectedTeamIds.includes(team.id)), [
    teams,
    selectedTeamIds,
  ]);

  const handleTeamsChange = useCallback(
    (newTeams: typeof teams[number][]) => {
      dispatch(setRoiFilters({ teamIds: newTeams.map(team => team.id) }));
    },
    [dispatch],
  );

  useEffect(() => {
    if (teams.length > 0 && selectedTeamIds.length === 0 && !isTeamsFilterInitialized.current) {
      isTeamsFilterInitialized.current = true;
      handleTeamsChange(teams);
    }
  }, [teams, selectedTeamIds, handleTeamsChange]);

  return (
    <Box sx={styles.filter}>
      <MultiAutocomplete<typeof teams[number], true>
        label="Select Teams"
        name="teamsFilter"
        value={selectedTeams}
        options={teams}
        multiple
        getOptionLabel={option => option.name}
        onChange={handleTeamsChange}
        listboxProps={{ maxVisibleRows: 4 }}
      />
    </Box>
  );
};

export default memo(RoiTeamsFilter);
