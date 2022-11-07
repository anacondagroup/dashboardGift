import { createAsyncAction } from '@alycecom/utils';

import { IPermissionsResponse } from './permissions.types';

const PREFIX = 'common';

export const fetchPermissions = createAsyncAction<void, IPermissionsResponse>(`${PREFIX}/fetchPermissions`);
