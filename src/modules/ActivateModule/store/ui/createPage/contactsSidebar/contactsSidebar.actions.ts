import { createAction } from 'redux-act';

import { SourceTypes, ContactsUploadingStates } from '../../../../constants/recipientSidebar.constants';

const PREFIX = 'ACTIVATE_MODULE/CREATE_PAGE/CONTACTS_SIDEBAR';

export const openContactsUploadingSidebar = createAction(`${PREFIX}/OPEN`);
export const closeContactsUploadingSidebar = createAction(`${PREFIX}/CLOSE`);

export const setSourceType = createAction<SourceTypes>(`${PREFIX}/SET_SOURCE_TYPE`);
export const setContactsUploadingSectionState = createAction<ContactsUploadingStates>(`${PREFIX}/SET_SOURCE_TYPE`);
export const clearContactsSidebar = createAction(`${PREFIX}/CLEAR`);
