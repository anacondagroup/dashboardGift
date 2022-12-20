import React, { memo, useCallback, useMemo } from 'react';
import { Grid, Paper, Box, Typography } from '@mui/material';
import { AlyceTheme, Icon, Button } from '@alycecom/ui';
import { useDispatch } from 'react-redux';
import moment from 'moment-timezone';
import { makeStyles } from '@mui/styles';

import { GiftingInsights, ReportingSidebarCategory } from '../../../store/reporting/reporting.constants';
import { setSidebarStep } from '../../../store/reportingSidebar/reportingSidebar.actions';
import { resetEditStatus } from '../../../store/reporting/reporting.actions';
import { ReportingFrequencyEnum } from '../../../../SettingsModule/constants/reporting.constants';
import { useReportingTrackEvent } from '../../../hooks/useReportingTrackEvent';

const useStyles = makeStyles<AlyceTheme>(({ palette, spacing }) => ({
  listItem: {
    padding: spacing(2),
    display: 'flex',
    justifyContent: 'space-between',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing(1),
  },
  editButton: {
    color: palette.link.main,
  },
}));

export type IAutomatedReportCardProps = {
  id: number;
  period: string;
  day: string;
  time: string;
  numberOfTeams?: string;
  timezone: string;
  stepName: GiftingInsights;
  timespan?: string;
};

const AutomatedReportCard = ({
  id,
  period,
  day,
  time,
  numberOfTeams,
  timezone,
  stepName,
  timespan,
}: IAutomatedReportCardProps): JSX.Element => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const trackEvent = useReportingTrackEvent();

  const getTeamString = () => {
    if (!numberOfTeams) return '';
    return numberOfTeams === 'all' ? 'All Teams' : `${numberOfTeams} Teams`;
  };

  const handleEditReport = useCallback(() => {
    trackEvent(`Gifting Insights - ${stepName} - Automated Reporting edit clicked`, { reportId: id });
    dispatch(resetEditStatus());
    dispatch(setSidebarStep({ step: ReportingSidebarCategory[stepName].editReport, id }));
  }, [dispatch, id, stepName, trackEvent]);

  const title = useMemo(() => {
    const timezoneStr = moment.tz(timezone).zoneAbbr();
    const dayStr = moment(day, 'ddd').format('dddd');
    if (period === ReportingFrequencyEnum.daily) {
      return `Send ${period} @ ${time} ${timezoneStr}`;
    }
    if (period === ReportingFrequencyEnum.weekly) {
      return `Send ${period} on ${dayStr} @ ${time} ${timezoneStr}`;
    }
    if (period === ReportingFrequencyEnum.monthly) {
      return `Send ${period} on ${day} of the month @ ${time} ${timezoneStr}`;
    }
    return null;
  }, [day, period, time, timezone]);

  return (
    <Grid item xs={12}>
      <Paper className={classes.listItem} elevation={2}>
        <Box className={classes.details}>
          <Typography>{title}</Typography>
          <Typography>
            {timespan} of gifting for {getTeamString()}
          </Typography>
        </Box>
        <Button onClick={handleEditReport} className={classes.editButton} endIcon={<Icon icon="chevron-right" />}>
          Edit
        </Button>
      </Paper>
    </Grid>
  );
};

export default memo(AutomatedReportCard);
