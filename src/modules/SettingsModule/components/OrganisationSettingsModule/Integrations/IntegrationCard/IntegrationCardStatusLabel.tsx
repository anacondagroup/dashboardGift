import React, { useMemo } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { Icon } from '@alycecom/ui';

import { TIntegrationStatus } from '../InHouseIntegrations/models/IntegrationsModels';
import {
  INTEGRATION_STATUS_ACTIVE,
  INTEGRATION_STATUS_ATTENTION,
  INTEGRATION_STATUS_CONNECTED,
  INTEGRATION_STATUS_ERROR,
  INTEGRATION_STATUS_INACTIVE,
  INTEGRATION_STATUS_LOCKED,
} from '../../../../constants/organizationSettings.constants';

interface IStatusLabelProps {
  status: TIntegrationStatus;
  title: string;
}
const IntegrationCardStatusLabel = ({ status, title }: IStatusLabelProps): JSX.Element | null => {
  const statusLabel = useMemo(() => {
    let label: JSX.Element | undefined;
    const statusDisconnected: JSX.Element = (
      <Grid>
        <Typography className="Body-Regular-Left-Error-Bold">
          <Icon data-testid={`Integrations.${title}.TimesIcon`} icon="times" color="red" />
          <Box pl={1} component="span">
            Disconnected
          </Box>
        </Typography>
      </Grid>
    );
    switch (status) {
      case INTEGRATION_STATUS_LOCKED:
        label = (
          <Grid>
            <Typography className="Body-Regular-Left-Disabled">
              <Icon data-testid={`Integrations.${title}.LockIcon`} icon={['fas', 'lock']} color="grey" />
              <Box pl={1} component="span">
                Locked
              </Box>
            </Typography>
          </Grid>
        );
        break;
      case INTEGRATION_STATUS_ACTIVE:
        label = (
          <Grid>
            <Typography className="Body-Regular-Left-Success-Bold">
              <Icon data-testid={`Integrations.${title}.CheckIcon`} icon="check" color="default-salad" />
              <Box pl={1} component="span">
                Active
              </Box>
            </Typography>
          </Grid>
        );
        break;
      case INTEGRATION_STATUS_CONNECTED:
        label = (
          <Grid>
            <Typography className="Body-Regular-Left-Success-Bold">
              <Icon data-testid={`Integrations.${title}.CheckIcon`} icon="check" color="default-salad" />
              <Box pl={1} component="span">
                Connected
              </Box>
            </Typography>
          </Grid>
        );
        break;
      case INTEGRATION_STATUS_INACTIVE:
        label = statusDisconnected;
        break;
      case INTEGRATION_STATUS_ERROR:
        label = statusDisconnected;
        break;
      case INTEGRATION_STATUS_ATTENTION:
        label = (
          <Grid>
            <Typography className="Body-Regular-Left-Warning-Bold">
              <Icon
                data-testid={`Integrations.${title}.ExclamationTriangleIcon`}
                icon="exclamation-triangle"
                color="secondary.dark"
              />
              <Box pl={1} component="span">
                Attention required
              </Box>
            </Typography>
          </Grid>
        );
        break;
      default:
        label = undefined;
    }
    return label;
  }, [status, title]);

  return statusLabel ? (
    <Grid item data-testid={`Integrations.${title}.Status`}>
      {statusLabel}
    </Grid>
  ) : null;
};

export default IntegrationCardStatusLabel;
