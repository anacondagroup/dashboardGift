import * as R from 'ramda';
import { createSelector } from 'reselect';

import { viewLoading } from '../../../../helpers/lens.helpers';

export const getMembersState = R.compose(R.prop('members'), R.prop('dashboard'));

export const getMembers = R.compose(R.prop('members'), getMembersState);

export const getMembersIsLoading = R.compose(viewLoading, getMembersState);

export const makeGetMemberById = memberId => createSelector(getMembers, R.find(R.propEq('id', Number(memberId))));
