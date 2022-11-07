import { Epic } from 'redux-observable';
import { catchError, debounceTime, map, mergeMap, switchMap } from 'rxjs/operators';
import { ofType } from '@alycecom/utils';
import { handleError, handlers } from '@alycecom/services';

import { IBrandingSettings } from '../emailBranding.types';

import {
  loadBrandingSettingsRequest,
  loadBrandingSettingsSuccess,
  loadBrandingSettingsFail,
  uploadBrandingImageRequest,
  uploadBrandingImageSuccess,
  uploadBrandingImageFail,
  updateBrandingSettingsRequest,
  updateBrandingSettingsSuccess,
  updateBrandingSettingsFail,
} from './brandingSettings.actions';

export const loadBrandingSettings: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(loadBrandingSettingsRequest),
    debounceTime(300),
    switchMap(({ payload: { teamId } }) =>
      apiService.get(`/api/v1/email-branding/teams/${teamId}`, null, true).pipe(
        map((payload: { data: IBrandingSettings }) => loadBrandingSettingsSuccess(payload.data)),
        catchError(handleError(handlers.handleAnyError(loadBrandingSettingsFail))),
      ),
    ),
  );

export const uploadImageEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(uploadBrandingImageRequest),
    switchMap(({ payload: { file } }) => {
      const formData = new FormData();
      formData.append('data', file, file.name);
      return apiService.postFile('/api/v1/email-branding/logo', { body: formData }, true).pipe(
        map(({ data }: { data: { id: number; url: string } }) => {
          const { id, url } = data;
          return uploadBrandingImageSuccess({ id, url });
        }),
        catchError(apiService.handleError(handlers.handleAnyError(uploadBrandingImageFail))),
      );
    }),
  );

export const updateBrandingEpic: Epic = (action$, state$, { apiService, messagesService }) =>
  action$.pipe(
    ofType(updateBrandingSettingsRequest),
    switchMap(({ payload: { teamId, settings } }) =>
      apiService.put(`/api/v1/email-branding/teams/${teamId}`, { body: settings }, true).pipe(
        mergeMap(({ data }: { data: IBrandingSettings }) => [
          updateBrandingSettingsSuccess(data),
          messagesService.showGlobalMessage({
            type: 'success',
            text: `Success! Your styling changes will be applied to your emails`,
          }),
        ]),
        catchError(apiService.handleError(handlers.handleAnyError(updateBrandingSettingsFail))),
      ),
    ),
  );

export const brandingSettingsEpics = [loadBrandingSettings, uploadImageEpic, updateBrandingEpic];
