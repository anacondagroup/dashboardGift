import React, { useMemo } from 'react';
import { Table, TableCell, TableFooter, TableRow, Theme, Typography, TableContainer, Box } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import { Tooltip, NumberFormat } from '@alycecom/ui';
import { BudgetCreateField, ITeamMemberBudget, RefreshPeriod } from '@alycecom/services';
import { useFormContext } from 'react-hook-form';
import { useSelector } from 'react-redux';

import { UTILIZATION_INCLUDES_REMOVED_USERS } from '../../../../../constants/budget.constants';
import {
  getMembersWithUtilization,
  getTeamBudgetUtilizationTotal,
} from '../../../../../../../store/budgetUtilization/budgetUtilization.selectors';
import { IBudget } from '../../../../../store/teams/budgets/budgets.types';

const styles = {
  tableContainer: {
    borderTop: ({ palette }: Theme) => `2px solid ${palette.grey.medium}`,
  },
  footerTitle: {
    color: 'primary.main',
    fontSize: 16,
    fontWeight: '700',
  },
  utilizationText: {
    color: 'primary.main',
    fontWeight: '700',
    fontSize: 15,
    textAlign: 'right',
  },
  checkBoxSpace: {
    width: '58px',
  },
  budgetTotalContainer: {
    width: '170px',
  },
  flexBox: {
    display: 'flex',
  },
  warningIcon: {
    color: 'yellow.sunflower',
  },
} as const;

interface ITeamMembersBudgetFooterProps {
  existingBudget?: IBudget;
}

const TeamMembersBudgetFooter = ({ existingBudget }: ITeamMembersBudgetFooterProps): JSX.Element => {
  const membersWithUtilization = useSelector(getMembersWithUtilization);
  const teamUtilizationTotal = useSelector(getTeamBudgetUtilizationTotal);

  const { watch } = useFormContext();
  const refreshPeriod: RefreshPeriod = watch(BudgetCreateField.RefreshPeriod);
  const teamBudgets: ITeamMemberBudget[] = watch(BudgetCreateField.TeamMemberBudgets);

  const totalMemberBudgets = teamBudgets.reduce((prev, curr) => prev + curr.budget, 0);

  const removedMembersHasUtilization = useMemo(() => {
    const currentTeamMemberIds = existingBudget?.teamMembers.map(user => user.userId);
    return !membersWithUtilization.every(userId => currentTeamMemberIds?.includes(userId));
  }, [existingBudget?.teamMembers, membersWithUtilization]);

  return (
    <TableContainer sx={styles.tableContainer}>
      <Table>
        <TableFooter>
          <TableRow>
            <TableCell sx={styles.checkBoxSpace} />
            <TableCell sx={styles.budgetTotalContainer}>
              <Typography sx={styles.footerTitle}>Total</Typography>
            </TableCell>
            <TableCell>
              <Typography sx={styles.footerTitle}>
                <NumberFormat format="$ 0,0.00">{totalMemberBudgets}</NumberFormat> / {refreshPeriod}
              </Typography>
            </TableCell>
            <TableCell>
              <Box sx={styles.flexBox}>
                {removedMembersHasUtilization ? (
                  <Tooltip title={UTILIZATION_INCLUDES_REMOVED_USERS}>
                    <WarningIcon sx={styles.warningIcon} />
                  </Tooltip>
                ) : (
                  ''
                )}
                <Typography sx={styles.utilizationText}>
                  <NumberFormat format="$ 0,0.00">{teamUtilizationTotal}</NumberFormat>
                </Typography>
              </Box>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};

export default TeamMembersBudgetFooter;
