import React, { memo, useCallback, useMemo } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { Link, useRouteMatch } from 'react-router-dom';
import { Grid, MenuItem, Box } from '@mui/material';
import { Icon, DateRangeSelect } from '@alycecom/ui';
import { updateSearch, Auth, User } from '@alycecom/modules';
import { TrackEvent } from '@alycecom/services';
import { useRouting, useUrlQuery, useSetUrlQuery } from '@alycecom/hooks';

import HasPermission from '../../../../hoc/HasPermission/HasPermission';
import { PermissionKeys } from '../../../../constants/permissions.constants';
import { deleteAllGiftsFromTransferSelection } from '../../store/breakdowns/giftTransfer/giftTransfer.actions';
import { makeCanEditTeamById, getTeams } from '../../../../store/teams/teams.selectors';
import SelectFilter from '../../../../components/Dashboard/Header/SelectFilter';

export interface ITeamFiltersProps {
  isLoading?: boolean;
}

const TeamFilters = ({ isLoading = true }: ITeamFiltersProps): JSX.Element => {
  const dispatch = useDispatch();
  const match = useRouteMatch<{ teamId: string }>();

  const teamId = Number(match.params.teamId);
  const go = useRouting();
  const teams = useSelector(getTeams, shallowEqual);
  const canEditTeam = useSelector(useMemo(() => makeCanEditTeamById(match.params.teamId), [match.params.teamId]));

  const { dateRangeFrom = '', dateRangeTo = '' } = useUrlQuery(['dateRangeFrom', 'dateRangeTo']);
  const updateUrl = useSetUrlQuery();

  const onTeamChange = useCallback(
    event => {
      dispatch(deleteAllGiftsFromTransferSelection());
      go(`/teams/${event.teamId}?${updateSearch('', { dateRangeTo, dateRangeFrom })}`);
    },
    [dateRangeFrom, dateRangeTo, dispatch, go],
  );

  const { trackEvent } = TrackEvent.useTrackEvent();
  const userId = useSelector(User.selectors.getUserId);
  const adminId = useSelector(Auth.selectors.getLoginAsAdminId);
  const handleDatesChange = useCallback(
    ({ from, to, preset }) => {
      dispatch(deleteAllGiftsFromTransferSelection());
      updateUrl({ dateRangeFrom: from, dateRangeTo: to });
      trackEvent('Date range - Changed', { page: 'team view', preset, userId, adminId }, { traits: { adminId } });
    },
    [adminId, dispatch, trackEvent, updateUrl, userId],
  );

  return (
    <Grid item container direction="row" justifyContent="flex-end" alignItems="center" xs={5} wrap="nowrap">
      {canEditTeam && (
        <HasPermission permissionKey={PermissionKeys.EditTeams}>
          <Box className="Body-Regular-Center-Link-Bold" pr={2} display="flex" flexDirection="row">
            <Box pr={1}>
              <Icon icon="cog" color="inherit" />
            </Box>
            <Link to={`/settings/teams/${teamId}/settings-and-permissions`}>Edit team</Link>
          </Box>
        </HasPermission>
      )}
      <SelectFilter
        disabled={isLoading}
        label="All teams"
        value={teamId}
        name="teamId"
        onFilterChange={onTeamChange}
        renderItems={() =>
          teams.map(team => (
            <MenuItem key={team.id} value={team.id}>
              {team.name}
            </MenuItem>
          ))
        }
      />
      <Box ml={1}>
        <DateRangeSelect disabled={isLoading} from={dateRangeFrom} to={dateRangeTo} onChange={handleDatesChange} />
      </Box>
    </Grid>
  );
};

export default memo(TeamFilters);
