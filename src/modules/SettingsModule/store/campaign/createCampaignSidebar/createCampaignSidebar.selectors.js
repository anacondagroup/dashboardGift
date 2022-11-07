import { createSelector } from 'reselect';
import * as R from 'ramda';

const sidebarModePath = R.path(['settings', 'campaign', 'createCampaignSidebar']);

export const getCampaignSidebarMode = createSelector(sidebarModePath, sidebar => sidebar.mode);
