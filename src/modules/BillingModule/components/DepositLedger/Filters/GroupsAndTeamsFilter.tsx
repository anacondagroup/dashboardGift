import React, { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, FormControl, InputLabel, ListItemText, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { NumberFormat, AlyceTheme } from '@alycecom/ui';

import {
  getHierarchyIsLoading,
  getHierarchyList,
  getSelectedGroupOrTeam,
  setSelectedHierarchyId,
} from '../../../store/customerOrg';
import { AllGroupsAndTeamsOption } from '../../../store/customerOrg/customerOrg.constants';

const styles = {
  indent: {
    width: 12,
  },
  allGroupItem: {
    fontWeight: 'bold !important',
  },
  item: {
    color: ({ palette }: AlyceTheme) => palette.primary.main,
  },
  negative: {
    color: ({ palette }: AlyceTheme) => palette.red.main,
  },
} as const;

const GroupsAndTeamsFilter = () => {
  const dispatch = useDispatch();

  const isLoading = useSelector(getHierarchyIsLoading);
  const selectedGroupOrTeam = useSelector(getSelectedGroupOrTeam);

  const items = useSelector(getHierarchyList);

  const handleSelect = (event: SelectChangeEvent) => {
    dispatch(setSelectedHierarchyId(event.target.value));
  };

  const disabled = items.length === 1 || isLoading;

  return (
    <FormControl fullWidth variant="outlined">
      <InputLabel id="group-teams-filter-label">Groups and Teams</InputLabel>
      <Select<string>
        value={selectedGroupOrTeam.hierarchyId}
        onChange={handleSelect}
        renderValue={() => selectedGroupOrTeam.name}
        disabled={disabled}
        fullWidth
        IconComponent={ExpandMoreIcon}
        label="Groups and Teams"
        labelId="group-teams-filter-label"
        data-testid="DepositLedger.GroupsAndTeams"
      >
        {items.map(item => {
          const isAllGroups = item.id === AllGroupsAndTeamsOption.id;
          const isNegative = item.deposit.money.amount < 0;
          const hasBudget = item.level === 0 || item.isUngrouped;
          return (
            <MenuItem
              key={item.hierarchyId}
              value={item.hierarchyId}
              data-testid={`DepositLedger.GroupsAndTeams.Option.${item.hierarchyId}`}
            >
              <ListItemText
                sx={styles.item}
                primaryTypographyProps={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontWeight: isAllGroups ? 'bold' : 'normal',
                  pl: item.level,
                }}
              >
                <Box component="span">{item.name}</Box>
                {hasBudget && (
                  <Box component="span" sx={[isNegative && styles.negative]}>
                    <NumberFormat format="$0,0.00">{item.deposit.money.amount}</NumberFormat>
                  </Box>
                )}
              </ListItemText>
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

export default memo(GroupsAndTeamsFilter);
