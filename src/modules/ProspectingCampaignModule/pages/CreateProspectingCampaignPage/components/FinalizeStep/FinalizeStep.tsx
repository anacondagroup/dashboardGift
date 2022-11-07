import React, { Fragment, useCallback, useMemo } from 'react';
import { Box, Grid } from '@mui/material';
import { CampaignSettings, CommonData, Messaging } from '@alycecom/modules';
import { useDispatch, useSelector } from 'react-redux';
import { getOrdinal } from '@alycecom/utils';
import { Icon, Tooltip } from '@alycecom/ui';

import ProspectingBuilderFooter from '../ProspectingBuilderFooter/ProspectingBuilderFooter';
import { useBuilderSteps } from '../../../../hooks/useBuilderSteps';
import { SFormLabel, SectionTitle } from '../../../../components/styled/Styled';
import { getDetailsData } from '../../../../store/prospectingCampaign/steps/details/details.selectors';
import { getGiftingData } from '../../../../store/prospectingCampaign/steps/gifting/gifting.selectors';
import LeadingGift from '../../../../components/GiftingForm/controllers/ConfigureLeadingGiftController/fields/LeadingGift';
import { getMessagingData } from '../../../../store/prospectingCampaign/steps/messaging/messaging.selectors';
import { useProspecting } from '../../../../hooks';
import { createProspectingCampaignByDraftId } from '../../../../store/prospectingCampaign/steps/finalize/finalize.actions';
import { RecipientActionsFields } from '../../../../store/prospectingCampaign/steps/gifting/gifting.types';
import { getIsFinalizePending } from '../../../../store/prospectingCampaign/steps/finalize/finalize.selectors';

const RECIPIENT_ACTION_LABELS = {
  [RecipientActionsFields.CaptureDate]: 'accept a calendar invite',
  [RecipientActionsFields.CapturePhone]: 'provide phone number',
  [RecipientActionsFields.CaptureEmail]: 'provide email address',
  [RecipientActionsFields.CaptureQuestion]: 'answer custom questions',
  [RecipientActionsFields.CaptureAffidavit]: 'accept custom terms & conditions',
} as Record<string, string>;

const styles = {
  labelWithTooltip: {
    display: 'flex',
  },
  labelTooltip: {
    ml: 1,
  },
} as const;

