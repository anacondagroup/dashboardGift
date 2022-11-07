import { pipe } from 'ramda';

import { IRootState } from '../../../../store/root.types';

const pathToBrandingSettingsState = (state: IRootState) => state.emailBranding.brandingSettings;

export const getIsLoading = pipe(pathToBrandingSettingsState, state => state.isLoading);

export const getIsSaveInProgress = pipe(pathToBrandingSettingsState, state => state.isSaveInProgress);

export const getIsLoaded = pipe(pathToBrandingSettingsState, state => state.isLoaded);

export const getBrandingSettings = pipe(pathToBrandingSettingsState, state => state.settings);

export const getInitialBrandingSettings = pipe(pathToBrandingSettingsState, state => state.initialSettings);

export const getBackground = pipe(pathToBrandingSettingsState, state => state.background);
