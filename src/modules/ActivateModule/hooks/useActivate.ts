import { useHistory } from 'react-router-dom';
import { useMemo } from 'react';

import {
  ActivateBuilderStep,
  ActivateCampaignRoutes,
  ActivateEditorStep,
  ActivateEditorTab,
  ActivateModes,
} from '../routePaths';

export type TUseActivateValue = {
  isBuilder: boolean;
  isEditor: boolean;
  campaignId: number | null;
  step: ActivateBuilderStep | ActivateEditorStep | null;
  tab: ActivateEditorTab | null;
};

export const useActivate = (): TUseActivateValue => {
  const {
    location: { pathname },
  } = useHistory();
  const { mode, campaignId: paramCampaignId, step, tab } = useMemo(
    () => ActivateCampaignRoutes.matchBasePath(pathname) || {},
    [pathname],
  );
  const campaignId = Number(paramCampaignId);

  return useMemo(
    () => ({
      isBuilder: mode === ActivateModes.Builder,
      isEditor: mode === ActivateModes.Editor || !mode,
      campaignId: Number(campaignId) || null,
      step: campaignId ? step || null : ActivateBuilderStep.Details,
      tab: tab || null,
    }),
    [mode, campaignId, step, tab],
  );
};
