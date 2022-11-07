import { ofType } from 'redux-observable';
import { map } from 'rxjs/operators';

import { swagSelectClearDataOnCloseSidebar } from '../swagSelect/swagSelect.actions';

import { CREATE_CAMPAIGN_SIDEBAR_CLOSE } from './createCampaignSidebar.types';

const handleCloseSidebarEpic = action$ =>
  action$.pipe(
    ofType(CREATE_CAMPAIGN_SIDEBAR_CLOSE),
    map(() => swagSelectClearDataOnCloseSidebar()),
  );

export const createCampaignSidebarEpics = [handleCloseSidebarEpic];
