import { pipe } from 'ramda';

import { IRootState } from '../../../../../store/root.types';

const pathToBrandingState = (state: IRootState) => state.settings.teams.emailBranding;

export const getIsLoading = pipe(pathToBrandingState, state => state.isLoading);

export const getHasEmailBranding = pipe(pathToBrandingState, state => state.hasEmailBranding);
