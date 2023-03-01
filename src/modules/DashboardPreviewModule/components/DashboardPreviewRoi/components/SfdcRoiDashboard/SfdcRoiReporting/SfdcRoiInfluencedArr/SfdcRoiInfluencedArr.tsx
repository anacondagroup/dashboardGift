import React, { memo, useState } from 'react';
import { ParentSize } from '@visx/responsive';
import { Box, Card, CardContent } from '@mui/material';
import { TTotalInfluencedByDeal } from '@alycecom/services';

import {
  getDealTypesValues,
  getRoiDatesRange,
  toFormattedPrice,
} from '../../../../../../../DashboardModule/components/DashboardRoi/utils';
import { RoiInfluencedARRPreviewBarChart } from '../../RoiInfluencedArrBarChart';
import {
  RoiDealTypesFilter,
  StyledRoiSectionTitle,
} from '../../../../../../../DashboardModule/components/DashboardRoi/components/Shared';
import { dashboardMock } from '../../../../../../dashboardmockup';

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

const influencedArrList = dashboardMock.chartRevenue;

const SfdcRoiInfluencedARR = (): JSX.Element => {
  const [selectedDealTypes, setSelectedDealTypes] = useState<string[]>(dashboardMock.chartKeys);
  const dealTypesValues = getDealTypesValues(influencedArrList, selectedDealTypes);

  return (
    <Card>
      <CardContent>
        <Box sx={styles.header}>
          <StyledRoiSectionTitle sx={styles.title}>Influenced Revenue by Deal Type</StyledRoiSectionTitle>
          <RoiDealTypesFilter
            dealTypes={selectedDealTypes}
            dealTypesSelected={selectedDealTypes}
            onChange={setSelectedDealTypes}
          />
        </Box>
        <Box sx={styles.container}>
          <ParentSize>
            {({ width, height }) => (
              <RoiInfluencedARRPreviewBarChart
                data={influencedArrList}
                keys={selectedDealTypes}
                barStackData={dealTypesValues}
                XGetter={getX}
                YGetter={getY}
                axisLeftLabelFormat={axisLeftFormat}
                axisBottomLabelFormat={axisBottomFormat}
                width={width}
                height={height}
              />
            )}
          </ParentSize>
        </Box>
      </CardContent>
    </Card>
  );
};

export default memo(SfdcRoiInfluencedARR);
