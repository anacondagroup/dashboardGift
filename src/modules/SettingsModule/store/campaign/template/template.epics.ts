import { Epic } from 'redux-observable';
import { catchError, map, mergeMap, withLatestFrom } from 'rxjs/operators';
import { ofType } from '@alycecom/utils';

import { getDefaultTemplate } from '../commonData/commonData.selectors';

import * as actions from './template.actions';
import { getTemplatesWithDefault } from './template.helpers';
import { ITemplate } from './template.types';

const getTemplatesEpic: Epic = (action$, state$, { apiService, messagesService: { errorHandler } }) =>
  action$.pipe(
    ofType(actions.getTemplates),
    withLatestFrom(state$.pipe(map(getDefaultTemplate))),
    mergeMap(([{ meta: campaignId }, defaultTemplate]) =>
      apiService.get(`/enterprise/campaigns/${campaignId}/settings/templates`).pipe(
        map((response: { templates: ITemplate[] }) =>
          actions.getTemplatesSuccess(getTemplatesWithDefault(defaultTemplate, response.templates)),
        ),
        catchError(errorHandler({ callbacks: actions.getTemplatesFail })),
      ),
    ),
  );

const saveTemplateEpic: Epic = (
  action$,
  state$,
  { apiService, messagesService: { showGlobalMessage, errorHandler } },
) =>
  action$.pipe(
    ofType(actions.saveTemplate),
    mergeMap(({ payload: template, meta: campaignId }) =>
      apiService.post(`/enterprise/campaigns/${campaignId}/settings/templates`, { body: template }).pipe(
        mergeMap(() => [
          actions.saveTemplateSuccess(template),
          showGlobalMessage({ text: 'Campaign default template saved', type: 'success' }),
        ]),
        catchError(errorHandler({ callbacks: actions.saveTemplateFail })),
      ),
    ),
  );

const clearTemplateEpic: Epic = (
  action$,
  state$,
  { apiService, messagesService: { showGlobalMessage, errorHandler } },
) =>
  action$.pipe(
    ofType(actions.clearTemplate),
    mergeMap(({ meta: campaignId }) =>
      apiService.post(`/enterprise/campaigns/${campaignId}/settings/templates/clear`).pipe(
        mergeMap(() => [
          actions.clearTemplateSuccess(),
          showGlobalMessage({ text: 'Campaign default template removed', type: 'success' }),
        ]),
        catchError(errorHandler({ callbacks: actions.clearTemplateFail })),
      ),
    ),
  );

export default [getTemplatesEpic, saveTemplateEpic, clearTemplateEpic];
