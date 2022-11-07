import * as R from 'ramda';
import { createSelector, Selector } from 'reselect';

import { IRootState } from '../root.types';
import { makeGetTeamById } from '../teams/teams.selectors';

import { ICampaign } from './campaigns.types';

const getCampaignsState = (state: IRootState) => state.campaigns;

export const getCampaigns = R.pipe(getCampaignsState, state => state.campaigns);

export const getIsCampaignsLoading = R.pipe(getCampaignsState, state => state.isLoading);

export const makeGetCampaignByTeamId = (teamId: string): Selector<IRootState, ICampaign | undefined> =>
  createSelector(getCampaigns, campaigns =>
    campaigns.find(({ team_id: campaignTeamId }) => campaignTeamId === parseInt(teamId, 10)),
  );

export const makeGetCampaignById = (campaignId: string): Selector<IRootState, ICampaign | undefined> =>
  createSelector(getCampaigns, campaigns => campaigns.find(({ id }) => id === parseInt(campaignId, 10)));

export const makeIsCanEditCampaignByTeamId = (teamId: string): Selector<IRootState, boolean> =>
  createSelector(makeGetCampaignByTeamId(teamId), makeGetTeamById(teamId), (campaign, team) =>
    Boolean(team && team.settings.enterprise_mode_enabled && campaign?.can_edit),
  );

export const makeGetTeamIdByCampaignId = (campaignId: string): Selector<IRootState, number | null> =>
  createSelector(makeGetCampaignById(campaignId), campaign => campaign?.team_id ?? null);
