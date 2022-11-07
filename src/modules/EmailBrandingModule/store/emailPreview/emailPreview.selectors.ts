import { pipe } from 'ramda';

import { IRootState } from '../../../../store/root.types';

const pathToEmailTypesState = (state: IRootState) => state.emailBranding.email;

export const getIsLoading = pipe(pathToEmailTypesState, state => state.isLoading);

export const getIsLoaded = pipe(pathToEmailTypesState, state => state.isLoaded);

export const getContent = pipe(pathToEmailTypesState, state => state.content);
