import React, { memo, useMemo } from 'react';
import { GlobalFonts, TableLoadingLabel } from '@alycecom/ui';
import { Typography, TableCell, Theme } from '@mui/material';
import { useSelector } from 'react-redux';

import { getBudgetByTeamId } from '../../../../store/teams/budgets/budgets.selectors';

const styles = {
  loadingLabel: {
    maxWidth: 275,
    paddingRight: ({ spacing }: Theme) => spacing(2),
  },
  budgetText: {
    ...GlobalFonts['.Body-Regular-Left-ALL-CAP-LINK-Bold'],
    cursor: 'pointer',
  },
  noBudgetStyle: {
    fontStyle: 'italic',
  },
} as const;

export interface IBudgetCellProps {
  teamId: number;
  isLoading: boolean;
  onBudgetClick: (teamId: number) => void;
}

const BudgetCell = ({ teamId, isLoading, onBudgetClick }: IBudgetCellProps): JSX.Element => {
  const budget = useSelector(useMemo(() => getBudgetByTeamId(teamId), [teamId]));

  const NO_BUDGET_TEXT = 'Define budget / reset period';
  const budgetText = useMemo(
    () =>
      budget
        ? `$ ${Math.round(
            budget.teamMembers.map(member => member.budget).reduce((prev, curr) => prev + curr, 0),
          ).toLocaleString('en-US')} / ${budget.period}`
        : NO_BUDGET_TEXT,
    [budget],
  );

  return (
    <TableCell>
      <TableLoadingLabel
        isLoading={isLoading}
        sx={styles.loadingLabel}
        render={() => (
          <Typography
            onClick={() => onBudgetClick(teamId)}
            sx={{ ...styles.budgetText, ...(!budget && styles.noBudgetStyle) }}
          >
            {budgetText}
          </Typography>
        )}
      />
    </TableCell>
  );
};

export default memo(BudgetCell);
