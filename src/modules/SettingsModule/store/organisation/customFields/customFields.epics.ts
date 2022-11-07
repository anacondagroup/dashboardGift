import { Epic } from 'redux-observable';
import { catchError, map, takeUntil, mergeMap } from 'rxjs/operators';
import { ofType } from '@alycecom/utils';
import { CommonData } from '@alycecom/modules';
import { handleError, handlers } from '@alycecom/services';

import * as actions from './customFields.actions';
import * as types from './customFields.types';
import { TGetCustomFieldResponse } from './customFields.types';

const getCustomFieldsEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(actions.getCustomFields),
    mergeMap(() =>
      apiService.get('/api/v1/organization/custom-fields', null, true).pipe(
        map((response: TGetCustomFieldResponse) => actions.getCustomFieldsSuccess(response.data)),
        catchError(handleError(handlers.handleAnyError(actions.getCustomFieldsFail))),
        takeUntil(action$.pipe(ofType(actions.getCustomFieldsFail))),
      ),
    ),
  );

const addCustomFieldEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(actions.addCustomField),
    mergeMap(({ payload: { label, required } }) =>
      apiService
        .post(
          '/api/v1/organization/custom-fields',
          {
            body: { label, required },
          },
          true,
        )
        .pipe(
          mergeMap((response: types.TCustomField) => [
            actions.addCustomFieldSuccess(response),
            CommonData.actions.commonLoadRequest(),
          ]),
          catchError(handleError(handlers.handleAnyError(actions.addCustomFieldFail))),
          takeUntil(action$.pipe(ofType(actions.addCustomField))),
        ),
    ),
  );

const updateCustomFieldEpic: Epic = (action$, state$, { apiService, messagesService }) =>
  action$.pipe(
    ofType(actions.updateCustomField),
    mergeMap(({ payload: { name, ...updates } }) =>
      apiService
        .patch(
          '/api/v1/organization/custom-fields',
          {
            body: { name, ...updates },
          },
          true,
        )
        .pipe(
          mergeMap((response: types.TCustomField) => [
            actions.updateCustomFieldSuccess(response),
            messagesService.showGlobalMessage({ type: 'success', text: 'Saved successfully' }),
            CommonData.actions.commonLoadRequest(),
          ]),
          catchError(handleError(handlers.handleAnyError(actions.updateCustomFieldFail))),
          takeUntil(action$.pipe(ofType(actions.updateCustomField))),
        ),
    ),
  );

const deleteCustomFieldEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(actions.deleteCustomField),
    mergeMap(({ payload: name }) =>
      apiService
        .delete(
          '/api/v1/organization/custom-fields',
          {
            body: { name },
          },
          true,
        )
        .pipe(
          map(() => actions.deleteCustomFieldSuccess(name)),
          catchError(handleError(handlers.handleAnyError(actions.deleteCustomFieldFail))),
          takeUntil(action$.pipe(ofType(actions.deleteCustomField))),
        ),
    ),
  );

export default [getCustomFieldsEpic, addCustomFieldEpic, updateCustomFieldEpic, deleteCustomFieldEpic];
