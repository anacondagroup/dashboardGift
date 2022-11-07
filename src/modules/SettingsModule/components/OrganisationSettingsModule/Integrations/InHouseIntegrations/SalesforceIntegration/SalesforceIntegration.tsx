import React, { memo, useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Features } from '@alycecom/modules';

import { IConfigurableIntegration, Integrations, TIntegrationStatus } from '../models/IntegrationsModels';
import { organisationApplicationsRequest } from '../../../../../store/organisation/applications/organisationApplications.actions';
import { loadOAuthState } from '../../../../../store/organisation/integrations/salesforce/sfOauth.actions';
import {
  INTEGRATION_STATUS_ACTIVE,
  INTEGRATION_STATUS_ATTENTION,
  INTEGRATION_STATUS_LOCKED,
} from '../../../../../constants/organizationSettings.constants';
import salesforceIcon from '../../../../../../../assets/images/salesdorce.png';
import {
  getOAuthIsLoading,
  getOAuthState,
} from '../../../../../store/organisation/integrations/salesforce/sfOAuth.selectors';
import { getApplications } from '../../../../../store/organisation/applications/organisationApplications.selectors';
import { ConnectionState } from '../../../../../store/organisation/integrations/salesforce/sfOAuth.types';
import { useOpenIntegration } from '../../../../../hooks/useOpenIntegration';
import { IntegrationCard } from '../../IntegrationCard/IntegrationCard';

interface IIntegratedApplication {
  type: string;
  status: TIntegrationStatus;
}

const description =
  'Alyce for Salesforce is a Salesforce AppExchange certified integration that allows Salesforce users to visualize all of their Alyce gifting details and data within Salesforce as well as send Alyce gifts without leaving their Salesforce instance.';

const SalesforceIntegration = ({ url }: IConfigurableIntegration): JSX.Element => {
  const dispatch = useDispatch();
  const oAuthState = useSelector(getOAuthState);
  const isLoading = useSelector(getOAuthIsLoading);
  const applications = useSelector(getApplications) as IIntegratedApplication[];
  const salesforceAvailable = useSelector(
    useMemo(() => Features.selectors.hasFeatureFlag(Features.FLAGS.SALES_FORCE_APP_ACCESS), []),
  );
  const salesforceApiIntegrationAvailable = useSelector(
    useMemo(() => Features.selectors.hasFeatureFlag(Features.FLAGS.SF_API_INTEGRATION), []),
  );

  useEffect(() => {
    if (salesforceAvailable) {
      dispatch(organisationApplicationsRequest());
      dispatch(loadOAuthState());
    }
  }, [salesforceAvailable, dispatch]);

  const getSalesforceIntegrationStatus = useCallback(() => {
    if (!salesforceAvailable) {
      return INTEGRATION_STATUS_LOCKED;
    }

    const sfApplication = applications.find(app => app.type === Integrations.Salesforce);
    if (sfApplication === undefined) {
      return null;
    }

    if (
      sfApplication.status === INTEGRATION_STATUS_ACTIVE &&
      salesforceApiIntegrationAvailable &&
      oAuthState !== ConnectionState.Connected
    ) {
      return INTEGRATION_STATUS_ATTENTION;
    }

    return sfApplication.status;
  }, [salesforceApiIntegrationAvailable, oAuthState, applications, salesforceAvailable]);

  const selectIntegration = useOpenIntegration(url);

  return (
    <IntegrationCard
      title="Salesforce"
      isLoading={isLoading}
      logoSrc={salesforceIcon}
      description={description}
      status={getSalesforceIntegrationStatus()}
      shouldGoToMarketplace={false}
      open={() => selectIntegration(Integrations.Salesforce)}
    />
  );
};
export default memo(SalesforceIntegration);
