import React, { memo, useCallback, useState } from 'react';
import { TableRow, TableCell } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { formatTestId } from '@alycecom/utils';
import { NumberFormat, TableCellTooltip, ExpandIcon, TableLoadingLabel } from '@alycecom/ui';

import { useBillingTrackEvent } from '../../../hooks/useBillingTrackEvent';
import { TGroup } from '../../../types';

import GroupTeams from './GroupTeams';

const useStyles = makeStyles(() => ({
  tableRow: {
    cursor: 'pointer',
    '&:last-child > $tableCell': {
      borderBottom: 'none',
    },
  },
  tableCell: {},
}));

export interface IGroupProps {
  group: TGroup;
  isLoading: boolean;
  isExpandedByDefault: boolean;
}

const Group = ({ group, isLoading, isExpandedByDefault }: IGroupProps) => {
  const classes = useStyles();

  const { groupId, groupName, totalMoney, totalInvites, teams } = group;
  const canBeExpanded = !isLoading && teams.length;
  const [isExpanded, setIsExpanded] = useState(isExpandedByDefault);

  const trackEvent = useBillingTrackEvent();
  const handleClick = useCallback(() => {
    if (canBeExpanded) {
      setIsExpanded(!isExpanded);
      if (!isExpanded) {
        trackEvent(
          `Billing Insights - Gifts accepted - ${groupId === 'Ungrouped' ? 'Ungrouped' : 'Group'} - Expanded`,
          { groupId },
        );
      }
    }
  }, [canBeExpanded, isExpanded, trackEvent, groupId]);

  return (
    <>
      <TableRow onClick={handleClick} className={classes.tableRow}>
        <TableCell padding="none" className={classes.tableCell}>
          <TableLoadingLabel
            isLoading={isLoading}
            render={() => <TableCellTooltip title={groupName} lengthToShow={32} />}
          />
        </TableCell>
        <TableCell
          align="right"
          className={classes.tableCell}
          data-testid={formatTestId(`BillingInsight.AcceptedSum.${groupName}`)}
        >
          <TableLoadingLabel
            align="right"
            isLoading={isLoading}
            render={() => <NumberFormat>{totalMoney}</NumberFormat>}
          />
        </TableCell>
        <TableCell
          align="right"
          className={classes.tableCell}
          data-testid={formatTestId(`BillingInsight.AcceptedCount.${groupName}`)}
        >
          <TableLoadingLabel
            align="right"
            isLoading={isLoading}
            render={() => <NumberFormat format="0,0">{totalInvites}</NumberFormat>}
          />
        </TableCell>
        <TableCell align="right" padding="checkbox" className={classes.tableCell}>
          {canBeExpanded ? (
            <ExpandIcon
              isExpanded={isExpanded}
              data-testid={formatTestId(`BillingInsight.Accepted.Expand.${groupName}`)}
            />
          ) : null}
        </TableCell>
      </TableRow>

      <GroupTeams group={group} isExpanded={isExpanded && !isLoading} />
    </>
  );
};

export default memo(Group);
