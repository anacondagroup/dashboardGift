import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { AlyceLoading, LinkButton, DashboardIcon, ModalConfirmationMessage } from '@alycecom/ui';
import { useDispatch, useSelector } from 'react-redux';
import { useRouting } from '@alycecom/hooks';

import DashboardLayout from '../../../../../../../../components/Dashboard/Shared/DashboardLayout';
import {
  getMarketoApiData,
  getSyncErrors,
  getErrors,
  getIsLoadingMarketo,
  getMarketoAvailableActivities,
  getMarketoStatus,
  getLastSyncAt,
  getMarketoEnabledActivities,
  isSyncLoadingSelector,
  getMarketoWebhooks,
  getMarketoAlyceGiftObject,
} from '../../../../../../store/organisation/integrations/marketo/marketo.selectors';
import {
  organisationMarketoIntegrationRequest,
  organisationMarketoIntegrationActivitiesAvailable,
  organisationMarketoIntegrationActivitiesEnabled,
  organisationMarketoIntegrationActivitiesSync,
  organisationMarketoIntegrationActivitiesSyncStatus,
  organisationMarketoIntegrationCreate,
  organisationMarketoIntegrationDisconnect,
  organisationMarketoIntegrationUpdate,
  organisationMarketoIntegrationWebhooksRequest,
  organisationMarketoIntegrationAlyceGiftObjectRequest,
  organisationIntegrationSetCustomObjectStateRequest,
} from '../../../../../../store/organisation/integrations/marketo/marketo.actions';

import OrganisationIntegrationMarketoSyncActivities from './OrganisationIntegrationMarketoSyncActivities';
import OrganisationIntegrationMarketoForm from './OrganisationIntegrationMarketoForm';
import OrganisationIntegrationMarketoWebhook from './OrganisationIntegrationMarketoWebhook';
import OrganisationIntegrationAlyceGIftObject from './OrganisationIntegrationAlyceGiftObject';

const useStyles = makeStyles(({ spacing, palette }) => ({
  icon: {
    marginRight: spacing(1),
    fontSize: '1rem',
  },
  docsLink: {
    display: 'inline-block',
  },
  warningBlock: {
    backgroundColor: palette.error.light,
    height: 58,
  },
}));

