import React, { memo, useMemo } from 'react';
import { GlobalFonts, TableLoadingLabel } from '@alycecom/ui';
import { Typography, TableCell } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

import { getBudgetByTeamId, getIsBudgetLoading } from '../../../../../store/teams/budgets/budgets.selectors';
import { setTeamSidebarStep } from '../../../../../store/teams/teamOperation/teamOperation.actions';
import { TeamSidebarStep } from '../../../../../store/teams/teamOperation/teamOperation.types';

const styles = {
  loadingLabel: {
    maxWidth: 275,
  },
  budgetText: {
    ...GlobalFonts['.Body-Regular-Left-ALL-CAP-LINK-Bold'],
    cursor: 'pointer',
    textAlign: 'right',
  },
  noBudgetStyle: {
    fontStyle: 'italic',
  },
} as const;

export interface IBudgetCellProps {
  teamId: number;
}

const BudgetCell = ({ teamId }: IBudgetCellProps): JSX.Element => {
  const dispatch = useDispatch();

  const budget = useSelector(getBudgetByTeamId(teamId));
  const isLoading = useSelector(getIsBudgetLoading);

  const handleChangeBudget = () => {
    dispatch(setTeamSidebarStep({ step: TeamSidebarStep.TeamBudget, teamId }));
  };

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
          <Typography onClick={handleChangeBudget} sx={{ ...styles.budgetText, ...(!budget && styles.noBudgetStyle) }}>
            {budgetText}
          </Typography>
        )}
      />
    </TableCell>
  );
};

export default memo(BudgetCell);
