import { useHistory } from 'react-router-dom';
import { useMemo } from 'react';

import { SwagCampaignBuilderStep, SwagCampaignRoutes, SwagCampaignMode } from '../routePaths';

export type TUseSwagValue = {
  isBuilder: boolean;
  campaignId: number | null;
  step: SwagCampaignBuilderStep | null;
};

export const useSwag = (): TUseSwagValue => {
  const {
    location: { pathname },
  } = useHistory();
  const { mode, campaignId: paramCampaignId, step } = useMemo(() => SwagCampaignRoutes.matchBasePath(pathname) || {}, [
    pathname,
  ]);
  const campaignId = Number(paramCampaignId);

  return useMemo(
    () => ({
      isBuilder: mode === SwagCampaignMode.Builder,
      campaignId: Number(campaignId) || null,
      step: campaignId ? step || null : SwagCampaignBuilderStep.Details,
    }),
    [mode, campaignId, step],
  );
};
