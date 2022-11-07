import { pipe } from 'ramda';

import { IRootState } from '../../../store/root.types';

const getConfirmationState = (state: IRootState) => state.confirmation;

export const getIsSetPasswordInProgress = pipe(getConfirmationState, state => state.setPasswordInProgress);
