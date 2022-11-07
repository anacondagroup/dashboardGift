import * as R from 'ramda';

import { getCommonState } from '../common.selectors';

export const getStateUpdatedTimeState = R.compose(R.prop('stateUpdatedTime'), getCommonState);
