import { pipe } from 'ramda';
import { StateStatus } from '@alycecom/utils';

import { IRootState } from '../../../../store/root.types';

const pathToEmailTypesState = (state: IRootState) => state.emailBranding.email;

export const getIsPending = pipe(pathToEmailTypesState, state => state.status === StateStatus.Pending);
export const getContent = pipe(pathToEmailTypesState, state => state.content);
