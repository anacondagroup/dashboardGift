import React, { memo, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import { TableRow, TableCell } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { formatTestId, fakeItemsFactory } from '@alycecom/utils';
import { AlyceTheme, NumberFormat, TableCellTooltip, TableLoadingLabel } from '@alycecom/ui';

import {
  getAcceptedTeamInventoriesSelector,
  getAcceptedTeamInventoriesIsLoadingSelector,
  acceptedTeamInventoriesRequest,
} from '../../../store/breakdowns';
import InventoryTypeImage from '../BillingTableBreakdown/InventoryTypeImage';
import { IGroup, IInventoryDeposits, ITeam } from '../../../types';

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
  team: ITeam;
  group: IGroup;
  isExpanded: boolean;
}

const TeamInventories = ({ team, group, isExpanded }: ITeamInventoriesProps) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { teamId, teamName } = team;
  const { groupId, groupName } = group;

  useEffect(() => {
    if (isExpanded) {
      dispatch(acceptedTeamInventoriesRequest({ groupId, teamId }));
    }
  }, [isExpanded, dispatch, teamId, groupId]);

  const deposits = useSelector(useMemo(() => getAcceptedTeamInventoriesSelector(groupId, teamId), [groupId, teamId]));
  const isLoading = useSelector(
    useMemo(() => getAcceptedTeamInventoriesIsLoadingSelector(groupId, teamId), [groupId, teamId]),
  );
  const items = useMemo(
    () =>
      fakeItemsFactory(
        deposits,
        isLoading,
        id =>
          ({
            inventory: { resource: { resourceId: `inventoryId-${id}` } },
          } as IInventoryDeposits),
        3,
      ),
    [deposits, isLoading],
  );

  return isExpanded ? (
    <>
      {items.map(({ inventory, totalMoney }) => (
        <TableRow key={inventory.resource.resourceId} className={classes.tableRow}>
          <TableCell className={classNames(classes.tableCell, classes.nameCell)}>
            <InventoryTypeImage src={inventory.resourceImageUrl} />
            <TableLoadingLabel
              isLoading={isLoading}
              render={() => <TableCellTooltip title={inventory.resourceName} lengthToShow={32} />}
            />
          </TableCell>
          <TableCell
            align="right"
            className={classes.tableCell}
            data-testid={formatTestId(`BillingInsight.AcceptedSum.${groupName}.${teamName}.${inventory.resourceName}`)}
          >
            <TableLoadingLabel
              isLoading={isLoading}
              align="right"
              render={() => <NumberFormat>{totalMoney}</NumberFormat>}
            />
          </TableCell>
          <TableCell
            align="right"
            className={classes.tableCell}
            data-testid={formatTestId(
              `BillingInsight.AcceptedCount.${groupName}.${teamName}.${inventory.resourceName}`,
            )}
          >
            <TableLoadingLabel isLoading={isLoading} render={() => inventory.resource.count} align="right" />
          </TableCell>
          <TableCell className={classes.tableCell} />
        </TableRow>
      ))}
    </>
  ) : null;
};

export default memo(TeamInventories);
