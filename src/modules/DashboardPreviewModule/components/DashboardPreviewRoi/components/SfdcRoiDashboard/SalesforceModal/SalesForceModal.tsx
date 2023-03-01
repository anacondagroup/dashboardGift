import React, { memo } from 'react';
import { AlyceTheme, Button } from '@alycecom/ui';
import { Box, List, Link, ListItem, Modal, Typography } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { useGetOrganizationSettingsQuery } from '@alycecom/services';
import { makeStyles } from '@mui/styles';

import SalesforceLogo from '../../../../../../DashboardModule/components/DashboardRoi/assets/images/salesforce-icon.svg';
import AlyceLogo from '../../../../../../../assets/images/alyce-logo-bird-full-color.svg';
import { SALESFORCE_HELP } from '../../../../../../DashboardModule/routePaths';

const useStyles = makeStyles<AlyceTheme>(({ palette, spacing }) => ({
  salesforceModal: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: palette.common.white,
    width: '35%',
    borderRadius: '4px',
    padding: spacing(5.5),
    color: palette.primary.light,
  },
  contentContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    fontSize: 16,
  },
  modalHeaderContainer: {
    marginBottom: spacing(3.5),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  modalHeader: {
    fontWeight: 400,
    fontSize: 28,
    textAlign: 'center',
  },
  modalButtonContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: spacing(2),
    marginTop: spacing(2),
  },
  buttons: {
    '&:hover': {
      backgroundColor: palette.green.mountainMeadowDark,
      color: palette.common.white,
    },
  },
  list: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    listStyleType: 'disc',
    width: 'fit-content',
  },
  listItem: {
    display: 'list-item',
    paddingLeft: 1,
  },
}));

const DashboardModal = () => {
  const styles = useStyles();
  const history = useHistory();
  const { data: orgSettingsData } = useGetOrganizationSettingsQuery();

  return (
    <Modal open>
      <Box className={styles.salesforceModal}>
        <Box className={styles.modalHeaderContainer}>
          <img src={SalesforceLogo} alt="salesforce" width="66" />
          +
          <img src={AlyceLogo} alt="bird" width="43" />
        </Box>
        <Box className={styles.contentContainer}>
          <Typography className={styles.modalHeader}>
            Turn insight into action, now with the power of the Alyce and Salesforce Integration
          </Typography>
          <Typography className={styles.contentContainer}>
            <List className={styles.list}>
              <ListItem className={styles.listItem}>See gifting influence on your entire pipeline</ListItem>
              <ListItem className={styles.listItem}>Share revenue results across your organization</ListItem>
              <ListItem className={styles.listItem}>Get the intel you need to optimize your full impact</ListItem>
            </List>
          </Typography>
        </Box>
        <Box className={styles.modalButtonContainer}>
          <Button className={styles.buttons} variant="outlined" onClick={() => history.push('/impact')}>
            Maybe later
          </Button>
          {orgSettingsData?.show_salesforce_cta ? (
            <Link href="/settings/organization/integrations" color="inherit">
              <Button className={styles.buttons} variant="outlined">
                Connect account
              </Button>
            </Link>
          ) : (
            <Link href={SALESFORCE_HELP} color="inherit">
              <Button className={styles.buttons} variant="outlined">
                Update Integration
              </Button>
            </Link>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default memo(DashboardModal);