const FinalizeStep = (): JSX.Element => {
  const dispatch = useDispatch();
  const { campaignId } = useProspecting();
  const { goToPrevStep } = useBuilderSteps();
  const details = useSelector(getDetailsData);
  const gifting = useSelector(getGiftingData);
  const messaging = useSelector(getMessagingData);
  const isPending = useSelector(getIsFinalizePending);

  const teams = CampaignSettings.hooks.useTeams();
  const team = teams.useGetById(details?.teamId);

  const teamOwners = CampaignSettings.hooks.useTeamOwners(details?.teamId);
  const teamOwner = teamOwners.useGetById(details?.ownerId);

  const countries = useSelector(
    useMemo(() => CommonData.selectors.makeGetCountriesByIds(details?.countryIds ?? []), [details?.countryIds]),
  );

  const isDonationsAllowed = gifting?.giftActionsData?.donate ?? false;
  const isExchangeAllowed = gifting?.giftActionsData?.exchange ?? false;

  const { recipientActions } = gifting?.recipientActionsData || {};
  const acceptanceRequirements = useMemo(
    () =>
      Object.entries(recipientActions ?? {}).reduce((labels, [action, value]) => {
        const label = RECIPIENT_ACTION_LABELS?.[action] ?? '';

        if (label && value) {
          labels.push(label);
        }

        return labels;
      }, [] as string[]),
    [recipientActions],
  );
  const embeddedIncludesLabel = messaging?.videoData?.type ? 'embedded video' : '';
  const postGiftCtaIncludesLabel = messaging?.redemptionData?.afterClaimRedirectUrl ? 'post-gift CTA' : '';

  const hasEmbedOrPostGiftCta = Boolean(embeddedIncludesLabel || postGiftCtaIncludesLabel);
  const hasMessagingContent = messaging?.messageData?.header && messaging?.messageData?.message;
  const isMessagingVisible = hasMessagingContent || hasEmbedOrPostGiftCta;
  const hasRecipientActions = acceptanceRequirements.length > 0;

  const handleFinalize = useCallback(() => {
    if (campaignId) {
      dispatch(createProspectingCampaignByDraftId(campaignId));
    }
  }, [dispatch, campaignId]);

  return (
    <Box>
      <SectionTitle>Finalize Your Campaign</SectionTitle>
      <Box my={3}>
        <SFormLabel>Campaign Details</SFormLabel>
      </Box>
      <Grid container justifyContent="space-between" spacing={1}>
        <Grid container item xs={4} spacing={2}>
          <Grid container item direction="row">
            <Grid item xs={4} md={2}>
              <SFormLabel>Team</SFormLabel>
            </Grid>
            <Grid item xs={8} md={10}>
              {team?.name}
            </Grid>
          </Grid>
          <Grid container item direction="row">
            <Grid item xs={4} md={2}>
              <SFormLabel>Owner</SFormLabel>
            </Grid>
            <Grid item xs={8} md={10}>
              {teamOwner?.name}
            </Grid>
          </Grid>
        </Grid>
        <Grid container item xs={8} spacing={2}>
          <Grid container item direction="row">
            <Grid item xs={3} md={2}>
              <SFormLabel>Sending To</SFormLabel>
            </Grid>
            <Grid item xs={9} md={10}>
              {countries?.map((country, idx) => (
                <Fragment key={country.id}>
                  {idx > 0 && ', '}
                  {country?.name}
                </Fragment>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {gifting?.defaultGiftsData?.defaultGifts?.length && (
        <>
          <Box mt={10} mb={3}>
            <SFormLabel>Default Gifts</SFormLabel>
          </Box>
          <Grid container spacing={4} direction="row">
            {gifting?.defaultGiftsData?.defaultGifts?.map((gift, idx) => (
              <Grid component={Box} item key={gift.id} display="flex" flexDirection="column">
                <Box color="grey.main" mb={2} minWidth={178}>
                  {`${getOrdinal(idx + 1)} gift`.toUpperCase()}
                </Box>
                <LeadingGift value={gift} />
              </Grid>
            ))}
            <Grid item>
              <Box mt={5}>
                <Grid container spacing={3} direction="column">
                  <Grid item>
                    <Icon width={30} icon={isExchangeAllowed ? 'check' : 'times'} /> Exchanges{' '}
                    {isExchangeAllowed ? '' : 'dis'}
                    allowed
                  </Grid>
                  <Grid item>
                    <Icon width={30} icon={isDonationsAllowed ? 'check' : 'times'} /> Donations{' '}
                    {isDonationsAllowed ? '' : 'dis'}
                    allowed
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </>
      )}

      {hasRecipientActions && (
        <Box maxWidth={603}>
          <Box mt={4}>
            <SFormLabel>Acceptance Requirements</SFormLabel>
          </Box>
          Recipient must{' '}
          {acceptanceRequirements.map((label, idx, arr) => (
            <Fragment key={label}>
              {idx !== 0 && ', '}
              {arr.length > 1 && idx === arr.length - 1 && 'and '}
              {label}
            </Fragment>
          ))}
        </Box>
      )}

      {isMessagingVisible && (
        <Box maxWidth={603}>
          <Box mt={4} mb={3}>
            <SFormLabel sx={styles.labelWithTooltip}>
              Messaging
              {hasMessagingContent && (
                <Tooltip
                  placement="top"
                  title="The highlighted text is custom data placeholders for this message preview and will be replaced with the values of your contacts and gift information upon sending."
                >
                  <Icon sx={styles.labelTooltip} icon="exclamation-circle" fontSize={1} />
                </Tooltip>
              )}
            </SFormLabel>
          </Box>
          {hasMessagingContent ? (
            <>
              <Box my={2}>
                <SFormLabel>Title</SFormLabel>
                <Box>
                  <Messaging.TextWithPlaceholders text={messaging?.messageData?.header ?? ''} />
                </Box>
              </Box>
              <Box my={2}>
                <SFormLabel>Message</SFormLabel>
                <Box>
                  <Messaging.TextWithPlaceholders text={messaging?.messageData?.message ?? ''} />
                </Box>
              </Box>
            </>
          ) : (
            <Box>Header and Message are not defined</Box>
          )}
          {(embeddedIncludesLabel || postGiftCtaIncludesLabel) && (
            <Box mt={2}>
              Includes {embeddedIncludesLabel}
              {!!embeddedIncludesLabel && !!postGiftCtaIncludesLabel && ' & '}
              {postGiftCtaIncludesLabel}
            </Box>
          )}
        </Box>
      )}

      <ProspectingBuilderFooter
        wrap
        isLastStep
        disabled={isPending}
        onClickNext={handleFinalize}
        onClickBack={goToPrevStep}
      />
    </Box>
  );
};

export default FinalizeStep;
