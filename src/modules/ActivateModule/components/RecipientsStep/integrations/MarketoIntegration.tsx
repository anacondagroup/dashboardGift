import React, { useCallback, useEffect, useMemo } from 'react';
import { Features } from '@alycecom/modules';
import { useDispatch, useSelector } from 'react-redux';

import marketoLogo from '../../../assets/images/marketo.png';
import { loadMarketoIntegrationDataRequest } from '../../../store/steps/recipients/marketo/marketo.actions';
import IntegrationItem from '../IntegrationItem/IntegrationItem';
import {
  getIsMarketoDataLoading,
  getMarketoData,
  getMarketoErrors,
} from '../../../store/steps/recipients/marketo/marketo.selectors';

interface MarketoIntegrationItemProps {
  onSelect: () => void;
}

const MarketoIntegrationItem = ({ onSelect }: MarketoIntegrationItemProps): JSX.Element => {
  const dispatch = useDispatch();
  const isIntegrationEnabled = useSelector(useMemo(() => Features.selectors.hasFeatureFlag('marketoIntegration'), []));
  const isLoading = useSelector(getIsMarketoDataLoading);
  const data = useSelector(getMarketoData);
  const error = useSelector(getMarketoErrors);

  useEffect(() => {
    if (isIntegrationEnabled) {
      dispatch(loadMarketoIntegrationDataRequest());
    }
  }, [dispatch, isIntegrationEnabled]);

  const onClickHandler = useCallback(() => {
    if (data) {
      onSelect();
    }
  }, [data, onSelect]);

  return (
    <IntegrationItem
      logo={marketoLogo}
      alt="Marketo"
      integrationName="Marketo"
      title="Use Marketo integration"
      description="Use your marketing automation integration with this Alyce Activate campaign"
      link="https://www.alyce.com/marketo"
      isEnabled={isIntegrationEnabled}
      isActive={!!data}
      error={error?.integration ? error.integration[0] : ''}
      isLoading={isLoading}
      onClick={onClickHandler}
    />
  );
};

export default MarketoIntegrationItem;
