import React, { memo } from 'react';
import classNames from 'classnames';
import { TableCell, TableRow } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { formatTestId } from '@alycecom/utils';
import { AlyceTheme, TableCellTooltip } from '@alycecom/ui';

import InventoryTypeImage from '../BillingTableBreakdown/InventoryTypeImage';
import { TGroup, TTeam } from '../../../types';

const useStyles = makeStyles<AlyceTheme>(({ spacing, palette }) => ({
  tableRow: {
    cursor: 'pointer',
    '&:last-child > $tableCell': {
      borderBottom: 'none',
    },
    backgroundColor: palette.grey.dark,
  },
  tableCell: {},
  nameCell: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    paddingLeft: spacing(3),
  },
}));

export interface ITeamInventoriesProps {
  team: TTeam;
  group: TGroup;
  isExpanded: boolean;
}

const TeamInventories = ({ team, group, isExpanded }: ITeamInventoriesProps) => {
  const classes = useStyles();

  const { teamName, resources } = team;
  const { groupName } = group;

  return isExpanded ? (
    <>
      {resources.inventory.map(inventory => (
        <TableRow key={inventory.resource.resourceId} className={classes.tableRow}>
          <TableCell className={classNames(classes.tableCell, classes.nameCell)}>
            <InventoryTypeImage src={inventory.resourceImageUrl} />
            <TableCellTooltip title={inventory.resourceName} lengthToShow={32} />
          </TableCell>
          <TableCell
            align="right"
            className={classes.tableCell}
            data-testid={formatTestId(`BillingInsight.Invites.${groupName}.${teamName}.${inventory.resourceName}`)}
          >
            {inventory.resource.count}
          </TableCell>
          <TableCell className={classes.tableCell} />
        </TableRow>
      ))}
    </>
  ) : null;
};

export default memo(TeamInventories);
