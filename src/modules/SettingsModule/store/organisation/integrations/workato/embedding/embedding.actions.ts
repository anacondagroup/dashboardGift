import { createAsyncAction } from '@alycecom/utils';

import { TWorkatoToken } from '../workato.types';

const prefix = 'SETTINGS_MODULE/WORKATO/FULL_EMBEDDED';

export const fetchWorkatoEmbeddingToken = createAsyncAction<void, TWorkatoToken>(`${prefix}/FETCH_TOKEN`);
