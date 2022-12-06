import React, { useCallback } from 'react';
import { Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { useLazyGetTransactionsReportQuery } from '@alycecom/services';

import { getDateRange, getHasOperations, getPagination, getSelectedTypes } from '../../../store/operations';
import DownloadLink from '../../../../../components/Shared/DownloadLink';
import AccountBalance from '../../AccountBalance';
import { getSelectedGroupOrTeam } from '../../../store/customerOrg';

const styles = {
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    width: 1,
    mb: 1,
  },
  linkWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
} as const;

const Overview = (): JSX.Element => {
  const {
    deposit: { accountId },
    balanceAccountId,
  } = useSelector(getSelectedGroupOrTeam);
  const { from, to } = useSelector(getDateRange);
  const operationTypes = useSelector(getSelectedTypes);
  const { total } = useSelector(getPagination);
  const hasOperations = useSelector(getHasOperations);

  const [downloadTransactionsReport, { isFetching }] = useLazyGetTransactionsReportQuery();

  const handleDownloadReport = useCallback(() => {
    downloadTransactionsReport({
      accountId,
      filters: {
        dateRange: from && to ? { from, to, toIncluded: true, fromIncluded: true } : undefined,
        operationTypes,
        page: 1,
        perPage: total,
      },
    });
  }, [downloadTransactionsReport, accountId, from, to, operationTypes, total]);

  const resourceAccountId = balanceAccountId || accountId;

  return (
    <Box sx={styles.root}>
      <AccountBalance accountId={resourceAccountId} fromDate={from} toDate={to} />
      {hasOperations && (
        <Box sx={styles.linkWrapper}>
          <DownloadLink
            onDownloadClick={handleDownloadReport}
            label="Download report"
            iconName="file-download"
            isLoading={isFetching}
          />
        </Box>
      )}
    </Box>
  );
};

export default Overview;
