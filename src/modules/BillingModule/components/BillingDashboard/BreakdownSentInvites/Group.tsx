import React, { memo, useCallback, useState } from 'react';
import { TableRow, TableCell } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { formatTestId } from '@alycecom/utils';
import { NumberFormat, TableCellTooltip, ExpandIcon, TableLoadingLabel } from '@alycecom/ui';

import { useBillingTrackEvent } from '../../../hooks/useBillingTrackEvent';
import { IGroup } from '../../../types';

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
  group: IGroup;
  isLoading: boolean;
  isExpandedByDefault: boolean;
}

const Group = ({ group, isLoading, isExpandedByDefault }: IGroupProps) => {
  const classes = useStyles();

  const { groupId, groupName, totalInvites, teams } = group;
  const canBeExpanded = !isLoading && teams.length;
  const [isExpanded, setIsExpanded] = useState(isExpandedByDefault);

  const trackEvent = useBillingTrackEvent();
  const handleClick = useCallback(() => {
    if (canBeExpanded) {
      setIsExpanded(!isExpanded);
      if (!isExpanded) {
        trackEvent(`Billing Insights - Gifts sent - ${groupId === 'Ungrouped' ? 'Ungrouped' : 'Group'} - Expanded`, {
          groupId,
        });
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
          data-testid={formatTestId(`BillingInsight.Invites.${groupName}`)}
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
              data-testid={formatTestId(`BillingInsight.Invites.Expand.${groupName}`)}
            />
          ) : null}
        </TableCell>
      </TableRow>

      <GroupTeams group={group} isExpanded={isExpanded && !isLoading} />
    </>
  );
};

export default memo(Group);
