import React, { useCallback } from 'react';
import { Box } from '@mui/material';
import { NumberFormat } from '@alycecom/ui';
import { useDispatch, useSelector } from 'react-redux';

import {
  downloadDepositLedgerReportRequest,
  getAmountAtTheEnd,
  getAmountAtTheStart,
  getBalanceIsLoading,
  getHasOperations,
  getOperationsReportDownloading,
} from '../../../store/operations';
import KpiValue from '../../../../../components/Dashboard/Overview/KpiValue';
import DownloadLink from '../../../../../components/Shared/DownloadLink';

const styles = {
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    width: 1,
    mb: 1,
  },
  kpiWrapper: {
    display: 'flex',
    justifyContent: 'flex-start',
  },
  linkWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  kpiItem: {
    alignItems: 'center',
    justifyContent: 'center',
    mx: 3,
  },
  totalKpi: {
    fontSize: 32,
    color: 'primary.main',
  },
  dateKpi: {
    fontSize: 24,
    color: 'primary.main',
  },
  negative: {
    color: 'red.main',
  },
} as const;

const Overview = (): JSX.Element => {
  const dispatch = useDispatch();

  const isLoading = useSelector(getBalanceIsLoading);
  const isDownloadingReport = useSelector(getOperationsReportDownloading);

  const amountAtTheStart = useSelector(getAmountAtTheStart);
  const amountAtTheEnd = useSelector(getAmountAtTheEnd);

  const hasOperations = useSelector(getHasOperations);

  const handleDownloadReport = useCallback(() => {
    dispatch(downloadDepositLedgerReportRequest());
  }, [dispatch]);

  return (
    <Box sx={styles.root}>
      <Box sx={styles.kpiWrapper}>
        <KpiValue
          sx={styles.kpiItem}
          isLoading={isLoading}
          title="At the start"
          value={
            <Box
              component="span"
              sx={[styles.dateKpi, amountAtTheStart < 0 && styles.negative]}
              data-testid="DepositLedger.BillingOperations.RemainingDeposit"
            >
              <NumberFormat format="$0,0.00">{amountAtTheStart}</NumberFormat>
            </Box>
          }
        />
        <KpiValue
          sx={styles.kpiItem}
          isLoading={isLoading}
          title="At the end"
          value={
            <Box
              component="span"
              sx={[styles.dateKpi, amountAtTheEnd < 0 && styles.negative]}
              data-testid="DepositLedger.BillingOperations.RemainingDeposit"
            >
              <NumberFormat format="$0,0.00">{amountAtTheEnd}</NumberFormat>
            </Box>
          }
        />
      </Box>
      {hasOperations && (
        <Box sx={styles.linkWrapper}>
          <DownloadLink
            onDownloadClick={handleDownloadReport}
            label="Download report"
            iconName="file-download"
            isLoading={isDownloadingReport}
          />
        </Box>
      )}
    </Box>
  );
};

export default Overview;
