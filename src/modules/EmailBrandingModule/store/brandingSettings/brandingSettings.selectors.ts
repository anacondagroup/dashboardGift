import { pipe } from 'ramda';

import { IRootState } from '../../../../store/root.types';

const pathToBrandingSettingsState = (state: IRootState) => state.emailBranding.brandingSettings;

export const getEmailTypeId = pipe(pathToBrandingSettingsState, state => state.emailTypeId);

export const getIsEmailTypeChanged = pipe(pathToBrandingSettingsState, state => state.isEmailTypeChanged);

export const getBrandingSettings = pipe(pathToBrandingSettingsState, state => state.settings);

export const getInitialBrandingSettings = pipe(pathToBrandingSettingsState, state => state.initialSettings);

export const getBackground = pipe(pathToBrandingSettingsState, state => state.background);
