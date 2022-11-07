import React, { useCallback, useState } from 'react';
import { Box, Card, CardContent, ToggleButton, ToggleButtonGroup, ToggleButtonGroupProps } from '@mui/material';

import { AcceptedGiftsByCampaignPurposeChart, PipelineInfluencedByOpportunityChart } from '../../Shared/RoiCharts';

import styles from './SfdcRoiFunnel.styles';

enum SfdcCharts {
  OpportunityStage,
  CampaignPurpose,
}

const SfdcRoiFunnel = (): JSX.Element => {
  const [currentChart, setCurrentChart] = useState<SfdcCharts>(SfdcCharts.OpportunityStage);

  const handleChartToggle = useCallback<Required<ToggleButtonGroupProps>['onChange']>((e, newChart) => {
    setCurrentChart(value => (newChart === null ? value : newChart));
  }, []);

  return (
    <Card>
      <CardContent>
        <Box mb={3}>
          <ToggleButtonGroup
            color="primary"
            value={currentChart}
            exclusive
            onChange={handleChartToggle}
            aria-label="ROI Chart Toggle"
            sx={styles.toggle}
          >
            <ToggleButton value={SfdcCharts.OpportunityStage}>Opportunity Stage</ToggleButton>
            <ToggleButton value={SfdcCharts.CampaignPurpose}>Campaign Purpose</ToggleButton>
          </ToggleButtonGroup>
        </Box>
        {currentChart === SfdcCharts.OpportunityStage && <PipelineInfluencedByOpportunityChart />}
        {currentChart === SfdcCharts.CampaignPurpose && <AcceptedGiftsByCampaignPurposeChart />}
      </CardContent>
    </Card>
  );
};
export default SfdcRoiFunnel;
