import { pipe } from 'ramda';
import { StateStatus } from '@alycecom/utils';

import { IRootState } from '../../../../store/root.types';

import { IBrandingState } from './branding.reducer';

const pathToBrandingState = (state: IRootState): IBrandingState => state.activate.branding;

export const getIsLoading = pipe(pathToBrandingState, state => state.status === StateStatus.Pending);
export const getHasBranding = pipe(pathToBrandingState, state => state.hasBranding);
export const getBrandingLink = pipe(pathToBrandingState, state => state.brandingLink);
export const getBrandingOwner = pipe(pathToBrandingState, state => state.owner);
