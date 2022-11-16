import React, { memo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DateRangeSelect } from '@alycecom/ui';

import { useBillingTrackEvent } from '../../../hooks/useBillingTrackEvent';
import { getDateRange, setDateRange } from '../../../store/operations';

const DateFilter = () => {
  const dispatch = useDispatch();
  const trackEvent = useBillingTrackEvent();

  const dateRange = useSelector(getDateRange);
  const handleChangeDateRange = useCallback(
    newDateRange => {
      dispatch(setDateRange(newDateRange));
      trackEvent('Deposit ledger - Date filter - Changed', { range: newDateRange });
    },
    [dispatch, trackEvent],
  );

  return (
    <DateRangeSelect
      from={dateRange.from}
      to={dateRange.to}
      onChange={handleChangeDateRange}
      format="YYYY-MM-DD"
      label="Date range"
      fullWidth
      dataTestId="DepositLedger.DateRange"
    />
  );
};

export default memo(DateFilter);
