import React, { memo, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { openExternalLink, StateStatus } from '@alycecom/utils';
import { Features } from '@alycecom/modules';

import eloquaIcon from '../../../../../../../assets/images/eloqua.png';
import { IntegrationCard } from '../../IntegrationCard/IntegrationCard';
import { organisationEloquaIntegrationInfoCheckRequest } from '../../../../../store/organisation/integrations/eloqua/eloqua.actions';
import {
  getOrganisationEloquaIntegrationRequestStatus,
  getOrganisationEloquaIntegrationUuid,
} from '../../../../../store/organisation/integrations/eloqua/eloqua.selectors';
import { INTEGRATION_STATUS_ACTIVE } from '../../../../../constants/organizationSettings.constants';

const description =
  'Alyce for Eloqua is a fully integrated Eloqua application that enables marketers to add Eloqua campaign members to Alyce 1:Many campaigns and deliver an automated campaign flow with triggers based on Alyce gift status.';
const troubleshootingLink = 'https://help.alyce.com/article/310-installing-the-alyce-integration-in-oracle-eloqua';
const marketplaceLink =
  'https://login.eloqua.com/Apps/Cloud/Admin/Catalog/Add/f87df937-1aca-43e6-afbe-532d54456015/CA-FD-66-EF-22-60-37-7C-CD-BA-11-BC-5A-5E-7B-80';

const EloquaIntegration = (): JSX.Element => {
  const dispatch = useDispatch();

  const eloquaOrganisationIntegrationRequestState = useSelector(getOrganisationEloquaIntegrationRequestStatus);
  const eloquaOrganisationIntegrationUuid = useSelector(getOrganisationEloquaIntegrationUuid);
  const eloquaFeatureFlagEnabled = useSelector(
    useMemo(() => Features.selectors.hasFeatureFlag(Features.FLAGS.ELOQUA_INTEGRATION), []),
  );

  useEffect(() => {
    if (eloquaFeatureFlagEnabled) {
      dispatch(organisationEloquaIntegrationInfoCheckRequest());
    }
  }, [dispatch, eloquaFeatureFlagEnabled]);

  return (
    <IntegrationCard
      title="Eloqua"
      isLoading={eloquaOrganisationIntegrationRequestState === StateStatus.Pending}
      logoSrc={eloquaIcon}
      description={description}
      status={eloquaOrganisationIntegrationUuid ? INTEGRATION_STATUS_ACTIVE : null}
      shouldGoToMarketplace
      open={() => openExternalLink(marketplaceLink)}
      troubleshootingLink={troubleshootingLink}
    />
  );
};
export default memo(EloquaIntegration);
