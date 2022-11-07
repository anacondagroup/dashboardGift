import React, { useCallback } from 'react';
import { CampaignSettings, IBuilderFooter } from '@alycecom/modules';
import { useHistory } from 'react-router-dom';

export interface IProspectingBuilderFooterProps extends Omit<IBuilderFooter, 'onClickReturn'> {}

const ProspectingBuilderFooter = ({ ...footerProps }: IProspectingBuilderFooterProps): JSX.Element => {
  const { push } = useHistory();

  const handleGoBackToAllCampaigns = useCallback(() => {
    push('/settings/campaigns');
  }, [push]);

  return <CampaignSettings.BuilderFooter onClickReturn={handleGoBackToAllCampaigns} {...footerProps} />;
};

export default ProspectingBuilderFooter;
