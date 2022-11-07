import * as R from 'ramda';

export const getBulkCreateState = R.prop('bulkCreate');

export const getTeamsState = R.compose(R.prop('teams'), getBulkCreateState);

export const getTeams = R.compose(R.prop('teams'), getTeamsState);
