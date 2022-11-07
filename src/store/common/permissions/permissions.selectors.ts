import { pipe, prop, equals } from 'ramda';
import { createSelector } from 'reselect';
import { StateStatus } from '@alycecom/utils';

import { IRootState } from '../../root.types';
import { PermissionKeys } from '../../../constants/permissions.constants';

const getPermissionsState = (state: IRootState) => state.common.permissions;
const getPermissionsStateStatus = pipe(getPermissionsState, prop('status'));

export const getIsPermissionsLoaded = pipe(getPermissionsStateStatus, equals(StateStatus.Fulfilled));

export const getPermissions = pipe(getPermissionsState, prop('data'));

export const makeHasPermissionSelector = (permission: PermissionKeys): ((state: IRootState) => boolean) =>
  createSelector(getPermissions, permissions => permissions.includes(permission));
