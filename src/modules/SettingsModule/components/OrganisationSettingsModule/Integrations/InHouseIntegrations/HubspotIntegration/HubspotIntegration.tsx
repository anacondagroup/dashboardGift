import React, { memo, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Features } from '@alycecom/modules';
import { StateStatus, openExternalLink } from '@alycecom/utils';

import {
  getHubspotIntegrationState,
  getHubspotIntegrationStatus,
} from '../../../../../store/organisation/integrations/hubspot/hubspot.selectors';
import hubspotIcon from '../../../../../../../assets/images/hubspot.png';
import { organisationHubspotIntegrationStatusCheckRequest } from '../../../../../store/organisation/integrations/hubspot/hubspot.actions';
import { IntegrationCard } from '../../IntegrationCard/IntegrationCard';
import { INTEGRATION_STATUS_ACTIVE } from '../../../../../constants/organizationSettings.constants';

const description =
  'Alyce for HubSpot is a fully integrated HubSpot application that enables marketers to add HubspotIntegration campaign members to Alyce for Marketing campaigns and deliver an automated campaign flow with triggers based on Alyce gift status.';
const troubleshootingLink = 'https://www.alyce.com/integrations/';

const HubspotIntegration = (): JSX.Element => {
  const dispatch = useDispatch();
  const hubspotIntegrationState = useSelector(getHubspotIntegrationState);
  const hubspotIntegrationStatus = useSelector(getHubspotIntegrationStatus);
  const hubspotFeatureFlagEnabled = useSelector(
    useMemo(() => Features.selectors.hasFeatureFlag(Features.FLAGS.HUBSPOT_INTEGRATION), []),
  );

  useEffect(() => {
    if (hubspotFeatureFlagEnabled) {
      dispatch(organisationHubspotIntegrationStatusCheckRequest());
    }
  }, [hubspotFeatureFlagEnabled, dispatch]);

  return (
    <IntegrationCard
      title="HubSpot"
      isLoading={hubspotIntegrationState === StateStatus.Pending}
      logoSrc={hubspotIcon}
      description={description}
      status={hubspotIntegrationStatus === INTEGRATION_STATUS_ACTIVE ? hubspotIntegrationStatus : null}
      shouldGoToMarketplace
      open={() => openExternalLink(window.APP_CONFIG.hubspotAppHost)}
      troubleshootingLink={troubleshootingLink}
    />
  );
};
export default memo(HubspotIntegration);
