import React, { memo, useCallback, useRef, useState } from 'react';
import { REQUEST_DATE_FORMAT, SelectFilter, DateRangeSelectorCalendar, DISPLAY_DATE_FORMAT } from '@alycecom/ui';
import { MenuItem, Box, Grid, Popover } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { TRoiPeriod } from '@alycecom/services';
import moment from 'moment';

import { getRoiCurrentPeriod } from '../../../store/filters/filters.selectors';
import { setRoiFilters } from '../../../store/filters';
import { ALYCE_FOUNDATION_DATE, ROI_DATA_PERIODS } from '../../../utils';

import RoiFilterTypeSelector from './RoiFilterTypeSelector';

const styles = {
  filter: {
    width: 300,
    ml: 2,
  },
  calendarPopup: {
    pointerEvents: 'none',
    '& .MuiPopover-paper': {
      pointerEvents: 'auto',
    },
  },
} as const;

const TODAY = moment().format(REQUEST_DATE_FORMAT);
const TOMORROW = moment().add(1, 'days').format(REQUEST_DATE_FORMAT);
const getComputedValue = (value: TRoiPeriod) => `${value.from}-${value.to}`;

const RoiFilters = (): JSX.Element => {
  const dispatch = useDispatch();

  const selectRef = useRef(null);
  const [isCalendarOpened, setIsCalendarOpened] = useState(false);
  const [from, setFrom] = useState(TODAY);
  const [to, setTo] = useState(TODAY);
  const period = useSelector(getRoiCurrentPeriod);

  const handleDateRangeSelect = (newPeriod: typeof period | null) => {
    if (newPeriod === null) {
      setIsCalendarOpened(true);
      return;
    }
    dispatch(setRoiFilters({ period: newPeriod }));
  };

  const handleCloseCalendar = useCallback(() => {
    setIsCalendarOpened(false);
  }, []);
  const handleApplyCustom = useCallback(
    (range: typeof period) => {
      setFrom(range.from);
      setTo(range.to);
      setIsCalendarOpened(false);
      dispatch(setRoiFilters({ period: range }));
    },
    [dispatch],
  );

  return (
    <Grid container item xs="auto" alignSelf="end">
      <Grid item>
        <RoiFilterTypeSelector />
      </Grid>
      <Grid item>
        <Box sx={styles.filter}>
          <SelectFilter
            name="filters"
            label="Time Range"
            value={getComputedValue(period)}
            fullWidth
            selectProps={{
              ref: selectRef,
            }}
            renderItems={() => [
              ...ROI_DATA_PERIODS.map(({ label, value }) => (
                <MenuItem
                  key={getComputedValue(value)}
                  value={getComputedValue(value)}
                  onClick={() => handleDateRangeSelect(value)}
                >
                  {label}
                </MenuItem>
              )),
              <MenuItem
                key="custom-range"
                value={getComputedValue({ from, to })}
                onClick={() => handleDateRangeSelect(null)}
              >
                Custom Range
              </MenuItem>,
            ]}
          />

          <Popover
            open={isCalendarOpened}
            onClose={handleCloseCalendar}
            anchorEl={selectRef.current}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            sx={styles.calendarPopup}
          >
            <DateRangeSelectorCalendar
              from={from}
              to={to}
              format={REQUEST_DATE_FORMAT}
              displayFormat={DISPLAY_DATE_FORMAT}
              onApply={handleApplyCustom}
              onCancel={handleCloseCalendar}
              dataTestId="ROIDateRangeCalendar"
              minDate={ALYCE_FOUNDATION_DATE}
              maxDate={TOMORROW}
            />
          </Popover>
        </Box>
      </Grid>
    </Grid>
  );
};

export default memo(RoiFilters);
