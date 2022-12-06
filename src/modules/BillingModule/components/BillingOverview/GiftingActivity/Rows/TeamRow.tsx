import React, { memo, useCallback } from 'react';
import { TableRow, Box, Theme, SxProps, Link, Typography, Button } from '@mui/material';
import { NumberFormat, TableCellTooltip, TableLoadingLabel } from '@alycecom/ui';
import qs from 'query-string';
import { useDispatch, useSelector } from 'react-redux';

import { StyledCell } from '../../../styled/Styled';
import { TGiftingActivityTeamNode } from '../../../../types';
import { TDateRange } from '../../../../store/billing.types';
import { getDateRange } from '../../../../store/ui/overviewFilters/overviewFilters.selectors';
import { setSelectedHierarchyId } from '../../../../store/customerOrg';
import { makeTeamHierarchyId } from '../../../../store/customerOrg/customerOrg.helpers';
import { setDateRange } from '../../../../store/operations';
import { setBillingTab } from '../../../../store/ui/tab/tab.reducer';
import { BillingTab } from '../../../../store/ui/tab/tab.types';

import { styles } from './TeamRow.styles';

export interface ITeamRowProps {
  team: TGiftingActivityTeamNode;
  isLoading: boolean;
  sx?: SxProps<Theme>;
  hasIndent?: boolean;
  hasBalanceColumn?: boolean;
}

const getTeamDetailsLink = (teamId: number, dateRange?: TDateRange): string => {
  const queryParams =
    dateRange?.from && dateRange?.to
      ? qs.stringify({ date_range_from: dateRange?.from, date_range_to: dateRange?.to })
      : '';
  return `${window.APP_CONFIG.dashboardHost}/teams/${teamId}?${queryParams}`;
};

const TeamRow = ({
  team,
  isLoading,
  hasIndent = false,
  hasBalanceColumn = false,
  sx = [],
}: ITeamRowProps): JSX.Element => {
  const dispatch = useDispatch();

  const dateRange = useSelector(getDateRange);

  const {
    teamId,
    teamName,
    sentCount,
    claimedCount,
    purchasedCount,
    amountSpent,
    amountAtTheEnd,
    amountAtTheStart,
    isUngrouped,
  } = team;

  const handleShowTransactions = useCallback(() => {
    if (teamId) {
      dispatch(setSelectedHierarchyId(makeTeamHierarchyId(String(teamId))));
      dispatch(setDateRange(dateRange));
      dispatch(setBillingTab(BillingTab.Transactions));
    }
  }, [dispatch, teamId, dateRange]);

  return (
    <TableRow sx={sx}>
      <StyledCell padding="none">
        <TableLoadingLabel
          isLoading={isLoading}
          render={() => (
            <TableCellTooltip
              title={teamName}
              renderLabel={() => (
                <Box sx={[styles.teamNameRoot, hasIndent && styles.indent]}>
                  <Box component="span" sx={[styles.teamName]}>
                    {teamName}
                  </Box>
                  {isUngrouped && (
                    <Typography sx={styles.teamStartBalance}>
                      Opening balance: <NumberFormat format="$0,0.00">{amountAtTheStart}</NumberFormat>
                    </Typography>
                  )}
                </Box>
              )}
              lengthToShow={40}
            />
          )}
        />
      </StyledCell>
      {hasBalanceColumn && (
        <StyledCell align="right">
          <TableLoadingLabel
            align="right"
            isLoading={isLoading}
            render={() =>
              isUngrouped ? (
                <Button variant="text" sx={styles.linkButton} onClick={handleShowTransactions}>
                  <NumberFormat format="$0,0.00">{amountAtTheEnd}</NumberFormat>
                </Button>
              ) : (
                <>&nbsp;</>
              )
            }
          />
        </StyledCell>
      )}
      <StyledCell align="right">
        <TableLoadingLabel
          align="right"
          isLoading={isLoading}
          render={() => <NumberFormat format="0">{sentCount}</NumberFormat>}
        />
      </StyledCell>
      <StyledCell align="right">
        <TableLoadingLabel
          align="right"
          isLoading={isLoading}
          render={() => (
            <Link sx={styles.link} href={getTeamDetailsLink(teamId, dateRange)} target="_blank">
              <NumberFormat format="0">{claimedCount}</NumberFormat>
            </Link>
          )}
        />
      </StyledCell>
      <StyledCell align="right">
        <TableLoadingLabel
          align="right"
          isLoading={isLoading}
          render={() => <NumberFormat format="0">{purchasedCount}</NumberFormat>}
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
  );
};

export default memo(TeamRow);
