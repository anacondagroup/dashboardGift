import React, { Fragment, useMemo } from 'react';
import { Box, Grid } from '@mui/material';
import { CampaignSettings, CommonData, SectionTitleStyled, SFormLabel } from '@alycecom/modules';
import { useSelector } from 'react-redux';

import { getDetailsData } from '../../../store/swagCampaign/steps/details/details.selectors';

const CampaignDetailsSection = (): JSX.Element => {
  const details = useSelector(getDetailsData);
  const countries = useSelector(
    useMemo(() => CommonData.selectors.makeGetCountriesByIds(details?.countryIds ?? []), [details?.countryIds]),
  );
  const team = CampaignSettings.hooks.useTeams().useGetById(details?.teamId);
  const teamOwner = CampaignSettings.hooks.useTeamOwners(details?.teamId).useGetById(details?.ownerId);
  const hasGiftClaimedNotifications = !!details?.notificationSettings.giftClaimed.notifyOwner;

  return (
    <>
      <SectionTitleStyled my={3} pt={5} mt={0}>
        Campaign Details
      </SectionTitleStyled>
      {!!details && (
        <>
          <Grid container justifyContent="space-between" spacing={1}>
            <Grid container item xs={4} spacing={2}>
              <Grid container item direction="row">
                <Grid item xs={4} md={3}>
                  <SFormLabel>Team</SFormLabel>
                </Grid>
                <Grid item xs={8} md={9} data-testid="SwagBuilder.FinalizeStep.Details.Team">
                  {team?.name}
                </Grid>
              </Grid>
              <Grid container item direction="row">
                <Grid item xs={4} md={3}>
                  <SFormLabel>Manager</SFormLabel>
                </Grid>
                <Grid item xs={8} md={9} data-testid="SwagBuilder.FinalizeStep.Details.Manager">
                  {teamOwner?.name}
                </Grid>
              </Grid>
            </Grid>
            <Grid container item xs={8} spacing={2}>
              <Grid container item direction="row">
                <Grid item xs={3} md={2}>
                  <SFormLabel>Sending To</SFormLabel>
                </Grid>
                <Grid item xs={9} md={10} data-testid="SwagBuilder.FinalizeStep.Details.SendingTo">
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
          <Box maxWidth={603} data-testid="SwagBuilder.FinalizeStep.Details.Notifications">
            <Box mt={2} mb={1}>
              <SFormLabel>Notifications</SFormLabel>
            </Box>
            Notifications are {hasGiftClaimedNotifications ? 'enabled' : 'disabled'} for claimed gifts
          </Box>
        </>
      )}
    </>
  );
};

export default CampaignDetailsSection;
