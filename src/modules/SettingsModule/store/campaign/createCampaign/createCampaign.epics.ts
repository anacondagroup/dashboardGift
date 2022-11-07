import { Epic } from 'redux-observable';
import { ofType } from '@alycecom/utils';
import { catchError, mergeMap, switchMap } from 'rxjs/operators';
import { push } from 'connected-react-router';
import { handleError, handlers } from '@alycecom/services';

import { StandardCampaignRoutes } from '../../../components/StandardCampaignModule/routePaths';

import { createCampaignFail, createCampaignRequest, createCampaignSuccess } from './createCampaign.actions';
import { ICreateCampaignResponse } from './createCampaign.types';

const createCampaignEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(createCampaignRequest),
    mergeMap(({ payload }) =>
      apiService
        .post('/enterprise/dashboard/campaigns/create', {
          body: {
            team_id: payload.team,
            owner_id: payload.teamOwner,
            name: payload.campaignName,
            team_member_ids: payload.teamMemberIds,
            countryIds: payload.countryIds,
            campaignPurpose: payload.purpose,
            numberOfRecipients: payload.numberOfRecipients,
          },
        })
        .pipe(
          switchMap((response: ICreateCampaignResponse) => [
            createCampaignSuccess(),
            push(StandardCampaignRoutes.buildEditorUrl(Number(response.campaign.id))),
          ]),
          catchError(handleError(handlers.handleLegacyAnyError(createCampaignFail))),
        ),
    ),
  );

export default [createCampaignEpic];
