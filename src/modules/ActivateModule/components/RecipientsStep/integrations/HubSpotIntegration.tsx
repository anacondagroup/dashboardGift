import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Features } from '@alycecom/modules';

import IntegrationItem from '../IntegrationItem/IntegrationItem';
import hubspotLogo from '../../../assets/images/hubspot.png';

interface IHubSpotIntegrationItemProps {
  onSelect: () => void;
}

export const HubSpotIntegrationItem = ({ onSelect }: IHubSpotIntegrationItemProps): JSX.Element => {
  const isIntegrationEnabled = useSelector(
    useMemo(() => Features.selectors.hasFeatureFlags(Features.FLAGS.HUBSPOT_INTEGRATION), []),
  );
  const onClickHandler = useCallback(() => {
    if (isIntegrationEnabled) {
      onSelect();
    }
  }, [isIntegrationEnabled, onSelect]);

  return (
    <IntegrationItem
      logo={hubspotLogo}
      alt="HubSpot"
      title="Use HubSpot integration"
      integrationName="HubSpot"
      description="Use your marketing automation integration with this Alyce Activate campaign"
      link="https://www.alyce.com/integrations"
      isEnabled={isIntegrationEnabled}
      isActive={isIntegrationEnabled}
      isLoading={false}
      onClick={onClickHandler}
    />
  );
};
