import React, { useMemo } from 'react';
import { Box, Grid, Typography, Skeleton } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { AlyceTheme } from '@alycecom/ui';
import { useSelector } from 'react-redux';
import { EntityId } from '@alycecom/utils';
import { CampaignSettings, CommonData } from '@alycecom/modules';

import { useTeams } from '../../hooks/useTeams';
import { useTeamOwners } from '../../hooks/useTeamOwners';

const useStyles = makeStyles<AlyceTheme>(() => ({
  skeleton: {
    width: 100,
  },
}));

interface ICampaignDetailsSectionProps {
  teamId: EntityId;
  ownerId: EntityId;
  countryIds: number[];
  expiry: string | null;
}

const CampaignDetailsSection = ({ teamId, ownerId, countryIds, expiry }: ICampaignDetailsSectionProps): JSX.Element => {
  const classes = useStyles();

  const { isLoading: isTeamsLoading, isLoaded: isTeamsLoaded } = useTeams();
  const team = useSelector(useMemo(() => CampaignSettings.selectors.getTeamById(teamId), [teamId]));
  const { isLoading: isTeamOwnersLoading, isLoaded: isTeamOwnersLoaded } = useTeamOwners(teamId);
  const owner = useSelector(useMemo(() => CampaignSettings.selectors.getTeamOwnerById(ownerId), [ownerId]));

  const countries = useSelector(useMemo(() => CommonData.selectors.makeGetCountriesByIds(countryIds), [countryIds]));
  const countryLabels = useMemo(() => countries.map(({ name }) => name).join(', '), [countries]);

  return (
    <Box mb={9} maxWidth={650}>
      <Grid container spacing={2}>
        <Grid item container>
          <Grid item xs={6} container>
            <Grid item xs={4}>
              <Typography className="Body-Regular-Left-Static-Bold">Team</Typography>
            </Grid>
            <Grid item xs={8}>
              {isTeamsLoading && <Skeleton variant="text" className={classes.skeleton} />}
              {isTeamsLoaded && <Typography>{team?.name}</Typography>}
            </Grid>
          </Grid>

          <Grid item xs={6} container>
            <Grid item xs={4}>
              <Typography className="Body-Regular-Left-Static-Bold">Sending To</Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography>{countryLabels}</Typography>
            </Grid>
          </Grid>
        </Grid>

        <Grid item container>
          <Grid item xs={6} container>
            <Grid item xs={4}>
              <Typography className="Body-Regular-Left-Static-Bold">Manager</Typography>
            </Grid>
            <Grid item xs={8}>
              {isTeamOwnersLoading && <Skeleton variant="text" className={classes.skeleton} />}
              {isTeamOwnersLoaded && <Typography>{owner?.name}</Typography>}
            </Grid>
          </Grid>

          <Grid item xs={6} container>
            <Grid item xs={4}>
              <Typography className="Body-Regular-Left-Static-Bold">Expires on</Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography>{expiry || 'Never'}</Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CampaignDetailsSection;
