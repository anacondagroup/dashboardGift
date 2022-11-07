import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Features } from '@alycecom/modules';

import eloquaLogo from '../../../assets/images/eloqua.png';
import IntegrationItem from '../IntegrationItem/IntegrationItem';

interface EloquaIntegrationItemProps {
  onSelect: () => void;
}

const EloquaIntegrationItem = ({ onSelect }: EloquaIntegrationItemProps): JSX.Element => {
  const isIntegrationEnabled = useSelector(
    useMemo(() => Features.selectors.hasFeatureFlags(Features.FLAGS.ELOQUA_INTEGRATION), []),
  );

  const onClickHandler = useCallback(() => {
    if (isIntegrationEnabled) {
      onSelect();
    }
  }, [isIntegrationEnabled, onSelect]);

  return (
    <IntegrationItem
      logo={eloquaLogo}
      alt="Eloqua"
      integrationName="Eloqua"
      title="Use Eloqua integration"
      description="Use your marketing automation integration with this Alyce Activate campaign"
      link="https://www.alyce.com/integrations"
      isEnabled={isIntegrationEnabled}
      isActive={isIntegrationEnabled}
      isLoading={false}
      onClick={onClickHandler}
    />
  );
};

export default EloquaIntegrationItem;
