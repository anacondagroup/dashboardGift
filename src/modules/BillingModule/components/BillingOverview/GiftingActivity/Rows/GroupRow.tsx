import React, { memo, useCallback, useState, useMemo } from 'react';
import { Box, TableRow, Typography, Button } from '@mui/material';
import { ExpandIcon, NumberFormat, TableCellTooltip, TableLoadingLabel } from '@alycecom/ui';
import { useDispatch, useSelector } from 'react-redux';

import { useBillingTrackEvent } from '../../../../hooks/useBillingTrackEvent';
import { StyledCell } from '../../../styled/Styled';
import { TGiftingActivityGroupNode, TGiftingActivityTeamNode } from '../../../../types';
import { setBillingTab } from '../../../../store/ui/tab/tab.reducer';
import { BillingTab } from '../../../../store/ui/tab/tab.types';
import { getDateRange, getSorting } from '../../../../store/ui/overviewFilters/overviewFilters.selectors';
import { makeGroupHierarchyId } from '../../../../store/ui/transactionsFilters/transactionsFilters.helpers';
import {
  setSelectedHierarchyId,
  setDateRange,
} from '../../../../store/ui/transactionsFilters/transactionsFilters.reducer';
import { makeSortByColumn } from '../../../../helpers/billingGroupForm.helpers';

import { styles } from './GroupRow.styles';
import TeamRow from './TeamRow';

export interface IGroupRowProps {
  group?: TGiftingActivityGroupNode;
  isLoading: boolean;
  isExpandedByDefault: boolean;
}

const GroupRow = ({ group, isLoading, isExpandedByDefault }: IGroupRowProps): JSX.Element => {
  const dispatch = useDispatch();

  const {
    groupId,
    groupName,
    teams,
    amountAtTheStart,
    amountAtTheEnd,
    sentCount,
    claimedCount,
    purchasedCount,
    amountSpent,
  } = group || {};

  const dateRange = useSelector(getDateRange);
  const sorting = useSelector(getSorting);

  const canBeExpanded = !isLoading && Boolean(teams?.length);
  const [isExpanded, setIsExpanded] = useState(isExpandedByDefault);

  const teamsRows = useMemo(() => {
    if (!teams || !isExpanded) {
      return teams;
    }

    const sortByColumn = makeSortByColumn<TGiftingActivityTeamNode>({
      column: sorting.column === 'groupName' ? 'teamName' : sorting.column,
      direction: sorting.direction,
    });

    return sortByColumn(teams);
  }, [teams, sorting, isExpanded]);

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

  const handleShowTransactions = useCallback(() => {
    if (groupId) {
      dispatch(setSelectedHierarchyId(makeGroupHierarchyId(groupId)));
      dispatch(setDateRange(dateRange));
      dispatch(setBillingTab(BillingTab.Transactions));
    }
  }, [dispatch, groupId, dateRange]);

  return (
    <>
      <TableRow sx={[canBeExpanded && styles.tableRow]} onClick={handleClick}>
        <StyledCell padding="none">
          <TableLoadingLabel
            isLoading={isLoading}
            render={() => (
              <TableCellTooltip
                title={groupName || ''}
                renderLabel={() => (
                  <Box sx={styles.groupNameRoot}>
                    <Box sx={styles.groupNameWrapper}>
                      {canBeExpanded ? <ExpandIcon sx={styles.icon} isExpanded={isExpanded} /> : null}
                      <Typography sx={[styles.groupNameText, !canBeExpanded && styles.notExpandableRow]}>
                        {groupName}
                      </Typography>
                    </Box>
                    <Typography sx={styles.groupStartBalance}>
                      Opening balance: <NumberFormat format="$0,0.00">{amountAtTheStart}</NumberFormat>
                    </Typography>
                  </Box>
                )}
                lengthToShow={40}
              />
            )}
          />
        </StyledCell>
        <StyledCell align="right">
          <TableLoadingLabel
            align="right"
            isLoading={isLoading}
            render={() => (
              <Button variant="text" sx={styles.linkButton} onClick={handleShowTransactions}>
                <NumberFormat format="$0,0.00">{amountAtTheEnd}</NumberFormat>
              </Button>
            )}
          />
        </StyledCell>
        <StyledCell align="right">
          <TableLoadingLabel
            align="right"
            isLoading={isLoading}
            render={() => <NumberFormat format="0,0">{sentCount}</NumberFormat>}
          />
        </StyledCell>
        <StyledCell align="right">
          <TableLoadingLabel
            align="right"
            isLoading={isLoading}
            render={() => <NumberFormat format="0,0">{claimedCount}</NumberFormat>}
          />
        </StyledCell>
        <StyledCell align="right">
          <TableLoadingLabel
            align="right"
            isLoading={isLoading}
            render={() => <NumberFormat format="0,0">{purchasedCount}</NumberFormat>}
          />
        </StyledCell>
        <StyledCell align="right">
          <TableLoadingLabel
            align="right"
            isLoading={isLoading}
            render={() => <NumberFormat format="$0,0.00">{amountSpent}</NumberFormat>}
          />
        </StyledCell>
      </TableRow>
      {isExpanded && !isLoading && (
        <>
          {teamsRows?.map(team => (
            <TeamRow key={team.teamId} team={team} isLoading={isLoading} hasIndent hasBalanceColumn />
          ))}
        </>
      )}
    </>
  );
};

export default memo(GroupRow);
