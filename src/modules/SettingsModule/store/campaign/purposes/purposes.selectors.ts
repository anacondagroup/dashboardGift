import { pipe } from 'ramda';
import { StateStatus } from '@alycecom/utils';

import { IRootState } from '../../../../../store/root.types';

const getPurposesState = (state: IRootState) => state.settings.campaign.purposes;

export const getIsLoading = pipe(getPurposesState, state => state.status === StateStatus.Pending);

export const getPurposesOptions = pipe(getPurposesState, state => state.purposes);
export const getNumberOfRecipientsOptions = pipe(getPurposesState, state => state.numberOfRecipients);
