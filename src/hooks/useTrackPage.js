import { useEffect } from 'react';
import { TrackEvent } from '@alycecom/services';

export const useTrackPage = (name, payload) => {
  const data = TrackEvent.useTrackEvent();
  const { trackEvent } = data;
  useEffect(() => {
    trackEvent(name, payload);
  }, [trackEvent, name, payload]);
};
