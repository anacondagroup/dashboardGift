import { TrackEvent } from '@alycecom/services';

const appName = 'new_experience';

export const analyticService = TrackEvent.createAnalyticService({
  staticPayload: { appName },
  options: { app: { name: appName } },
});
