import React from 'react';
import { Table, TableCell, TableFooter, TableRow, Theme, Typography, TableContainer, Box } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import { Tooltip } from '@alycecom/ui';

import { RefreshPeriod } from '../../../../../store/teams/budgetCreate/budgetCreate.types';
import { UTILIZATION_INCLUDES_REMOVED_USERS } from '../../../../../constants/budget.constants';

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
  refresh: RefreshPeriod;
  totalMemberBudgets: number;
  totalMembersUtilization: number;
  removedMembersHasUtilization: boolean;
}

const TeamMembersBudgetFooter = ({
  refresh,
  totalMemberBudgets,
  totalMembersUtilization,
  removedMembersHasUtilization,
}: ITeamMembersBudgetFooterProps): JSX.Element => (
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
              $ {totalMemberBudgets.toLocaleString('en')} / {refresh}
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
              <Typography sx={styles.utilizationText}>$ {totalMembersUtilization.toLocaleString('en')}</Typography>
            </Box>
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  </TableContainer>
);

export default TeamMembersBudgetFooter;
