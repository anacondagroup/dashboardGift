import { createSelector } from 'reselect';
import { Features } from '@alycecom/modules';

export const getIsWorkatoIntegrationEnabled = createSelector(
  Features.selectors.hasFeatureFlag(Features.FLAGS.PUBLIC_API),
  Features.selectors.hasFeatureFlag(Features.FLAGS.WORKATO_INTEGRATION),
  (isPublicApiEnabled, isWorkatoIntegrationEnabled) => isPublicApiEnabled && isWorkatoIntegrationEnabled,
);
