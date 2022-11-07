import React, { memo, useCallback, useState } from 'react';
import classNames from 'classnames';
import { TableRow, TableCell } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { formatTestId } from '@alycecom/utils';
import { NumberFormat, TableCellTooltip, ExpandIcon } from '@alycecom/ui';

import { useBillingTrackEvent } from '../../../hooks/useBillingTrackEvent';
import { IGroup, ITeam } from '../../../types';

import TeamInventories from './TeamInventories';

const useStyles = makeStyles(({ spacing }) => ({
  tableRow: {
    cursor: 'pointer',
    '&:last-child > $tableCell': {
      borderBottom: 'none',
    },
    backgroundColor: 'var(--Tundora-05)',
  },
  tableCell: {},
  nameCell: {
    paddingLeft: spacing(3),
  },
}));

export interface ITeamProps {
  team: ITeam;
  group: IGroup;
  isExpandedByDefault: boolean;
}

const Team = ({ team, group, isExpandedByDefault }: ITeamProps) => {
  const classes = useStyles();

  const { teamId, teamName, totalInvites, resources } = team;
  const { groupId, groupName } = group;
  const canBeExpanded = resources.inventory.length > 0;
  const [isExpanded, setIsExpanded] = useState(isExpandedByDefault);

  const trackEvent = useBillingTrackEvent();
  const handleClick = useCallback(() => {
    if (canBeExpanded) {
      setIsExpanded(!isExpanded);
      if (!isExpanded) {
        trackEvent('Billing Insights - Gifts sent - Team - Expanded', { groupId, teamId });
      }
    }
  }, [canBeExpanded, isExpanded, trackEvent, groupId, teamId]);

  return (
    <>
      <TableRow onClick={handleClick} className={classes.tableRow}>
        <TableCell className={classNames(classes.tableCell, classes.nameCell)}>
          <TableCellTooltip title={teamName} lengthToShow={32} />
        </TableCell>
        <TableCell
          align="right"
          className={classes.tableCell}
          data-testid={formatTestId(`BillingInsight.Invites.${groupName}.${teamName}`)}
        >
          <NumberFormat format="0,0">{totalInvites}</NumberFormat>
        </TableCell>
        <TableCell align="right" padding="checkbox" className={classes.tableCell}>
          {canBeExpanded ? (
            <ExpandIcon
              isExpanded={isExpanded}
              data-testid={formatTestId(`BillingInsight.Invites.Expand.${groupName}.${teamName}`)}
            />
          ) : null}
        </TableCell>
      </TableRow>

      <TeamInventories team={team} group={group} isExpanded={isExpanded} />
    </>
  );
};

export default memo(Team);
