import { pipe } from 'ramda';

import { IRootState } from '../../../../store/root.types';

const pathToEmailTypesState = (state: IRootState) => state.emailBranding.emailTypes;

export const getIsLoading = pipe(pathToEmailTypesState, state => state.isLoading);

export const getIsLoaded = pipe(pathToEmailTypesState, state => state.isLoaded);

export const getItems = pipe(pathToEmailTypesState, state => state.items);
