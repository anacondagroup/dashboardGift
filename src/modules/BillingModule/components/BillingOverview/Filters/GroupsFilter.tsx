import React, { memo, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, FormControl, InputLabel, ListItemText, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { AlyceTheme } from '@alycecom/ui';

import { AllGroupsAndTeamsOption } from '../../../store/customerOrg/customerOrg.constants';
import { getHierarchyIsLoading, getHierarchyList } from '../../../store/customerOrg';
import { getGroupId } from '../../../store/ui/overviewFilters/overviewFilters.selectors';
import { setGroupId } from '../../../store/ui/overviewFilters/overviewFilters.reducer';

const styles = {
  indent: {
    width: 12,
  },
  item: {
    color: ({ palette }: AlyceTheme) => palette.primary.main,
  },
} as const;

const GroupsFilter = (): JSX.Element => {
  const dispatch = useDispatch();

  const isLoading = useSelector(getHierarchyIsLoading);
  const hierarchyList = useSelector(getHierarchyList);

  const groupId = useSelector(getGroupId);

  const groups = useMemo(() => hierarchyList.filter(item => item.level === 0), [hierarchyList]);
  const selectedGroup = useMemo(() => groups.find(item => item.id === groupId), [groupId, groups]);

  const disabled = groups.length === 1 || isLoading;

  const handleSelect = (event: SelectChangeEvent) => {
    dispatch(setGroupId(event.target.value));
  };

  return (
    <FormControl fullWidth variant="outlined">
      <InputLabel id="groups-filter-label">Groups</InputLabel>
      <Select<string>
        value={groupId}
        onChange={handleSelect}
        renderValue={() => selectedGroup?.name ?? ''}
        disabled={disabled}
        fullWidth
        IconComponent={ExpandMoreIcon}
        label="Groups"
        labelId="group-filter-label"
        data-testid="Overview.Groups"
      >
        {groups.map(group => {
          const isAllGroups = group.id === AllGroupsAndTeamsOption.id;
          return (
            <MenuItem key={group.id} value={group.id} data-testid={`Overview.Groups.Option.${group.id}`}>
              <ListItemText
                sx={styles.item}
                primaryTypographyProps={{
                  fontWeight: isAllGroups ? 'bold' : 'normal',
                }}
              >
                <Box component="span">{group.name}</Box>
              </ListItemText>
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

export default memo(GroupsFilter);
