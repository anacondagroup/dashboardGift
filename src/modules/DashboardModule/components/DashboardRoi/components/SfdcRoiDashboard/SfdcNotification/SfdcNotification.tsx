import React from 'react';
import { Box, Button, Typography, Link } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AlyceTheme, GlobalFonts } from '@alycecom/ui';
import { useGetOrganizationSettingsQuery } from '@alycecom/services';
import { makeStyles } from '@mui/styles';

import SalesforceLogo from '../../../assets/images/salesforce-icon.svg';
import AlyceLogo from '../../../../../../../assets/images/alyce-logo-bird-full-color.svg';
import { SALESFORCE_HELP } from '../../../../../routePaths';
import { showNotification } from '../../../../../../../store/common/notifications/notifications.actions';

const useStyles = makeStyles<AlyceTheme>(({ palette }) => ({
  salesforceNotification: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: GlobalFonts[':root']['--Mountain-Meadow-50'],
    color: GlobalFonts[':root']['--Chambray-100'],
    borderColor: palette.primary.common,
    borderRadius: '4px',
    padding: '15px',
  },
  contentContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  icon: {
    lineHeight: '12px',
    cursor: 'pointer',
  },
  tip: {
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: palette.common.white,
    '&:hover': {
      backgroundColor: palette.green.mountainMeadowDark,
      color: palette.common.white,
    },
  },
}));

const SfdcNotification = (): JSX.Element => {
  const history = useHistory();
  const dispatch = useDispatch();
  const styles = useStyles();
  const { data: orgSettingsData } = useGetOrganizationSettingsQuery();

  return (
    <Box className={styles.salesforceNotification} px={2}>
      <Box className={styles.contentContainer}>
        <img src={SalesforceLogo} alt="salesforce" width="58" />
        <Typography>+</Typography>
        <img src={AlyceLogo} alt="bird" width="42" />
        <Typography>
          <Typography display="inline" className={styles.tip}>
            Tip:
          </Typography>
          {orgSettingsData?.show_salesforce_cta
            ? ` Connect your Salesforce account and see a whole new world of data.`
            : ` Update your Salesforce plugin to the latest version and see a whole new world of data.`}
        </Typography>
        <Button className={styles.button} variant="outlined" onClick={() => history.push('./preview')}>
          Show me
        </Button>
        {orgSettingsData?.show_salesforce_cta ? (
          <Link href="/settings/organization/integrations" color="inherit">
            <Button className={styles.button} variant="outlined">
              Connect account
            </Button>
          </Link>
        ) : (
          <Link href={SALESFORCE_HELP} color="inherit">
            <Button className={styles.button} variant="outlined">
              Update Integration
            </Button>
          </Link>
        )}
      </Box>
      <Box className={styles.icon} onClick={() => dispatch(showNotification(false))}>
        <CloseIcon />
      </Box>
    </Box>
  );
};

export default SfdcNotification;
