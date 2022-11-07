import React, { memo, useCallback } from 'react';
import { Box, Drawer } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AlyceTheme } from '@alycecom/ui';
import { makeStyles } from '@mui/styles';

import {
  getHasBackButton,
  getIsSidebarOpen,
  getPrevSidebarStep,
  getSidebarStep,
} from '../store/reportingSidebar/reportingSidebar.selectors';
import { setSidebarStep } from '../store/reportingSidebar/reportingSidebar.actions';
import {
  AutomatedReportTitle,
  CreateReportTitle,
  GiftingInsights,
  ReportingSidebarStep,
  ReportingStepTitle,
} from '../store/reporting/reporting.constants';

import AutomatedReports from './Steps/AutomatedReportSteps/AutomatedReports';
import ReportSidebarHeader from './ReportSidebarHeader';
import CreateReport from './Steps/CreateReportSteps/CreateReport';
import EditReport from './Steps/EditReportSteps/EditReport';
import DownloadReports from './Steps/DownloadReports';

const useStyles = makeStyles<AlyceTheme>(({ palette }) => ({
  paper: {
    backgroundColor: palette.common.white,
    boxShadow:
      '0px 8px 10px -5px rgb(0 0 0 / 0%), 0px 16px 24px 2px rgb(0 0 0 / 0%), 0px 6px 30px 5px rgb(0 0 0 / 10%)',
  },
  backdrop: {
    '& .MuiBackdrop-root': {
      background: 'rgba(0, 0, 0, 0.2)',
    },
  },
}));

const ReportingSidebar = (): JSX.Element => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const isOpen = useSelector(getIsSidebarOpen);
  const step = useSelector(getSidebarStep);
  const prevStep = useSelector(getPrevSidebarStep);
  const sidebarTitle = step !== null ? ReportingStepTitle[step] : null;

  const handleCloseSidebar = useCallback(() => {
    if (
      step === ReportingSidebarStep.automatedGiftingTrends ||
      step === ReportingSidebarStep.automatedPerformanceSummary ||
      step === ReportingSidebarStep.automatedTeamUsage ||
      step === ReportingSidebarStep.downloadGiftingTrends ||
      step === ReportingSidebarStep.downloadTeamUsage ||
      step === ReportingSidebarStep.downloadPerformanceSummary
    ) {
      dispatch(setSidebarStep({ step: null }));
    }
  }, [dispatch, step]);

  const handleGoBackToAutomatedReport = useCallback(() => {
    dispatch(setSidebarStep({ step: prevStep }));
  }, [dispatch, prevStep]);

  const hasGoBackButton = useSelector(getHasBackButton);

  return (
    <Drawer
      classes={{ root: classes.backdrop, paper: classes.paper }}
      anchor="right"
      open={isOpen}
      onClose={handleCloseSidebar}
    >
      <Box width={600}>
        <ReportSidebarHeader
          title={sidebarTitle}
          onCloseSidebar={hasGoBackButton ? handleGoBackToAutomatedReport : handleCloseSidebar}
          goBack={hasGoBackButton}
          isEditReport={
            step === ReportingSidebarStep.editPerformanceReport ||
            step === ReportingSidebarStep.editGiftingTrendsReport ||
            step === ReportingSidebarStep.editTeamUsageReport
          }
        />
        <>
          {step === ReportingSidebarStep.downloadPerformanceSummary && (
            <DownloadReports
              stepName={GiftingInsights.performanceSummary}
              stepType={ReportingSidebarStep.downloadPerformanceSummary}
              stepTitle="Select Reporting Criteria"
            />
          )}
          {step === ReportingSidebarStep.downloadTeamUsage && (
            <DownloadReports
              stepName={GiftingInsights.teamUsage}
              stepType={ReportingSidebarStep.downloadTeamUsage}
              stepTitle="Select Reporting Criteria"
            />
          )}
          {step === ReportingSidebarStep.downloadGiftingTrends && (
            <DownloadReports
              stepName={GiftingInsights.giftingTrends}
              stepType={ReportingSidebarStep.downloadGiftingTrends}
              stepTitle="Select Reporting Criteria"
            />
          )}

          {step === ReportingSidebarStep.automatedPerformanceSummary && (
            <AutomatedReports
              stepName={GiftingInsights.performanceSummary}
              stepType={ReportingSidebarStep.automatedPerformanceSummary}
              stepTitle={AutomatedReportTitle[ReportingSidebarStep.automatedPerformanceSummary]}
            />
          )}
          {step === ReportingSidebarStep.automatedTeamUsage && (
            <AutomatedReports
              stepName={GiftingInsights.teamUsage}
              stepType={ReportingSidebarStep.automatedTeamUsage}
              stepTitle={AutomatedReportTitle[ReportingSidebarStep.automatedTeamUsage]}
            />
          )}
          {step === ReportingSidebarStep.automatedGiftingTrends && (
            <AutomatedReports
              stepName={GiftingInsights.giftingTrends}
              stepType={ReportingSidebarStep.automatedGiftingTrends}
              stepTitle={AutomatedReportTitle[ReportingSidebarStep.automatedGiftingTrends]}
            />
          )}
          {step === ReportingSidebarStep.createPerformanceSummaryReport && (
            <CreateReport
              stepName={GiftingInsights.performanceSummary}
              stepType={ReportingSidebarStep.createPerformanceSummaryReport}
              stepTitle={CreateReportTitle[ReportingSidebarStep.createPerformanceSummaryReport]}
            />
          )}
          {step === ReportingSidebarStep.createNewTeamUsageReport && (
            <CreateReport
              stepName={GiftingInsights.teamUsage}
              stepType={ReportingSidebarStep.createNewTeamUsageReport}
              stepTitle={CreateReportTitle[ReportingSidebarStep.createNewTeamUsageReport]}
            />
          )}
          {step === ReportingSidebarStep.createGiftingTrendsReport && (
            <CreateReport
              stepName={GiftingInsights.giftingTrends}
              stepType={ReportingSidebarStep.createGiftingTrendsReport}
              stepTitle={CreateReportTitle[ReportingSidebarStep.createGiftingTrendsReport]}
            />
          )}
          {step === ReportingSidebarStep.editPerformanceReport && (
            <EditReport
              stepType={ReportingSidebarStep.editPerformanceReport}
              stepName={GiftingInsights.performanceSummary}
            />
          )}
          {step === ReportingSidebarStep.editGiftingTrendsReport && (
            <EditReport
              stepType={ReportingSidebarStep.editGiftingTrendsReport}
              stepName={GiftingInsights.giftingTrends}
            />
          )}
          {step === ReportingSidebarStep.editTeamUsageReport && (
            <EditReport stepType={ReportingSidebarStep.editTeamUsageReport} stepName={GiftingInsights.teamUsage} />
          )}
        </>
      </Box>
    </Drawer>
  );
};

export default memo(ReportingSidebar);
