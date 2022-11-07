import React, { memo, useCallback, useMemo } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { AlyceTheme, Button, LoadingLabel } from '@alycecom/ui';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment/moment';
import { makeStyles } from '@mui/styles';

import {
  ReportingSidebarStep,
  GiftingInsights,
  ReportingSidebarCategory,
  reportingTimespan,
} from '../../../store/reporting/reporting.constants';
import { setSidebarStep } from '../../../store/reportingSidebar/reportingSidebar.actions';
import StepSection from '../../StepSection';
import { getReportsByReportName, getListStatusPending } from '../../../store/reporting/reporting.selectors';
import { IReportInfo } from '../../../store/reporting/reporting.types';
import { resetCreateStatus } from '../../../store/reporting/reporting.actions';
import { useReportingTrackEvent } from '../../../../SettingsModule/hooks/useReportingTrackEvent';

import AutomatedReportCard from './AutomatedReportCard';

const useStyles = makeStyles<AlyceTheme>(({ palette, spacing }) => ({
  addReportBtn: {
    boxShadow: '0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)',
  },
  reportBox: {
    padding: spacing(2, 0, 4, 0),
  },
  reportsNumber: {
    color: palette.grey.main,
    alignSelf: 'flex-end',
  },
  loader: {
    marginTop: spacing(3),
    width: 553,
    marginLeft: spacing(3),
    height: 25,
  },
}));

interface IAutomatedReportProps {
  stepName: GiftingInsights;
  stepType: ReportingSidebarStep;
  stepTitle: string;
}

const AutomatedReports = ({ stepName, stepType, stepTitle }: IAutomatedReportProps): JSX.Element => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const trackEvent = useReportingTrackEvent();
  const reportsByReportName = useSelector(useMemo(() => getReportsByReportName(stepName), [stepName]));
  const isLoading = useSelector(getListStatusPending);
  const handleCreateAutomatedReport = useCallback(() => {
    trackEvent(`Gifting Insights - ${stepName} Automated - Add Report Clicked`);
    dispatch(resetCreateStatus());
    dispatch(setSidebarStep({ step: ReportingSidebarCategory[stepName].createReport }));
  }, [dispatch, stepName, trackEvent]);

  return (
    <StepSection step={stepType} title={stepTitle} subtitle="Specify when you would like reports emailed to you">
      <Box display="flex" flexDirection="row-reverse" justifyContent="space-between" className={classes.reportBox}>
        <Button className={classes.addReportBtn} onClick={handleCreateAutomatedReport}>
          Add Report
        </Button>

        <Typography variant="caption" className={classes.reportsNumber}>
          {reportsByReportName.length} reports
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {isLoading ? (
          <Box>
            <LoadingLabel className={classes.loader} />
            <LoadingLabel className={classes.loader} />
            <LoadingLabel className={classes.loader} />
          </Box>
        ) : (
          reportsByReportName &&
          reportsByReportName.map((item: IReportInfo) => (
            <React.Fragment key={item.id}>
              <AutomatedReportCard
                id={item.id}
                period={item.schedule}
                day={item.sendDay}
                time={moment(item.sendTime, 'Hmm').format('hh:mm a')}
                timezone={item.timezone}
                numberOfTeams={item.teamId.length.toString()}
                stepName={stepName}
                timespan={reportingTimespan.find(timespan => timespan.key === item.timespan)?.value}
              />
            </React.Fragment>
          ))
        )}
      </Grid>
    </StepSection>
  );
};

export default memo(AutomatedReports);
