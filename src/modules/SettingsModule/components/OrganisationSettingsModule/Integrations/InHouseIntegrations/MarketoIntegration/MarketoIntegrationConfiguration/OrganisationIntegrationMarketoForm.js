import React, { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { ActionButton, BaseField, CancelButton } from '@alycecom/ui';
import { Box, Grid, IconButton, InputAdornment, Paper, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import moment from 'moment';

import { DISPLAY_DATE_TIME_FORMAT } from '../../../../../../../../constants/dateFormats.constants';
import { marketoApiDataShape } from '../../../../../../shapes/marketoApiData.shape';

const useStyles = makeStyles(({ spacing, palette }) => ({
  icon: {
    marginRight: spacing(1),
    fontSize: '1rem',
  },
  docsLink: {
    display: 'inline-block',
  },
  noteBlock: {
    backgroundColor: palette.green.fruitSaladLight,
    height: 58,
  },
  warningBlock: {
    backgroundColor: palette.error.light,
    height: 58,
  },
  copyLink: {
    marginLeft: spacing(2),
  },
  field: {
    marginTop: spacing(3),
  },
  timestamps: {
    borderTop: `1px solid ${palette.divider}`,
  },
}));

const OrganisationIntegrationMarketoFormComponent = ({ marketoApiData, errors, onCreate, onUpdate, onRemove }) => {
  const classes = useStyles();
  const [isSecretVisible, setIsSecretVisible] = useState(!marketoApiData.clientSecret);

  const [apiUrl, setApiUrl] = useState(marketoApiData.apiUrl || '');
  const [clientId, setClientId] = useState(marketoApiData.clientId || '');
  const [clientSecret, setClientSecret] = useState(marketoApiData.clientSecret || '');

  const isConnectDisabled = useMemo(() => !apiUrl || !clientSecret || !clientId, [apiUrl, clientSecret, clientId]);

  const createdAt = moment(marketoApiData.createdAt).format(DISPLAY_DATE_TIME_FORMAT);

  const handleCreate = useCallback(() => {
    const request = {
      clientId,
      clientSecret,
      apiUrl,
    };
    onCreate(request);
  }, [clientId, clientSecret, apiUrl, onCreate]);
  const handleUpdate = useCallback(() => {
    const request = {
      clientId,
      clientSecret,
    };
    onUpdate(request);
  }, [clientId, clientSecret, onUpdate]);

  return (
    <Paper elevation={1}>
      <Box p={3}>
        <Grid container className={classes.field}>
          <Grid item xs={5}>
            <BaseField
              value={apiUrl || ''}
              onChange={e => setApiUrl(e.target.value)}
              errors={errors}
              name="apiUrl"
              label="Rest API Endpoint"
              placeholder="Rest API Endpoint"
              required
              fullWidth
              disabled={!!marketoApiData.uuid}
            />
          </Grid>
        </Grid>
        <Grid container className={classes.field}>
          <Grid item xs={5}>
            <BaseField
              value={clientId || ''}
              onChange={e => setClientId(e.target.value)}
              name="clientId"
              errors={errors}
              label="Client Id"
              placeholder="Client Id"
              required
              fullWidth
            />
          </Grid>
        </Grid>
        <Grid container className={classes.field}>
          <Grid item xs={5}>
            <BaseField
              value={clientSecret}
              onChange={e => setClientSecret(e.target.value)}
              name="clientSecret"
              required
              fullWidth
              errors={errors}
              label="Client Secret"
              type={clientSecret && isSecretVisible ? 'text' : 'password'}
              InputProps={{
                ...(clientSecret
                  ? {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            className={classes.iconButton}
                            onClick={() => setIsSecretVisible(!isSecretVisible)}
                            size="large"
                          >
                            {isSecretVisible ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }
                  : {}),
              }}
            />
          </Grid>
        </Grid>
        <Grid container className={classes.field}>
          {!!marketoApiData.uuid && (
            <Box mr={2}>
              <ActionButton width={260} onClick={handleUpdate} data-testid="MarketoIntegration.UpdateBtn">
                Update integration
              </ActionButton>
            </Box>
          )}
          {!marketoApiData.status ? (
            <ActionButton
              width={260}
              onClick={handleCreate}
              disabled={isConnectDisabled}
              data-testid="MarketoIntegration.ConnectBtn"
            >
              Connect integration
            </ActionButton>
          ) : (
            <CancelButton width={260} onClick={() => onRemove()} data-testid="MarketoIntegration.DisconnectBtn">
              Disconnect integration
            </CancelButton>
          )}
        </Grid>
        {marketoApiData.status && (
          <Box mt={3} pt={4} className={classes.timestamps}>
            <Typography className="Subcopy-Static">Connected on {createdAt}</Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

OrganisationIntegrationMarketoFormComponent.propTypes = {
  marketoApiData: marketoApiDataShape.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  errors: PropTypes.object.isRequired,
  onCreate: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

OrganisationIntegrationMarketoFormComponent.defaultProps = {};

export default OrganisationIntegrationMarketoFormComponent;
