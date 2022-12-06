import React, { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Grid } from '@mui/material';
import { Divider, NumberFormat } from '@alycecom/ui';
import { Features, HasFeature } from '@alycecom/modules';

import BreakdownHeader from '../BillingTableBreakdown/BreakdownHeader';
import KpiValue from '../../../../../components/Dashboard/Overview/KpiValue';
import { getResources, getSelectedGroup } from '../../../store/customerOrg';
import { setBillingTab } from '../../../store/ui/tab/tab.reducer';
import { BillingTab } from '../../../store/ui/tab/tab.types';

import { styles } from './DepositeOverview.styles';

const DepositOverview = (): JSX.Element => {
  const dispatch = useDispatch();

  const resources = useSelector(getResources);
  const groupName = useSelector(getSelectedGroup);

  const handleClickDetailsInfo = () => {
    dispatch(setBillingTab(BillingTab.Transactions));
  };

  return (
    <HasFeature featureKey={Features.FLAGS.SHOW_REMAINING_DEPOSITS}>
      <HasFeature
        featureKey={Features.FLAGS.SHOW_DEPOSIT_LEDGER}
        fallback={
          <Box pl={0} flex={1}>
            <Box mb={3}>
              <Grid item xs={10}>
                <BreakdownHeader title={groupName ? `${groupName} Current Balance` : `Current Balance`} subtitle="" />
                <Box pr={3}>
                  <Divider />
                </Box>
              </Grid>
            </Box>
            <Box ml={4}>
              <KpiValue
                sx={styles.KPIValueBudget}
                isLoading={resources.isLoading}
                title="Total gift budget"
                value={
                  <Box
                    component="span"
                    data-testid="PlatformUsage.GiftDeposit"
                    sx={resources.remainingDeposit < 0 ? styles.negativeDeposit : undefined}
                  >
                    <NumberFormat format="$0,0.00">{resources.remainingDeposit}</NumberFormat>
                  </Box>
                }
              />
            </Box>
          </Box>
        }
      >
        <Box pl={0} flex={1}>
          <Box mb={3}>
            <Grid item xs={10}>
              <BreakdownHeader title={groupName ? `${groupName} Current Balance` : `Current Balance`} subtitle="" />
              <Box pr={3}>
                <Divider />
              </Box>
            </Grid>
          </Box>

          <Box ml={4}>
            <KpiValue
              isLoading={resources.isLoading}
              title="Total gift budget"
              value={
                <Box
                  component="span"
                  data-testid="PlatformUsage.GiftDeposit"
                  sx={resources.remainingDeposit < 0 ? styles.negativeDeposit : styles.KPIValueBudget}
                >
                  <NumberFormat format="$0,0.00">{resources.remainingDeposit}</NumberFormat>
                </Box>
              }
            />
            <Button sx={styles.button} onClick={handleClickDetailsInfo}>
              Click here to see detailed info
            </Button>
          </Box>
        </Box>
      </HasFeature>
    </HasFeature>
  );
};

export default memo(DepositOverview);