const OrganisationIntegrationMarketoComponent = ({ uuid, parentUrl }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const go = useRouting();
  const marketoApiData = useSelector(getMarketoApiData);
  const marketoStatus = useSelector(getMarketoStatus);
  const marketoWebhook = useSelector(getMarketoWebhooks);
  const alyceGiftObject = useSelector(getMarketoAlyceGiftObject);
  const isLoading = useSelector(getIsLoadingMarketo);
  const availableActivities = useSelector(getMarketoAvailableActivities);
  const enabledActivities = useSelector(getMarketoEnabledActivities);
  const errors = useSelector(getErrors);
  const syncErrors = useSelector(getSyncErrors);
  const isSyncLoading = useSelector(isSyncLoadingSelector);
  const [secretWillUpdate, setSecretWillUpdate] = useState(false);
  const syncAt = useSelector(getLastSyncAt);

  const isInactive = useMemo(() => marketoApiData.status === 'inactive', [marketoApiData]);
  const marketoApiDataUuid = useMemo(() => marketoApiData.uuid, [marketoApiData]);

  useEffect(() => {
    if (uuid) {
      dispatch(organisationMarketoIntegrationRequest(uuid));
      if (marketoApiDataUuid) {
        dispatch(organisationMarketoIntegrationActivitiesAvailable(uuid));
        dispatch(organisationMarketoIntegrationWebhooksRequest(uuid));
        dispatch(organisationMarketoIntegrationActivitiesEnabled(uuid));
        dispatch(organisationMarketoIntegrationAlyceGiftObjectRequest(uuid));
      }
    }
  }, [dispatch, uuid, marketoApiDataUuid]);

  useEffect(() => {
    if (marketoStatus === 'active') {
      if (uuid === '' && marketoApiDataUuid) {
        go(`${parentUrl}marketo/${marketoApiDataUuid}`);
      }
    }
  }, [go, dispatch, marketoStatus, marketoApiDataUuid, uuid, parentUrl]);

  useEffect(() => {
    if (marketoStatus === 'active' && uuid) {
      dispatch(organisationMarketoIntegrationActivitiesSyncStatus(uuid));
    }
  }, [dispatch, uuid, marketoStatus]);

  const handleConnectMarketo = useCallback(
    request => {
      dispatch(organisationMarketoIntegrationCreate(request));
    },
    [dispatch],
  );

  const handleUpdateMarketo = useCallback(
    request => {
      dispatch(organisationMarketoIntegrationUpdate(marketoApiData.uuid, request));
    },
    [dispatch, marketoApiData],
  );

  const handleDisconnectMarketo = useCallback(() => {
    setSecretWillUpdate(true);
  }, []);

  const handleSyncActivities = useCallback(
    newActivities => {
      dispatch(
        organisationMarketoIntegrationActivitiesSync(
          marketoApiData.uuid,
          newActivities.filter(item => item.active),
        ),
      );
    },
    [dispatch, marketoApiData],
  );

  const handleCustomObjectChange = useCallback(
    (customObjectName, newValue) => {
      dispatch(
        organisationIntegrationSetCustomObjectStateRequest({
          uuid: marketoApiDataUuid,
          customObjectName,
          newValue,
        }),
      );
    },
    [dispatch, marketoApiDataUuid],
  );

  const onSubmitHandle = useCallback(() => {
    setSecretWillUpdate(false);
    dispatch(organisationMarketoIntegrationDisconnect(marketoApiData.uuid));
    go(parentUrl);
  }, [go, dispatch, parentUrl, marketoApiData]);

  return (
    <DashboardLayout>
      <Box mb={3}>
        <LinkButton onClick={() => go(parentUrl)}>
          <DashboardIcon icon="arrow-left" color="link" className={classes.icon} />
          Back to all integrations
        </LinkButton>
      </Box>
      <Box mb={2}>
        <Typography className="H3-Dark">Connect Alyce and Marketo</Typography>
        <Typography component="div" className="Body-Regular-Left-Inactive">
          Please follow these steps to connect your Alyce account to the Marketo integration. If you need any help, feel
          free to reach out to us or{' '}
          <LinkButton className={classes.docsLink}>
            {/* eslint-disable react/jsx-no-target-blank */}
            <a
              target="_blank"
              rel="noopener"
              href="https://help.alyce.com/article/140-installing-the-alyce-for-marketo-integration"
            >
              {' '}
              view our help docs
            </a>
          </LinkButton>
        </Typography>
      </Box>

      {isInactive && marketoApiData.statusDescription && (
        <Box mt={1} mb={3} p={2} className={classes.warningBlock}>
          <DashboardIcon icon="exclamation-triangle" color="white" className={classes.icon} />
          <Typography display="inline" className="Subcopy-White">
            {marketoApiData.statusDescription}
          </Typography>
        </Box>
      )}

      <AlyceLoading isLoading={isLoading}>
        <OrganisationIntegrationMarketoForm
          marketoApiData={marketoApiData}
          errors={errors}
          onCreate={handleConnectMarketo}
          onUpdate={handleUpdateMarketo}
          onRemove={handleDisconnectMarketo}
        />
      </AlyceLoading>

      <AlyceLoading isLoading={marketoWebhook.isLoading}>
        <Box pt={4}>
          <OrganisationIntegrationMarketoWebhook webhooks={marketoWebhook.values} />
        </Box>
      </AlyceLoading>

      {marketoStatus === 'active' && (
        <AlyceLoading isLoading={alyceGiftObject.isLoading}>
          <Box pt={4}>
            <OrganisationIntegrationAlyceGIftObject
              value={alyceGiftObject.value}
              error={alyceGiftObject.error}
              syncError={alyceGiftObject.syncErrors && alyceGiftObject.syncErrors[0]}
              onChange={handleCustomObjectChange}
            />
          </Box>
        </AlyceLoading>
      )}

      {!!marketoApiDataUuid && !isInactive && (
        <AlyceLoading isLoading={isSyncLoading}>
          <Box pt={4}>
            <OrganisationIntegrationMarketoSyncActivities
              availableActivities={availableActivities}
              enabledActivities={enabledActivities}
              sync={syncAt || ''}
              errors={syncErrors}
              onSync={handleSyncActivities}
            />
          </Box>
        </AlyceLoading>
      )}

      <ModalConfirmationMessage
        title="Are you sure you want to disconnect your integration with Marketo?"
        submitButtonText="Disconnect"
        cancelButtonText="Cancel"
        isOpen={secretWillUpdate}
        width="100%"
        onSubmit={onSubmitHandle}
        onDiscard={() => {
          setSecretWillUpdate(false);
        }}
      >
        <Typography className="Body-Regular-Left-Static">
          This action will disable all activity and lead creation within Marketo.
        </Typography>
        <Box mt={2}>
          <Typography className="Body-Regular-Left-Static">How do you want to proceed?</Typography>
        </Box>
      </ModalConfirmationMessage>
    </DashboardLayout>
  );
};

OrganisationIntegrationMarketoComponent.propTypes = {
  uuid: PropTypes.string.isRequired,
  parentUrl: PropTypes.string.isRequired,
};

export default OrganisationIntegrationMarketoComponent;
