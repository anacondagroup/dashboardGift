import React, { memo, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Features } from '@alycecom/modules';

import { IntegrationCard } from '../../IntegrationCard/IntegrationCard';
import {
  getIsLoadingMarketo,
  getMarketoApiData,
  getMarketoIntegrations,
} from '../../../../../store/organisation/integrations/marketo/marketo.selectors';
import { IConfigurableIntegration, Integrations, TIntegrationStatus } from '../models/IntegrationsModels';
import { organisationMarketoIntegrationsRequest } from '../../../../../store/organisation/integrations/marketo/marketo.actions';
import marketoIcon from '../../../../../../../assets/images/marketo.png';
import { useOpenIntegration } from '../../../../../hooks/useOpenIntegration';
import { INTEGRATION_STATUS_LOCKED } from '../../../../../constants/organizationSettings.constants';

interface IMarketoIntegrationModel {
  uuid: string;
  status: TIntegrationStatus;
}

const description =
  'Alyce for Marketo is a best-in-class marketing automation integration that empowers marketers to make better marketing decisions, run more effective integrated campaigns, and provide better personal gifting experiences for buyers.';

const MarketoIntegration = ({ url }: IConfigurableIntegration): JSX.Element => {
  const dispatch = useDispatch();
  const marketoIntegrations = useSelector(getMarketoIntegrations) as IMarketoIntegrationModel[];
  const marketoApiData = useSelector(getMarketoApiData);
  const isLoading = useSelector(getIsLoadingMarketo);

  const marketoFeatureFlagEnabled = useSelector(
    useMemo(() => Features.selectors.hasFeatureFlag(Features.FLAGS.MARKETO_INTEGRATION), []),
  );

  useEffect(() => {
    if (marketoFeatureFlagEnabled) {
      dispatch(organisationMarketoIntegrationsRequest());
    }
  }, [marketoFeatureFlagEnabled, dispatch]);

  const resultingIntegrationData = {
    ...marketoIntegrations[0],
    application: marketoApiData,
  };

  const selectIntegration = useOpenIntegration(url);
  return (
    <IntegrationCard
      title="Marketo"
      isLoading={!!isLoading}
      logoSrc={marketoIcon}
      description={description}
      status={marketoFeatureFlagEnabled ? resultingIntegrationData.status : INTEGRATION_STATUS_LOCKED}
      shouldGoToMarketplace={false}
      open={() => selectIntegration(Integrations.Marketo, resultingIntegrationData.uuid)}
    />
  );
};
export default memo(MarketoIntegration);
