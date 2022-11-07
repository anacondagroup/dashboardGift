import * as R from 'ramda';

export const getBreakdownsState = R.compose(R.prop('breakdowns'), R.prop('dashboard'));
