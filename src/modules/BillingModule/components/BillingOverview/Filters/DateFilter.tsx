import React, { useCallback } from 'react';
import { DateRangeSelect } from '@alycecom/ui';
import { useDispatch, useSelector } from 'react-redux';

import { useBillingTrackEvent } from '../../../hooks/useBillingTrackEvent';
import { BILLING_DATA_MIN_DATE } from '../../../constants/billing.constants';
import { getDateRange } from '../../../store/ui/overviewFilters/overviewFilters.selectors';
import { setDateRange } from '../../../store/ui/overviewFilters/overviewFilters.reducer';

const DateFilter = (): JSX.Element => {
  const dispatch = useDispatch();

  const trackEvent = useBillingTrackEvent();
  const dateRange = useSelector(getDateRange);

  const handleChangeDateRange = useCallback(
    newDateRange => {
      dispatch(setDateRange(newDateRange));
      trackEvent('Overview - Date filter - Changed', { range: newDateRange });
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
      minDate={BILLING_DATA_MIN_DATE}
    />
  );
};

export default DateFilter;
