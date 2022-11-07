import { pipe } from 'ramda';
import { StateStatus } from '@alycecom/utils';

import { IRootState } from '../../../../../../store/root.types';

const getMarketoState = (state: IRootState) => state.activate.steps.recipients.marketo;
const getMarketoStateStatus = pipe(getMarketoState, state => state.status);

export const getIsMarketoDataLoading = pipe(getMarketoStateStatus, status => status === StateStatus.Pending);
export const getMarketoData = pipe(getMarketoState, state => state.data);
export const getMarketoErrors = pipe(getMarketoState, state => state.error);

export const getIsMarketoListLoading = pipe(getMarketoState, state => state.isLoading);
export const getMarketoRootNodeS = pipe(getMarketoState, state => state.root);

export const getAllMarketoFolders = pipe(getMarketoState, state => state.folders);

export const getSelectedMarketoListType = pipe(getMarketoState, state => state.selectedListType);
