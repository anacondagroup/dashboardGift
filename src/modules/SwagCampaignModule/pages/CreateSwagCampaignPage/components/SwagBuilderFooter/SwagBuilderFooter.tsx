import React, { useCallback } from 'react';
import { CampaignSettings, IBuilderFooter } from '@alycecom/modules';
import { useHistory } from 'react-router-dom';

export interface ISwagBuilderFooterProps extends Omit<IBuilderFooter, 'onClickReturn'> {}

const SwagBuilderFooter = ({ ...footerProps }: ISwagBuilderFooterProps): JSX.Element => {
  const { push } = useHistory();

  const handleGoBackToAllCampaigns = useCallback(() => {
    push('/settings/campaigns');
  }, [push]);

  return <CampaignSettings.BuilderFooter onClickReturn={handleGoBackToAllCampaigns} {...footerProps} />;
};

export default SwagBuilderFooter;
