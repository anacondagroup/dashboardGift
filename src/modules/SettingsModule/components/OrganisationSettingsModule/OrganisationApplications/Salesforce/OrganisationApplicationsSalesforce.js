import React, { useCallback, useEffect, useMemo, useState } from 'react';
import * as R from 'ramda';
import moment from 'moment';
import PropTypes from 'prop-types';
import { TrackEvent } from '@alycecom/services';
import { useDispatch, useSelector } from 'react-redux';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Box, Grid, Paper, Typography, InputAdornment, IconButton } from '@mui/material';
import { makeStyles } from '@mui/styles';
import {
  ActionButton,
  BaseField,
  LinkButton,
  DashboardIcon,
  ModalConfirmationMessage,
  CopyToClipboardButton,
  BaseButton,
} from '@alycecom/ui';
import { Features, HasFeature } from '@alycecom/modules';
import { useRouting } from '@alycecom/hooks';

import {
  organisationApplicationsCreate,
  organisationApplicationsRequest,
  organisationApplicationsUpdate,
} from '../../../../store/organisation/applications/organisationApplications.actions';
import { DISPLAY_DATE_TIME_FORMAT } from '../../../../../../constants/dateFormats.constants';
import { getApplications } from '../../../../store/organisation/applications/organisationApplications.selectors';
import DashboardLayout from '../../../../../../components/Dashboard/Shared/DashboardLayout';
import {
  disconnectFromOAuth,
  finishOauthFlow,
  loadOAuthState,
  startLoadOauthFlowLink,
} from '../../../../store/organisation/integrations/salesforce/sfOauth.actions';
import {
  getOAuthConnectedAt,
  getOAuthLink,
  getOauthErrorMessage,
  getOAuthState,
  getConnectedBy,
} from '../../../../store/organisation/integrations/salesforce/sfOAuth.selectors';
import { ConnectionState } from '../../../../store/organisation/integrations/salesforce/sfOAuth.types';

