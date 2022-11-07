import { RootStateOrAny } from 'react-redux';
import { compose } from 'ramda';

import { IRightToBeForgottenState } from './rightToBeForgotten.reducer';

const pathToRightToBeForgotten = (state: RootStateOrAny): IRightToBeForgottenState =>
  state.settings.organisation.rightToBeForgotten;

export const getIsLoaded = compose(state => state.isLoaded, pathToRightToBeForgotten);

export const getIsLoading = compose(state => state.isLoading, pathToRightToBeForgotten);

export const getErrors = compose(state => state.errors, pathToRightToBeForgotten);
