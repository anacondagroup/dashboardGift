import * as R from 'ramda';

export const isLoadingLens = R.lensProp('isLoading');
export const setLoading = R.set(isLoadingLens);
export const viewLoading = R.view(isLoadingLens);

export const isLoadedLens = R.lensProp('isLoaded');
export const setLoaded = R.set(isLoadedLens);
export const viewLoaded = R.view(isLoadedLens);