const useStyles = makeStyles(({ spacing, palette }) => ({
  icon: {
    marginRight: spacing(1),
    fontSize: '1rem',
  },
  docsLink: {
    display: 'inline-block',
    marginLeft: spacing(1),
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
  secretField: {
    marginTop: spacing(2),
  },
  disconnectedLabel: {
    color: palette.error.main,
    marginLeft: spacing(1),
    fontSize: '16px',
    lineHeight: '1.5',
  },
  connectedLabel: {
    color: palette.green.fruitSalad,
    marginLeft: spacing(1),
    fontSize: '16px',
    fontWeight: 'bold',
    lineHeight: '1.5',
  },
}));

const datetimePipe = datestring => {
  const localMinuteOffset = moment().utcOffset();

  return moment(datestring).add(localMinuteOffset, 'm').format(DISPLAY_DATE_TIME_FORMAT);
};

const OrganisationApplicationsSalesforce = ({ parentUrl }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const go = useRouting();
  const applications = useSelector(getApplications);
  const oAuthState = useSelector(getOAuthState);
  const connectedByEmail = useSelector(getConnectedBy);
  const oAuthConnectedAt = useSelector(getOAuthConnectedAt);
  const oAuthLink = useSelector(getOAuthLink);
  const { trackEvent } = TrackEvent.useTrackEvent();
  const oAuthErrorMessage = useSelector(getOauthErrorMessage);
  const [isSecretVisible, setIsSecretVisible] = useState(false);
  const [secretWillUpdate, setSecretWillUpdate] = useState(false);
  const [oAuthDisconnectPopupShown, setOAuthDisconnectPopupShown] = useState(false);
  const [oAuthErrorPopupShown, setOAuthErrorPopupShown] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [applicationId, setApplicationId] = useState('');
  const isAuthorizeButtonDisabled = oAuthState === ConnectionState.Connected || oAuthLink === null;
  const connectedBy = connectedByEmail ? ` by ${connectedByEmail}` : '';
  const application = useMemo(() => {
    const sfApps = R.filter(R.propEq('type', 'salesforce'), applications);
    if (sfApps.length === 1) {
      return sfApps[0];
    }
    return sfApps.reduce((a, b) => (new Date(a.created) > new Date(b.created) ? a : b), {});
  }, [applications]);

  const createdAt = useMemo(() => application && application.applicationId && datetimePipe(application.created), [
    application,
  ]);

  useEffect(() => {
    const listener = event => {
      if (event.data === null) {
        return;
      }

      dispatch(finishOauthFlow(event.data));

      if (event.data.state === ConnectionState.Error) {
        setOAuthErrorPopupShown(true);
      }

      dispatch(loadOAuthState());
    };

    window.addEventListener('message', listener);
    return function cleanup() {
      window.removeEventListener('message', listener);
    };
  }, [dispatch]);

  const startOauthFlow = useCallback(() => {
    trackEvent('Enterprise Dashboard - Clicked Connect to Salesforce button');
    window.open(oAuthLink, '_blank');
  }, [oAuthLink, trackEvent]);
  const updatedAt = useMemo(() => application && application.applicationId && datetimePipe(application.updated), [
    application,
  ]);

  useEffect(() => {
    if (oAuthState !== ConnectionState.Connected) {
      dispatch(startLoadOauthFlowLink());
    }
  }, [oAuthState, dispatch]);

  const oAuthDisconnectConfirm = () => {
    setOAuthDisconnectPopupShown(true);
  };

  const oAuthDisconnect = useCallback(() => {
    setOAuthDisconnectPopupShown(false);
    dispatch(disconnectFromOAuth());
  }, [dispatch]);

  useEffect(() => {
    dispatch(organisationApplicationsRequest());
    dispatch(loadOAuthState());
  }, [dispatch]);

  useEffect(() => {
    setApplicationId(application ? application.applicationId : '');
  }, [application]);

  const isSecretAvailable = useMemo(
    () => application && application.applicationSecret && application.applicationSecret !== '************',
    [application],
  );
  const handleConnectSalesforce = useCallback(() => {
    dispatch(organisationApplicationsCreate({ type: 'salesforce' }));
    setUpdated(true);
  }, [dispatch]);
  const handleRegenerateSalesforce = useCallback(
    id => {
      setSecretWillUpdate(false);
      dispatch(organisationApplicationsUpdate(id));
      setUpdated(true);
    },
    [dispatch],
  );

  const handleUpdateSecret = useCallback(() => {
    setSecretWillUpdate(true);
  }, []);

  return (
    <DashboardLayout>
      <Box mb={3}>
        <LinkButton onClick={() => go(parentUrl)}>
          <DashboardIcon icon="arrow-left" color="link" className={classes.icon} />
          Back to all integrations
        </LinkButton>
      </Box>
      <Box mb={2}>
        <Typography className="H3-Dark">Connect Alyce and Salesforce</Typography>
        <Typography component="div" className="Body-Regular-Left-Inactive">
          Please follow these steps to connect your Salesforce account with Alyce. Once you’ve generated a key and
          secret below, you will need to go to your Salesforce account to add them and finish the connection.
        </Typography>
      </Box>
      <Paper elevation={1}>
        <Box p={3}>
          {!application || !application.applicationId ? (
            <ActionButton width={260} onClick={handleConnectSalesforce}>
              Generate a new key and secret
            </ActionButton>
          ) : (
            <ActionButton width={260} onClick={handleUpdateSecret}>
              Regenerate a new key and secret
            </ActionButton>
          )}
          {updated ? (
            <Box mt={1} mb={3} p={2} className={classes.warningBlock}>
              <DashboardIcon icon="exclamation-triangle" color="white" className={classes.icon} />
              <Typography display="inline" className="Subcopy-White">
                Your secret will only be available after generation and will be hidden afterwards, please make sure to
                copy and store it securely immediately so that you will not lose the information.
              </Typography>
            </Box>
          ) : (
            <Box mt={1} mb={3} p={2} className={classes.noteBlock}>
              <DashboardIcon icon="graduation-cap" color="default-salad" className={classes.icon} />
              <Typography display="inline" className="Subcopy-Static">
                Generating a new key and secret will disconnect any existing Alyce Salesforce integration automatically.
              </Typography>
            </Box>
          )}
          <Grid container>
            <Grid item xs={5}>
              <BaseField
                value={applicationId || ''}
                name="salesforce_key"
                label="Salesforce Key"
                placeholder="Salesforce Key"
                fullWidth
              />
            </Grid>
            <Grid container item xs={7} alignItems="center">
              {application && application.applicationId && (
                <CopyToClipboardButton title="Copy key" value={application.applicationId || ''} />
              )}
            </Grid>
          </Grid>
          <Grid container className={classes.secretField}>
            <Grid item xs={5}>
              <BaseField
                value={isSecretAvailable ? application.applicationSecret : '************'}
                name="salesforce_secret"
                label="Salesforce Secret"
                placeholder="Salesforce Secret"
                disabled={!isSecretAvailable}
                fullWidth
                type={isSecretAvailable && isSecretVisible ? 'text' : 'password'}
                InputProps={{
                  ...(isSecretAvailable
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
            <Grid container item xs={7} alignItems="center">
              {isSecretAvailable && <CopyToClipboardButton title="Copy secret" value={application.applicationSecret} />}
            </Grid>
          </Grid>
          {createdAt && updatedAt && (
            <Box mt={3} pt={3} className={classes.timestamps}>
              <Typography className="Subcopy-Static">
                Connected on {createdAt} | Last activity on {updatedAt}
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>
      <HasFeature featureKey={Features.FLAGS.SF_API_INTEGRATION}>
        <Box mt={4} mb={2}>
          <Typography className="H3-Dark">Connect Alyce to Salesforce</Typography>
          <Typography component="div" className="Body-Regular-Left-Inactive">
            Please ensure you have received the required credentials from your admin. To learn more
            <LinkButton className={classes.docsLink}>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://help.alyce.com/category/201-salesforce-integration"
              >
                view our help docs
              </a>
            </LinkButton>
          </Typography>
        </Box>
        <Paper elevation={1}>
          <Box mt={3} mr={2} mb={3} ml={2}>
            <Grid alignItems="center" container>
              <Grid alignItems="flex-start" item xs={6}>
                <Box ml={2}>
                  <Grid alignItems="flex-start" container>
                    <Grid item>
                      <Grid alignItems="flex-start" spacing={2} container>
                        <Grid item>
                          <Box mr={3}>
                            {oAuthState === ConnectionState.Connected ? 'Authorized' : 'Authorization required'}
                          </Box>
                        </Grid>
                        <Grid item>
                          {oAuthState === ConnectionState.Connected ? (
                            <>
                              <Grid alignItems="flex-start" container>
                                <Grid item>
                                  <DashboardIcon icon="check" color="default-salad" />
                                </Grid>
                                <Grid item>
                                  <Typography className={classes.connectedLabel}>
                                    Connected - Alyce can send data to Salesforce
                                  </Typography>
                                </Grid>
                              </Grid>
                            </>
                          ) : (
                            <>
                              <Grid alignItems="flex-start" container>
                                <Grid item>
                                  <DashboardIcon icon="exclamation-circle" color="error" />
                                </Grid>
                                <Grid item>
                                  <Typography className={classes.disconnectedLabel}>
                                    Disconnected - Alyce can not send data to Salesforce
                                  </Typography>
                                </Grid>
                              </Grid>
                            </>
                          )}
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography className="Subcopy-Static">
                        {oAuthConnectedAt ? `Connected on ${datetimePipe(oAuthConnectedAt)} ${connectedBy}` : ''}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
              <Grid style={{ textAlign: 'right' }} item xs={6}>
                <Box>
                  <BaseButton
                    onClick={oAuthDisconnectConfirm}
                    disabled={oAuthState !== ConnectionState.Connected}
                    style={{ marginRight: '12px' }}
                  >
                    Disconnect
                  </BaseButton>
                  <ActionButton onClick={startOauthFlow} disabled={isAuthorizeButtonDisabled} height={48} width={210}>
                    Authorize connection
                  </ActionButton>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </HasFeature>
      <ModalConfirmationMessage
        title="Are you sure you want to replace your current Secret code?"
        submitButtonText="Generate a secret code"
        cancelButtonText="Cancel"
        isOpen={secretWillUpdate}
        width="100%"
        onSubmit={() => {
          setSecretWillUpdate(false);
          handleRegenerateSalesforce(applicationId);
        }}
        onDiscard={() => {
          setSecretWillUpdate(false);
        }}
      >
        <Typography className="Body-Regular-Left-Static">
          Regenerating your secret code will disable any current connection using these codes.
          <br />
          That means any systems utilizing this information will no longer work until they are updated with the new
          secret.
          <br />
          Please make sure no critical processes will be affected by this action before continuing.
          <br />
          Please make sure no critical processes will be affected by this action before continuing.
        </Typography>
        <Box mt={2}>
          <Typography className="Body-Regular-Left-Static">How do you want to proceed?</Typography>
        </Box>
      </ModalConfirmationMessage>

      <ModalConfirmationMessage
        title="Disconnect Alyce from Salesforce?"
        submitButtonText="Disconnect"
        cancelButtonText="Cancel"
        isOpen={oAuthDisconnectPopupShown}
        width="100%"
        onSubmit={() => oAuthDisconnect()}
        onDiscard={() => setOAuthDisconnectPopupShown(false)}
      >
        <Typography className="Body-Regular-Left-Static">
          Alyce will not be able to send any data to Saleforce. You will need to authorize the connection to send new
          data from Alyce to Salesforce.
        </Typography>
      </ModalConfirmationMessage>

      <ModalConfirmationMessage
        title="Connection Error"
        submitButtonText="Ok"
        isOpen={oAuthErrorPopupShown}
        width="100%"
        onSubmit={() => setOAuthErrorPopupShown(false)}
      >
        <Typography className="Body-Regular-Left-Static">
          Connection was not authorized successfully. {oAuthErrorMessage}. To learn more
          <LinkButton className={classes.docsLink}>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://help.alyce.com/category/201-salesforce-integration"
            >
              view our help docs
            </a>
          </LinkButton>
        </Typography>
      </ModalConfirmationMessage>
    </DashboardLayout>
  );
};

OrganisationApplicationsSalesforce.propTypes = {
  parentUrl: PropTypes.string.isRequired,
};

export default OrganisationApplicationsSalesforce;
