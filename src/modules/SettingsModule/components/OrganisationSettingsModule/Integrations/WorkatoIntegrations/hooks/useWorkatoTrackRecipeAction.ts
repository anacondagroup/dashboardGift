import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import { useWorkatoTrackEvent } from '../../../../../hooks/useWorkatoTrackEvent';
import {
  TIntegrationUrlParams,
  TRecipeAction,
} from '../../../../../store/organisation/integrations/workato/workato.types';
import { WorkatoIntegrationContents } from '../IntegrationsContents';

export const useWorkatoTrackRecipeAction = (): ((recipeId: string, action: TRecipeAction) => void) => {
  const { integrationId } = useParams<TIntegrationUrlParams>();

  const trackEvent = useWorkatoTrackEvent();

  const integrationTitle = integrationId ? WorkatoIntegrationContents[integrationId].title : '';

  return useCallback(
    (recipeId: string, action: TRecipeAction) => {
      trackEvent(`Workato - ${integrationTitle} - ${action.charAt(0).toUpperCase() + action.slice(1)} recipe`, {
        recipeId,
      });
    },
    [integrationTitle, trackEvent],
  );
};
