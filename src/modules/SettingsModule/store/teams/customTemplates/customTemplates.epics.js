import { ofType } from 'redux-observable';
import { catchError, map, mergeMap, debounce, takeUntil } from 'rxjs/operators';
import { timer } from 'rxjs';
import { handleError, handlers } from '@alycecom/services';

import {
  ALL_CUSTOM_TEMPLATES_LOAD_REQUEST,
  CREATE_NEW_CUSTOM_TEMPLATE_REQUEST,
  DELETE_CUSTOM_TEMPLATE_REQUEST,
  UPDATE_CUSTOM_TEMPLATE_REQUEST,
} from './customTemplates.types';
import {
  createNewCustomTemplateFail,
  createNewCustomTemplateSuccess,
  deleteCustomTemplateSuccess,
  loadCustomTemplatesFail,
  loadCustomTemplatesRequest,
  loadCustomTemplatesSuccess,
} from './customTemplates.actions';

const loadCustomTemplates = (action$, state$, { apiService, messagesService: { errorHandler } }) =>
  action$.pipe(
    ofType(ALL_CUSTOM_TEMPLATES_LOAD_REQUEST),
    debounce(() => timer(300)),
    mergeMap(({ payload }) =>
      apiService.get(`/enterprise/dashboard/settings/teams/${payload}/templates`).pipe(
        map(response => loadCustomTemplatesSuccess(response.team)),
        catchError(
          errorHandler({
            callbacks: loadCustomTemplatesFail,
            message: 'Unexpected loading error, please refresh page',
          }),
        ),
        takeUntil(action$.ofType(ALL_CUSTOM_TEMPLATES_LOAD_REQUEST)),
      ),
    ),
  );

const saveNewCustomTemplate = (action$, state$, { apiService, messagesService: { showGlobalMessage } }) =>
  action$.pipe(
    ofType(CREATE_NEW_CUSTOM_TEMPLATE_REQUEST),
    debounce(() => timer(300)),
    mergeMap(({ payload }) =>
      apiService
        .post(`/enterprise/dashboard/settings/teams/${payload.teamId}/templates/create`, { body: payload.template })
        .pipe(
          mergeMap(() => [
            createNewCustomTemplateSuccess(),
            showGlobalMessage({ text: `Template '${payload.template.name}' has been saved`, type: 'success' }),
            loadCustomTemplatesRequest(payload.teamId),
          ]),
          catchError(
            handleError(
              handlers.handleLegacyAnyError(createNewCustomTemplateFail),
              handlers.handleAnyError((err, res) =>
                Array.isArray(res.message) ? showGlobalMessage({ text: res.message.join(' '), type: 'error' }) : null,
              ),
            ),
          ),
          takeUntil(action$.ofType(CREATE_NEW_CUSTOM_TEMPLATE_REQUEST)),
        ),
    ),
  );

const updateCustomTemplate = (action$, state$, { apiService, messagesService: { errorHandler, showGlobalMessage } }) =>
  action$.pipe(
    ofType(UPDATE_CUSTOM_TEMPLATE_REQUEST),
    debounce(() => timer(300)),
    mergeMap(({ payload }) =>
      apiService
        .post(`/enterprise/dashboard/settings/teams/${payload.teamId}/templates/${payload.id}/edit`, {
          body: payload.template,
        })
        .pipe(
          mergeMap(() => [
            showGlobalMessage({ text: `Template '${payload.template.name}' has been saved`, type: 'success' }),
            loadCustomTemplatesRequest(payload.teamId),
          ]),
          catchError(
            errorHandler({
              message: 'Unexpected updating error, please refresh page',
            }),
          ),
          takeUntil(action$.ofType(UPDATE_CUSTOM_TEMPLATE_REQUEST)),
        ),
    ),
  );

const deleteCustomTemplate = (action$, state$, { apiService, messagesService: { showGlobalMessage, errorHandler } }) =>
  action$.pipe(
    ofType(DELETE_CUSTOM_TEMPLATE_REQUEST),
    debounce(() => timer(300)),
    mergeMap(({ payload }) =>
      apiService.post(`/enterprise/dashboard/settings/teams/${payload.teamId}/templates/${payload.id}/delete`).pipe(
        mergeMap(response => [
          showGlobalMessage({ text: `Template has been deleted`, type: 'success' }),
          deleteCustomTemplateSuccess(response.team),
        ]),
        catchError(
          errorHandler({
            message: 'Unexpected deleting error, please refresh page',
          }),
        ),
        takeUntil(action$.ofType(DELETE_CUSTOM_TEMPLATE_REQUEST)),
      ),
    ),
  );

export const customTemplatesEpic = [
  loadCustomTemplates,
  saveNewCustomTemplate,
  updateCustomTemplate,
  deleteCustomTemplate,
];
