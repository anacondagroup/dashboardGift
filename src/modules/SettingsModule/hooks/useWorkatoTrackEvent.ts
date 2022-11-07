import { useCallback } from 'react';
import { TrackEvent } from '@alycecom/services';
import { useParams } from 'react-router-dom';

import { TIntegrationUrlParams } from '../store/organisation/integrations/workato/workato.types';

export const useWorkatoTrackEvent = (): ((name: string, payload?: Record<string, unknown>) => void) => {
  const { integrationId } = useParams<TIntegrationUrlParams>();

  const { trackEvent } = TrackEvent.useTrackEvent();

  return useCallback(
    (name, payload = {}) => {
      trackEvent(name, { ...payload, integration: integrationId });
    },
    [integrationId, trackEvent],
  );
};
