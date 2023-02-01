import React, { memo, useEffect } from 'react';
import moment from 'moment';
import { ParentSize } from '@visx/responsive';
import { Box, Card, CardContent } from '@mui/material';
import {
  TTotalInfluencedByDeal,
  useGetTotalInfluencedArrByDealQuery,
  useGetTotalDealTypesQuery,
} from '@alycecom/services';
import { useSelector } from 'react-redux';
import { useDebouncedSetState } from '@alycecom/hooks';

import { getDealTypesValues, getLegendKeys, getRoiDatesRange, toFormattedPrice } from '../../../../utils';
import { RoiInfluencedARRBarChart } from '../../../Shared/RoiInfluencedArrBarChart';
import { getRoiFilters } from '../../../../store/filters/filters.selectors';
import { RoiDealTypesFilter, StyledRoiSectionTitle } from '../../../Shared';
import { RoiTooltipRow } from '../../../Shared/RoiChartTooltip';

const styles = {
  header: {
    display: 'flex',
    alignItems: 'start',
  },
  title: { margin: '4px 0 32px 16px' },
  tooltipTitle: {
    display: 'flex',
    fontWeight: 700,
    mb: 1,
  },
  container: {
    height: 280,
    mb: 2,
    mt: 7,
  },
  grid: {
    width: '100%',
    height: '100%',
    fontSize: '16px',
    margin: '0',
  },
  tooltipBox: { textAlign: 'start', justifyContent: 'start', textOverflow: 'ellipsis' },
} as const;

const getX = (d: Partial<TTotalInfluencedByDeal>): string => getRoiDatesRange(d.startDate, d.endDate);
const getY = (d: TTotalInfluencedByDeal): number => d.totalInfluenced;

const axisLeftFormat = (val: number) => toFormattedPrice(val, '0a').toUpperCase();
const axisBottomFormat = (val: string) => val.slice(0, -5).toUpperCase();

const SfdcRoiInfluencedARR = (): JSX.Element => {
  const globalFilters = useSelector(getRoiFilters);

  const { data: dealTypesListResponse } = useGetTotalDealTypesQuery();
  const [selectedDealTypes, setSelectedDealTypes] = useDebouncedSetState(dealTypesListResponse?.data || []);

  const { data: influencedArrByDealResponse, isFetching } = useGetTotalInfluencedArrByDealQuery({
    ...globalFilters,
    dealTypes: selectedDealTypes,
  });
  const influencedArrList = !isFetching && !!influencedArrByDealResponse?.data ? influencedArrByDealResponse.data : [];
  const legendKeys = getLegendKeys(influencedArrList);
  const dealTypesValues = getDealTypesValues(influencedArrList, selectedDealTypes);

  const renderTooltip = (tooltipData: Partial<TTotalInfluencedByDeal>) => {
    const { startDate, endDate } = tooltipData;
    if (!startDate || !endDate) {
      return null;
    }
    const startDateFormatted = moment(startDate).format('MMM D, YYYY');
    const endDateFormatted = moment(endDate).format('MMM D, YYYY');

    const tooltipTitle =
      startDateFormatted === endDateFormatted ? startDateFormatted : `${startDateFormatted} - ${endDateFormatted}`;
    const tooltipDataFiltered = Object.entries(tooltipData).filter(keyEntry => legendKeys.includes(keyEntry[0]));

    return (
      <Box display="flex" flexDirection="column">
        <Box sx={styles.tooltipTitle}>{tooltipTitle}</Box>
        {tooltipDataFiltered.map(tooltipValue => (
          <RoiTooltipRow
            key={tooltipValue[0]}
            label={tooltipValue[0]}
            value={toFormattedPrice(Number(tooltipValue[1]), '0.0a').toUpperCase()}
          />
        ))}
      </Box>
    );
  };

  useEffect(() => {
    if (dealTypesListResponse?.data) {
      setSelectedDealTypes(dealTypesListResponse.data);
    }
  }, [setSelectedDealTypes, dealTypesListResponse]);

  return (
    <Card>
      <CardContent>
        <Box sx={styles.header}>
          <StyledRoiSectionTitle sx={styles.title}>Influenced Revenue by Deal Type</StyledRoiSectionTitle>
          <RoiDealTypesFilter
            dealTypes={dealTypesListResponse?.data || []}
            dealTypesSelected={selectedDealTypes}
            onChange={setSelectedDealTypes}
          />
        </Box>
        <Box sx={styles.container}>
          <ParentSize>
            {({ width, height }) => (
              <RoiInfluencedARRBarChart
                data={influencedArrList}
                keys={selectedDealTypes}
                barStackData={dealTypesValues}
                XGetter={getX}
                YGetter={getY}
                axisLeftLabelFormat={axisLeftFormat}
                axisBottomLabelFormat={axisBottomFormat}
                isLoading={isFetching}
                width={width}
                height={height}
                tooltipRender={renderTooltip}
              />
            )}
          </ParentSize>
        </Box>
      </CardContent>
    </Card>
  );
};

export default memo(SfdcRoiInfluencedARR);
