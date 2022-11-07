import { Epic } from 'redux-observable';
import { ofType } from '@alycecom/utils';
import { switchMap } from 'rxjs/operators';

import { emailTypesEpics } from './emailTypes/emailTypes.epics';
import { brandingSettingsEpics } from './brandingSettings/brandingSettings.epics';
import { emailPreviewEpics } from './emailPreview/emailPreview.epics';
import { resetEmailBranding } from './emailBranding.actions';
import { resetEmailPreview } from './emailPreview/emailPreview.actions';
import { resetEmailTypes } from './emailTypes/emailTypes.actions';
import { resetBrandingSettings } from './brandingSettings/brandingSettings.actions';

export const resetEmailBrandingEpic: Epic = action$ =>
  action$.pipe(
    ofType(resetEmailBranding),
    switchMap(() => [resetEmailPreview(), resetEmailTypes(), resetBrandingSettings()]),
  );

export default [...emailTypesEpics, ...brandingSettingsEpics, ...emailPreviewEpics, resetEmailBrandingEpic];
