import { pipe } from 'ramda';
import { StateStatus } from '@alycecom/utils';

import { IRootState } from '../../../../store/root.types';

const pathToBrandingSettingsState = (state: IRootState) => state.emailBranding.brandingSettings;

export const getIsPending = pipe(pathToBrandingSettingsState, state => state.status === StateStatus.Pending);
export const getIsFulfilled = pipe(pathToBrandingSettingsState, state => state.status === StateStatus.Fulfilled);

export const getIsSaveInProgress = pipe(pathToBrandingSettingsState, state => state.isSaveInProgress);

export const getBrandingSettings = pipe(pathToBrandingSettingsState, state => state.settings);

export const getInitialBrandingSettings = pipe(pathToBrandingSettingsState, state => state.initialSettings);

export const getBackground = pipe(pathToBrandingSettingsState, state => state.background);

export const getEmailTypeId = pipe(pathToBrandingSettingsState, state => state.emailTypeId);

export const getIsEmailTypeChanged = pipe(pathToBrandingSettingsState, state => state.isEmailTypeChanged);
