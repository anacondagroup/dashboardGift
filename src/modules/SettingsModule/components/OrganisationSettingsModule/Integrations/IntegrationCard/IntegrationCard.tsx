import React, { useMemo } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { ActionButton, AlyceTheme, BaseButton, Icon, LoadingWrapper } from '@alycecom/ui';
import { makeStyles } from '@mui/styles';

import { TIntegrationStatus } from '../InHouseIntegrations/models/IntegrationsModels';
import {
  INTEGRATION_STATUS_ACTIVE,
  INTEGRATION_STATUS_ERROR,
  INTEGRATION_STATUS_LOCKED,
} from '../../../../constants/organizationSettings.constants';

import IntegrationCardStatusLabel from './IntegrationCardStatusLabel';

export interface IIntegrationCardProps {
  title: string;
  description: string;
  logoSrc: string;
  status?: TIntegrationStatus;
  isLoading?: boolean;
  disabled?: boolean;
  shouldGoToMarketplace?: boolean;
  troubleshootingLink?: string;
  open: () => void;
}

const useStyles = makeStyles<AlyceTheme>(({ spacing, palette }) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    border: `solid 1px ${palette.divider}`,
    padding: spacing(3),
    maxWidth: 362,
    minWidth: 200,
    minHeight: 344,
  },
  titleContainer: {
    height: '35px',
  },
  icon: {
    objectFit: 'contain',
  },
}));

const ExternalLinkIcon = () => <Icon icon="external-link" fontSize={1} />;

export const IntegrationCard = ({
  title,
  logoSrc,
  status = null,
  isLoading = false,
  disabled = false,
  description,
  shouldGoToMarketplace = false,
  open,
  troubleshootingLink,
}: IIntegrationCardProps): JSX.Element => {
  const classes = useStyles();
  const isLocked = status === INTEGRATION_STATUS_LOCKED;

  const IntegrationButton = useMemo(() => {
    if (shouldGoToMarketplace || !status) return ActionButton;
    if (status === INTEGRATION_STATUS_ACTIVE && shouldGoToMarketplace) return ActionButton;
    return BaseButton;
  }, [shouldGoToMarketplace, status]);
  const integrationBtnWidth = shouldGoToMarketplace ? 260 : 108;

  const actionLabel = useMemo(() => {
    if (shouldGoToMarketplace) {
      return (
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" mr={1}>
            <ExternalLinkIcon />
          </Box>
          {`Go To ${title} Marketplace`}
        </Box>
      );
    }
    return status ? 'Manage' : 'Connect';
  }, [shouldGoToMarketplace, status, title]);

  return (
    <Grid item container direction="column" className={classes.root}>
      <Grid container className={classes.titleContainer}>
        <Grid item xs={10}>
          <Typography className="H4-Dark-Bold">{title}</Typography>
        </Grid>
        <Grid item xs={2}>
          <img src={logoSrc} alt={title} width={40} height={40} className={classes.icon} />
        </Grid>
      </Grid>

      <Grid container justifyContent="space-between" alignItems="center">
        <LoadingWrapper isLoading={isLoading}>
          <IntegrationCardStatusLabel status={status} title={title} />

          {status === INTEGRATION_STATUS_ERROR && troubleshootingLink && (
            <Grid item xs={5}>
              <a href={troubleshootingLink}>
                <ExternalLinkIcon />
                <Box pl={1} component="span">
                  Learn More
                </Box>
              </a>
            </Grid>
          )}
        </LoadingWrapper>
      </Grid>

      <Box pb={3} component="div">
        <Typography className="Body-Regular-Left-Inactive">{description}</Typography>
      </Box>
      <LoadingWrapper isLoading={isLoading}>
        {!isLocked && (
          <IntegrationButton
            size="small"
            disabled={disabled}
            width={integrationBtnWidth}
            data-testid={`Integrations.${title}.ActionBtn`}
            onClick={open}
          >
            {actionLabel}
          </IntegrationButton>
        )}
      </LoadingWrapper>
    </Grid>
  );
};
