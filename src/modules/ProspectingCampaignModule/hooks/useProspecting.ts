import { useHistory } from 'react-router-dom';
import { useMemo } from 'react';

import {
  ProspectingBuilderStep,
  ProspectingCampaignRoutes,
  ProspectingEditorStep,
  ProspectingEditorTabs,
  ProspectingMode,
} from '../routePaths';

export type TUseProspectingValue = {
  isBuilder: boolean;
  isEditor: boolean;
  campaignId: number | null;
  step: ProspectingBuilderStep | ProspectingEditorStep | null;
  tab: ProspectingEditorTabs | null;
};

export const useProspecting = (): TUseProspectingValue => {
  const {
    location: { pathname },
  } = useHistory();
  const { mode, campaignId: paramCampaignId, step, tab } = useMemo(
    () => ProspectingCampaignRoutes.matchBasePath(pathname) || {},
    [pathname],
  );
  const campaignId = Number(paramCampaignId);

  return useMemo(
    () => ({
      isBuilder: mode === ProspectingMode.Builder,
      isEditor: mode === ProspectingMode.Editor || !mode,
      campaignId: Number(campaignId) || null,
      step: campaignId ? step || null : ProspectingBuilderStep.Details,
      tab: tab || null,
    }),
    [mode, campaignId, step, tab],
  );
};
