import React, { memo, useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormControl, InputLabel, ListItemText, MenuItem, Radio, Select } from '@mui/material';
import { makeStyles } from '@mui/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { AlyceTheme } from '@alycecom/ui';

import {
  orgGroupsRequest,
  orgTeamsRequest,
  getOrgGroups,
  getOrgTeams,
  getTeamsFilter,
  setTeamsFilter,
  setCurrentGroupSelected,
} from '../../../store/customerOrg';
import { useBillingTrackEvent } from '../../../hooks/useBillingTrackEvent';
import { GroupsTeamsConstants } from '../../../constants/groupsTeams.constants';

const useStyles = makeStyles<AlyceTheme>(({ spacing }) => ({
  radio: {
    padding: 0,
    marginRight: spacing(2),
  },
  indent: {
    width: 30,
  },
}));

interface IFilterItem {
  value: string | number;
  label: string;
  isSelected: boolean;
  level: number;
  isGroup?: boolean;
  parentGroupId?: string;
}

const TeamsFilter = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(orgTeamsRequest());
    dispatch(orgGroupsRequest());
  }, [dispatch]);

  const teams = useSelector(getOrgTeams);
  const groups = useSelector(getOrgGroups);

  const filter = useSelector(getTeamsFilter);
  const handleChangeFilter = useCallback(
    (newFilter, groupName?) => {
      dispatch(setTeamsFilter(newFilter));
      dispatch(setCurrentGroupSelected(groupName));
    },
    [dispatch],
  );

  const selectedValue = filter.teamIds[0] || filter.groupIds[0] || GroupsTeamsConstants.AllGroupsAndTeams;

  const items = useMemo<IFilterItem[]>(() => {
    const groupsItems = groups.reduce<IFilterItem[]>((acc, group) => {
      acc.push({
        value: group.groupId,
        label: `${group.groupName} (All teams)`,
        isSelected: selectedValue === group.groupId,
        isGroup: true,
        level: 0,
      });
      acc.push(
        ...teams
          .filter(
            team =>
              team.groupId === group.groupId || (!team.groupId && group.groupId === GroupsTeamsConstants.Ungrouped),
          )
          .map(team => ({
            value: team.teamId,
            label: team.teamName,
            isSelected: selectedValue === team.teamId,
            level: 1,
            parentGroupId: group.groupId,
          })),
      );
      return acc;
    }, []);

    return [
      {
        value: GroupsTeamsConstants.AllGroupsAndTeams,
        label: 'All groups & teams',
        isSelected: selectedValue === GroupsTeamsConstants.AllGroupsAndTeams,
        level: 0,
      },
      ...groupsItems,
    ];
  }, [teams, groups, selectedValue]);
  const selectedItem = useMemo(() => items.find(item => item.value === selectedValue) || items[0], [
    items,
    selectedValue,
  ]);

  const trackEvent = useBillingTrackEvent();
  const handleChangeSelected = useCallback(
    ev => {
      if (ev.target.value === GroupsTeamsConstants.AllGroupsAndTeams) {
        handleChangeFilter({
          teamIds: [],
          groupIds: [],
        });
        trackEvent('Billing insights - Filtered - All');
      } else {
        const selected = items.find(item => item.value === ev.target.value) || items[0];
        if (selected.isGroup) {
          handleChangeFilter(
            {
              teamIds: [],
              groupIds: [selected.value],
            },
            selected.label,
          );
          trackEvent('Billing insights - Filtered - By group', { groupId: selected.value });
        } else {
          handleChangeFilter({
            teamIds: [selected.value],
            groupIds: [selected.parentGroupId],
          });
          trackEvent(
            `Billing insights - Filtered - By ${
              selected.parentGroupId === GroupsTeamsConstants.Ungrouped ? 'ungrouped team' : 'team'
            }`,
            {
              teamId: selected.value,
              groupId: selected.parentGroupId,
            },
          );
        }
      }
    },
    [items, handleChangeFilter, trackEvent],
  );

  return (
    <FormControl fullWidth variant="outlined">
      <InputLabel htmlFor="teams-filter">Viewing</InputLabel>
      <Select
        value={selectedItem.value}
        onChange={handleChangeSelected}
        renderValue={() => selectedItem.label}
        disabled={items.length === 1}
        fullWidth
        IconComponent={ExpandMoreIcon}
        label="Viewing"
        inputProps={{ id: 'teams-filter' }}
        data-testid="BillingInsight.FiltersDropdown"
      >
        {items.map(item => (
          <MenuItem key={item.value} value={item.value} data-testid={`BillingInsight.FiltersDropdown.${item.value}`}>
            {new Array(item.level).fill(null).map((_, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <span className={classes.indent} key={String(index)} />
            ))}
            <Radio checked={item.isSelected} color="primary" className={classes.radio} />
            <ListItemText primary={item.label} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default memo(TeamsFilter);
