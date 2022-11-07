import { ofType } from 'redux-observable';
import { catchError, map, mergeMap, debounceTime, takeUntil } from 'rxjs/operators';

import { LOAD_TEMPLATES_REQUEST, SAVE_TEMPLATE_REQUEST, REMOVE_TEMPLATE_REQUEST } from './templates.types';
import {
  loadTemplatesSuccess,
  loadTemplatesFail,
  saveTemplatesSuccess,
  saveTemplatesFail,
  removeTemplatesSuccess,
  removeTemplatesFail,
} from './templates.actions';
import { buildApiUrl, buildSaveApiUrl, buildParams } from './templates.helpers';

export const loadTemplatesEpic = (action$, state$, { apiService, messagesService: { errorHandler } }) =>
  action$.pipe(
    ofType(LOAD_TEMPLATES_REQUEST),
    debounceTime(300),
    map(action => buildApiUrl(action.payload)),
    mergeMap(url =>
      apiService.get(url).pipe(
        map(({ templates }) => loadTemplatesSuccess({ templates })),
        catchError(errorHandler({ callbacks: loadTemplatesFail })),
        takeUntil(action$.ofType(LOAD_TEMPLATES_REQUEST)),
      ),
    ),
  );

export const saveTemplatesEpic = (
  action$,
  state$,
  { apiService, messagesService: { errorHandler, showGlobalMessage } },
) =>
  action$.pipe(
    ofType(SAVE_TEMPLATE_REQUEST),
    mergeMap(({ payload }) =>
      apiService.post(buildSaveApiUrl(payload), { body: buildParams(payload) }).pipe(
        mergeMap(({ message: template }) => [
          saveTemplatesSuccess({ id: payload.id, template }),
          showGlobalMessage({ text: 'Changes saved', type: 'success' }),
        ]),
        catchError(error => errorHandler({ callbacks: () => saveTemplatesFail({ id: payload.id, error }) })(error)),
        takeUntil(action$.ofType(SAVE_TEMPLATE_REQUEST)),
      ),
    ),
  );

export const removeTemplatesEpic = (
  action$,
  state$,
  { apiService, messagesService: { errorHandler, showGlobalMessage } },
) =>
  action$.pipe(
    ofType(REMOVE_TEMPLATE_REQUEST),
    mergeMap(({ payload: id }) =>
      apiService.post(`/enterprise/dashboard/settings/templates/delete`, { body: { template_id: id } }).pipe(
        mergeMap(() => [
          removeTemplatesSuccess(id),
          showGlobalMessage({ text: 'Template is removed', type: 'success' }),
        ]),
        catchError(errorHandler({ callbacks: removeTemplatesFail })),
        takeUntil(action$.ofType(REMOVE_TEMPLATE_REQUEST)),
      ),
    ),
  );

export const templatesEpics = [loadTemplatesEpic, saveTemplatesEpic, removeTemplatesEpic];
