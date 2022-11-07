import { pipe } from 'ramda';
import { StateStatus } from '@alycecom/utils';

import { IRootState } from '../../../../store/root.types';

const pathToBulkCreateState = (state: IRootState) => state.usersManagement.bulkCreate;

export const getIsFilePending = pipe(pathToBulkCreateState, state => state.fileStatus === StateStatus.Pending);
export const getIsFileRejected = pipe(pathToBulkCreateState, state => state.fileStatus === StateStatus.Rejected);
export const getImportId = pipe(pathToBulkCreateState, state => state.importId);
