import { createAction } from 'redux-act';
import { TErrors } from '@alycecom/services';

import { IContact, IContactsFilters, IContactsMeta } from './contacts.types';

const PREFIX = 'ACTIVATE_MODULE/STEPS/RECIPIENTS/CONTACTS';

export const loadContactsRequest = createAction<{ campaignId: number; reset?: boolean }>(`${PREFIX}/LOAD_REQUEST`);
export const loadContactsSuccess = createAction<{ data: IContact[]; meta: IContactsMeta }>(`${PREFIX}/LOAD_SUCCESS`);
export const loadContactsFail = createAction<TErrors>(`${PREFIX}/LOAD_FINISH`);

export const setContactsFilters = createAction<Partial<IContactsFilters>>(`${PREFIX}/SET_FILTERS`);
export const resetStatusMetaData = createAction(`${PREFIX}/RESET_REQUEST_STATUS_META_DATA`);
