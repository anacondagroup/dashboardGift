import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import { Box, Tooltip, Grid } from '@mui/material';
import { NumberFormat, Divider, AlyceTheme } from '@alycecom/ui';

import KpiValue from '../../../../../components/Dashboard/Overview/KpiValue';
import { getResources, getStats, getTeamsFilter } from '../../../store/customerOrg';
import BreakdownHeader from '../BillingTableBreakdown/BreakdownHeader';

const styles = {
  KPIValue: {
    pr: 2,
    color: ({ palette }: AlyceTheme) => palette.text.primary,
  },
} as const;

const BillingOverview = () => {
  const stats = useSelector(getStats);
  const resources = useSelector(getResources);
  const { groupIds } = useSelector(getTeamsFilter);
  const inventoryResourceAvailable = groupIds.length === 0;

  return (
    <Grid container item xs={12}>
      <Grid item xs={12}>
        <Box mb={3}>
          <Grid item xs={10}>
            <BreakdownHeader title="Account Usage" subtitle="" />
            <Box pr={3}>
              <Divider />
            </Box>
          </Grid>
        </Box>
      </Grid>
      <Grid container item xs={6}>
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="flex-start"
          alignItems="center"
          flexWrap="nowrap"
          data-testid="kpi-wrapper-conversion"
          ml={4}
        >
          <Box pl={0} pb={2}>
            <KpiValue
              sx={styles.KPIValue}
              isLoading={stats.isLoading}
              title="Total users"
              value={<span data-testid="PlatformUsage.TotalUsers">{stats.users}</span>}
            />
          </Box>
          <Box pl={5} pb={2}>
            <KpiValue
              sx={styles.KPIValue}
              isLoading={stats.isLoading}
              title="Total teams"
              value={<span data-testid="PlatformUsage.TotalTeams">{stats.teams}</span>}
            />
          </Box>
          <Box pl={5} pb={2}>
            <KpiValue
              sx={styles.KPIValue}
              isLoading={resources.isLoading}
              title="Remaining Physical Invitations"
              value={
                <span data-testid="PlatformUsage.PhysicalInvites">
                  {inventoryResourceAvailable ? (
                    <NumberFormat format="0,0">{resources.remainingInvites}</NumberFormat>
                  ) : (
                    <Tooltip title="There’s no inventory assigned to Groups" placement="top">
                      <span>N/A</span>
                    </Tooltip>
                  )}
                </span>
              }
            />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default memo(BillingOverview);
