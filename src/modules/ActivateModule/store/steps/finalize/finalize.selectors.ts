import { pipe } from 'ramda';
import { StateStatus } from '@alycecom/utils';

import { IRootState } from '../../../../../store/root.types';

const getFinalizeStep = (state: IRootState) => state.activate.steps.finalize;

export const getIsFinalizeLoading = pipe(getFinalizeStep, state => state.status === StateStatus.Pending);
