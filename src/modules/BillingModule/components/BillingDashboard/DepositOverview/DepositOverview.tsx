import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { NumberFormat, AlyceTheme, Divider } from '@alycecom/ui';
import classNames from 'classnames';
import { Features, HasFeature } from '@alycecom/modules';
import { Link } from 'react-router-dom';

import BreakdownHeader from '../BillingTableBreakdown/BreakdownHeader';
import KpiValue from '../../../../../components/Dashboard/Overview/KpiValue';
import { getResources, getSelectedGroup } from '../../../store/customerOrg';

const useStyles = makeStyles<AlyceTheme>(theme => ({
  KPIValueBudget: {
    paddingRight: theme.spacing(2),
    color: theme.palette.green.dark,
    '&:hover': {
      color: theme.palette.green.dark,
    },
  },
  negativeDeposit: {
    color: theme.palette.red.main,
    '&:hover': {
      color: theme.palette.red.main,
    },
  },
  linkText: {
    color: theme.palette.grey.main,
    '&:hover': {
      color: theme.palette.grey.main,
    },
  },
}));

const DepositOverview = () => {
  const classes = useStyles();

  const resources = useSelector(getResources);
  const groupName = useSelector(getSelectedGroup);

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
                isLoading={resources.isLoading}
                title="Total gift budget"
                value={
                  <span
                    data-testid="PlatformUsage.GiftDeposit"
                    className={classNames({ [classes.negativeDeposit]: resources.remainingDeposit < 0 })}
                  >
                    <NumberFormat format="$0,0.00">{resources.remainingDeposit}</NumberFormat>
                  </span>
                }
                className={classes.KPIValueBudget}
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
                <span
                  data-testid="PlatformUsage.GiftDeposit"
                  className={resources.remainingDeposit < 0 ? classes.negativeDeposit : classes.KPIValueBudget}
                >
                  <NumberFormat format="$0,0.00">{resources.remainingDeposit}</NumberFormat>
                </span>
              }
            />
            <Typography className="Body-Small-Static">
              <Link to="/billing/deposit-ledger" className={classes.linkText}>
                Click here to see detailed info
              </Link>
            </Typography>
          </Box>
        </Box>
      </HasFeature>
    </HasFeature>
  );
};

export default memo(DepositOverview);
