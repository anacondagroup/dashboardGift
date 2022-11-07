import { pipe } from 'ramda';

import { IRootState } from '../../../../../store/root.types';

const pathToBrandingState = (state: IRootState) => state.settings.teams.branding;

export const getIsLoading = pipe(pathToBrandingState, state => state.isLoading);

export const getHasBranding = pipe(pathToBrandingState, state => state.hasBranding);

export const getBrandingLink = pipe(pathToBrandingState, state => state.brandingLink);

export const getBrandingOwner = pipe(pathToBrandingState, state => state.owner);
