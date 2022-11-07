import { converge, pipe } from 'ramda';
import { StateStatus } from '@alycecom/utils';
import { CampaignStatus } from '@alycecom/services';

import { IRootState } from '../../../../../store/root.types';
import { ClaimType } from '../../activate.types';

const getDetails = (state: IRootState) => state.activate.steps.details;

export const getIsDetailsLoading = pipe(getDetails, state => state.status === StateStatus.Pending);
export const getDetailsData = pipe(getDetails, state => state.data);
export const getCountryIds = pipe(getDetails, state => state.data?.countryIds);
export const getTeamId = pipe(getDetails, state => state.data?.teamId);
export const getActivateLink = pipe(getDetails, state => state.campaignLink);
export const getSenderSettingsValue = pipe(getDetails, state => state.data?.sendAsOption);
export const getSendAsIdValue = pipe(getDetails, state => state.data?.sendAsId);
export const getOwnerId = pipe(getDetails, state => state.data?.ownerId);
export const getCampaignName = pipe(getDetails, state => state.data?.campaignName ?? '');
export const getSendAsOption = pipe(getDetails, state => state.data?.sendAsOption);

export const getIsFreeClaimEnabled = pipe(getDetails, state => state.data?.claimType === ClaimType.FreeClaim);
export const getClaimType = pipe(getDetails, state => state.data?.claimType);
export const getIsPreApprovedClaimEnabled = pipe(getDetails, state => state.data?.claimType === ClaimType.PreApproved);
export const getFreeClaimsNumber = pipe(getDetails, state => state.data?.freeClaims ?? 0);
export const getClaimedGiftsCount = pipe(getDetails, state => state.data?.claimedGiftsCount ?? 0);
export const getCampaignDetailsStatus = pipe(getDetails, state => state.data?.status);
export const getIsCampaignExpired = pipe(getCampaignDetailsStatus, status => status === CampaignStatus.Expired);
export const getRemainingClaims = converge(
  (claims, gifts) => (Number.isInteger(claims) && Number.isInteger(gifts) && claims > gifts ? claims - gifts : 0),
  [getFreeClaimsNumber, getClaimedGiftsCount],
);
