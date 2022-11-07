import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';

import { kpiShape } from '../../shapes/kpi.shape';

import KpiBlock from './KpiBlock';
import { campaignKPIs, fakeKPIs } from './overview.constants';

const DashboardKpi = ({ kpi, campaignType, isLoading }) => {
  const kpis = useMemo(() => campaignKPIs[campaignType](isLoading ? fakeKPIs : kpi), [campaignType, isLoading, kpi]);
  return (
    <Box display="flex" py={4} justifyContent="flex-start">
      {kpis.map(item => (
        <KpiBlock key={item.title} {...item} isLoading={isLoading} />
      ))}
    </Box>
  );
};

DashboardKpi.propTypes = {
  kpi: kpiShape.isRequired,
  isLoading: PropTypes.bool,
  campaignType: PropTypes.string,
};

DashboardKpi.defaultProps = {
  isLoading: false,
  campaignType: 'standard',
};

export default DashboardKpi;
