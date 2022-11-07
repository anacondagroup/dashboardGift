import { pipe, prop, map, join, filter, whereEq } from 'ramda';
import { createSelector } from 'reselect';

import { getTeamsSettings } from '../teams/teams.selectors';

const getModuleState = pipe(getTeamsSettings, prop('invitationMethods'));

export const invitationMethodsModule = state => getModuleState(state);

export const getInvitationMethods = createSelector(invitationMethodsModule, module =>
  prop('invitationMethods', module),
);

const combineMethodsNames = pipe(filter(whereEq({ enabled: true })), map(prop('name')), join(', '));

export const getSelectedInvitationMethodNames = createSelector(getInvitationMethods, methods =>
  combineMethodsNames(methods),
);

export const getInvitationMethodsErrors = createSelector(invitationMethodsModule, module => prop('errors', module));

export const getInvitationMethodsIsLoading = createSelector(invitationMethodsModule, module =>
  prop('isLoading', module),
);
