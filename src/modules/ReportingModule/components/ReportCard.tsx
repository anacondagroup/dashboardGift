import React, { memo, useCallback, useMemo } from 'react';
import { Button, Grid, Typography } from '@mui/material';
import { AlyceTheme, LoadingLabel } from '@alycecom/ui';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@mui/styles';

import { getReportsByReportName, getListStatusPending } from '../store/reporting/reporting.selectors';
import { setSidebarStep } from '../store/reportingSidebar/reportingSidebar.actions';
import { GiftingInsights, ReportingSidebarCategory } from '../store/reporting/reporting.constants';
import { useReportingTrackEvent } from '../../SettingsModule/hooks/useReportingTrackEvent';

import ReportingSidebar from './ReportSidebar';

const useStyles = makeStyles<AlyceTheme>(({ spacing, palette }) => ({
  item: {
    borderBottom: `1px solid var(--Timber-Wolf-80)`,
    padding: spacing(5),
    display: 'flex',
    flexFlow: 'row wrap',
    width: '100%',
    justifyContent: 'space-between',
    '&:last-child': {
      borderBottom: 'none',
    },
  },
  details: {
    flexShrink: 0,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subTitle: {
    fontSize: 16,
    fontWeight: 500,
  },
  list: {
    padding: spacing(0, 3),
  },
  downloadBtn: {
    width: 'max-content',
    backgroundColor: palette.green.dark,
    color: palette.common.white,
    '&:hover': {
      backgroundColor: palette.green.mountainMeadowLight,
    },
  },
  automatedBtn: {
    width: 'max-content',
    boxShadow: 'none',
    border: `1px solid ${palette.divider}`,
    backgroundColor: palette.common.white,
    color: palette.link.main,
    '&:hover': {
      backgroundColor: palette.grey.A200,
    },
  },
  btnWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: spacing(2),
    flexDirection: 'column',
  },
  reportsNumber: {
    fontSize: 12,
    fontStyle: 'italic',
    color: palette.grey.main,
    paddingTop: spacing(1),
  },
  loader: {
    marginTop: spacing(1),
    width: 120,
  },
}));

export type IReportCardProps = {
  image: string;
  details: string[];
  stepName: GiftingInsights;
};

const ReportCard = ({ image, stepName, details }: IReportCardProps): JSX.Element => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const trackEvent = useReportingTrackEvent();
  const reportsByReportName = useSelector(useMemo(() => getReportsByReportName(stepName), [stepName]));
  const isLoading = useSelector(getListStatusPending);
  const downloadComponent = ReportingSidebarCategory[stepName].downloadReport;
  const automatedComponent = ReportingSidebarCategory[stepName].automatedReport;
  const handleDownloadNowSidebar = useCallback(() => {
    trackEvent(`Gifting Insights - ${stepName} - Report On-Demand clicked`);
    dispatch(setSidebarStep({ step: downloadComponent }));
  }, [dispatch, downloadComponent, stepName, trackEvent]);

  const handleAutomatedReportsSidebar = useCallback(() => {
    trackEvent(`Gifting Insights - ${stepName} - Automated Reporting clicked`);
    dispatch(setSidebarStep({ step: automatedComponent }));
  }, [trackEvent, stepName, dispatch, automatedComponent]);

  return (
    <Grid item className={classes.item}>
      <ReportingSidebar />
      <img src={image} alt="Reporting Analytics" width={152} height={152} />

      <Grid item xs={4} className={classes.details}>
        <Typography className={classes.title}>{`${stepName} Report`}</Typography>
        <Typography className={classes.subTitle}>This report highlights:</Typography>
        <ul className={classes.list}>
          {details.map(detail => (
            <li key={detail}>{detail}</li>
          ))}
        </ul>
      </Grid>

      <Grid item container xs={4} className={classes.btnWrapper}>
        <Button variant="contained" className={classes.downloadBtn} onClick={handleDownloadNowSidebar}>
          Report On-Demand
        </Button>
        <Grid item>
          <Button className={classes.automatedBtn} variant="contained" onClick={handleAutomatedReportsSidebar}>
            Automated Reporting
          </Button>
          {isLoading ? (
            <LoadingLabel className={classes.loader} />
          ) : (
            <Typography className={classes.reportsNumber}>{reportsByReportName.length} Automated Reports</Typography>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default memo(ReportCard);
