import React, { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, FormControl, InputLabel, ListItemText, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { NumberFormat, AlyceTheme } from '@alycecom/ui';
import { useGetOrganizationBillingHierarchyQuery } from '@alycecom/services';
import moment from 'moment/moment';
import { SHORT_DATE_FORMAT } from '@alycecom/modules';

import { AllGroupsAndTeamsOption } from '../../../store/customerOrg/customerOrg.constants';
import { setSelectedHierarchyId } from '../../../store/ui/transactionsFilters/transactionsFilters.reducer';
import { getHierarchyList, getSelectedGroupOrTeam } from '../../../store/billing.selectors';

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
  archivedAt: {
    color: ({ palette }: AlyceTheme) => palette.additional.chambray20,
  },
} as const;

const GroupsAndTeamsFilter = () => {
  const dispatch = useDispatch();

  const { isFetching } = useGetOrganizationBillingHierarchyQuery();

  const items = useSelector(getHierarchyList);
  const selectedGroupOrTeam = useSelector(getSelectedGroupOrTeam);

  const handleSelect = (event: SelectChangeEvent) => {
    dispatch(setSelectedHierarchyId(event.target.value));
  };

  const disabled = items.length === 1 || isFetching;

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
                <Box component="span">
                  {item.name}{' '}
                  {item.archivedAt && (
                    <Box component="span" sx={styles.archivedAt}>
                      (Archived {moment(item.archivedAt).format(SHORT_DATE_FORMAT)})
                    </Box>
                  )}
                </Box>
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
