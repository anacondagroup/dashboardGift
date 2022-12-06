import React from 'react';
import { Box } from '@mui/material';
import { NumberFormat, Divider } from '@alycecom/ui';
import { useGetBalanceByAccountIdQuery } from '@alycecom/services';
import { skipToken } from '@reduxjs/toolkit/query';

import KpiValue from '../../../../components/Dashboard/Overview/KpiValue';

import { styles } from './AccountBalance.styles';

export interface IAccountBalanceProps {
  accountId?: string;
  fromDate?: string;
  toDate?: string;
}

const AccountBalance = ({ accountId, fromDate, toDate }: IAccountBalanceProps): JSX.Element => {
  const { data: balance, isFetching } = useGetBalanceByAccountIdQuery(
    accountId
      ? {
          accountId,
          filters: fromDate && toDate ? { dateRange: { from: fromDate, to: toDate } } : undefined,
        }
      : skipToken,
  );
  const { amountAtTheStart, amountAtTheEnd } = balance || { amountAtTheStart: 0, amountAtTheEnd: 0 };

  const isAtTheStartAmountPositive = amountAtTheStart > 0;
  const isAtTheStartAmountNegative = amountAtTheStart < 0;

  const isAtTheEndAmountPositive = amountAtTheEnd > 0;
  const isAtTheEndAmountNegative = amountAtTheEnd < 0;

  return (
    <Box sx={styles.root}>
      <KpiValue
        sx={styles.kpiItem}
        sxTitle={styles.kpiTitle}
        isLoading={isFetching}
        title="Ending balance"
        value={
          <Box
            component="span"
            sx={[
              styles.dateKpi,
              styles.endBalance,
              isAtTheEndAmountPositive && styles.positive,
              isAtTheEndAmountNegative && styles.negative,
            ]}
            data-testid="DepositLedger.BillingOperations.RemainingDeposit"
          >
            <NumberFormat format="$0,0.00">{amountAtTheEnd}</NumberFormat>
          </Box>
        }
      />
      <Divider orientation="vertical" color="additional.chambray20" />
      <KpiValue
        sx={styles.kpiItem}
        sxTitle={styles.kpiTitle}
        isLoading={isFetching}
        title="Opening balance"
        value={
          <Box
            component="span"
            sx={[
              styles.dateKpi,
              styles.startBalance,
              isAtTheStartAmountPositive && styles.positive,
              isAtTheStartAmountNegative && styles.negative,
            ]}
            data-testid="DepositLedger.BillingOperations.RemainingDeposit"
          >
            <NumberFormat format="$0,0.00">{amountAtTheStart}</NumberFormat>
          </Box>
        }
      />
    </Box>
  );
};

export default AccountBalance;
