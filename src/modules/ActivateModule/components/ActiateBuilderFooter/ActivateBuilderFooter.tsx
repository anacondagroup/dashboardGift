import React, { useCallback } from 'react';
import { CampaignSettings, IBuilderFooter } from '@alycecom/modules';
import { useHistory } from 'react-router-dom';

export interface IActivateBuilderFooterProps extends Omit<IBuilderFooter, 'onClickReturn'> {}

const ActivateBuilderFooter = ({ ...footerProps }: IActivateBuilderFooterProps): JSX.Element => {
  const { push } = useHistory();

  const handleGoBackToAllCampaigns = useCallback(() => {
    push('/settings/campaigns');
  }, [push]);

  return <CampaignSettings.BuilderFooter onClickReturn={handleGoBackToAllCampaigns} {...footerProps} />;
};

export default ActivateBuilderFooter;
