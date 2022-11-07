import React, { memo, useCallback, useMemo, useEffect } from 'react';
import { Box, Button, FormControl, FormHelperText, Grid, TextField, Typography, Autocomplete } from '@mui/material';
import { makeStyles } from '@mui/styles';
import classNames from 'classnames';
import { Controller, FieldError, useForm, FormProvider } from 'react-hook-form';
import { AlyceTheme, ModalConfirmationMessage } from '@alycecom/ui';
import moment from 'moment-timezone';
import { useDispatch, useSelector } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import { Auth, User } from '@alycecom/modules';
import { useModalState } from '@alycecom/hooks';

import {
  GiftingInsights,
  GiftingInsightsAPICall,
  ReportingSidebarCategory,
  ReportingSidebarStep,
  reportingTimespan,
} from '../../../store/reporting/reporting.constants';
import StepSection from '../../StepSection';
import { ITeam } from '../../../../UsersManagement/store/usersManagement.types';
import { deleteReport, editReport } from '../../../store/reporting/reporting.actions';
import { getIsLoaded, getTeams, getTeamsByAdmin } from '../../../../../store/teams/teams.selectors';
import { PermissionKeys } from '../../../../../constants/permissions.constants';
import {
  formDefaultValues,
  AutomatedReportFormSchema,
  TAutomatedReportForm,
} from '../../../store/reporting/reporting.schemas';
import { getEditStatusPending, getReportToEdit } from '../../../store/reporting/reporting.selectors';
import ReportingCriteria from '../CreateReportSteps/ReportingCriteria';
import ReportingFrequency from '../CreateReportSteps/ReportingFrequency';
import { setSidebarStep } from '../../../store/reportingSidebar/reportingSidebar.actions';
import { getReportIdToEdit } from '../../../store/reportingSidebar/reportingSidebar.selectors';
import { makeHasPermissionSelector } from '../../../../../store/common/permissions/permissions.selectors';
import { IReportInfo } from '../../../store/reporting/reporting.types';
import { formattedSendDay } from '../../../../SettingsModule/helpers/reporting.helpers';
import { useReportingTrackEvent } from '../../../../SettingsModule/hooks/useReportingTrackEvent';
import { useSetFormDirtyEffect } from '../../../hooks/useSetFormDirtyEffect';
import { ReportingFrequencyEnum } from '../../../../SettingsModule/constants/reporting.constants';

const useStyles = makeStyles<AlyceTheme>(({ palette, spacing }) => ({
  box: {
    marginBottom: spacing(2.8),
  },
  error: {
    color: palette.error.main,
  },
  title: {
    marginBottom: spacing(2.8),
  },
  reportingTimespan: {
    width: 320,
  },
  selectedTeams: {
    width: 544,
    marginTop: spacing(4.1),
  },
  frequency: {
    width: 219,
  },
  on: {
    margin: spacing(0, 2.3, 0, 2.3),
  },
  deleteButton: {
    width: 154,
    height: 48,
    background: palette.error.main,
    color: palette.common.white,
    fontSize: 16,
    marginRight: spacing(1.05),
    '&:hover': {
      backgroundColor: palette.error.light,
    },
  },
  saveButton: {
    width: 154,
    height: 48,
  },
  allTeamsText: {
    fontStyle: 'italic',
    fontSize: 16,
    marginBottom: spacing(4),
    marginTop: spacing(2),
  },
}));

interface IEditReport {
  stepType: ReportingSidebarStep;
  stepName: GiftingInsights;
}

const EditReport = ({ stepType, stepName }: IEditReport): JSX.Element => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const trackEvent = useReportingTrackEvent();
  const allTeams: ITeam[] = useSelector(getTeams);
  const canManage: number[] = useSelector(User.selectors.getUserCanManageTeams);
  const isTeamsLoaded = useSelector(getIsLoaded);
  const isStatusReportPending = useSelector(getEditStatusPending);
  const hasOrganizationSettings = useSelector(
    useMemo(() => makeHasPermissionSelector(PermissionKeys.OrganisationAdmin), []),
  );
  const teamsByAdmin = useSelector(useMemo(() => getTeamsByAdmin(canManage), [canManage]));
  const teams = !hasOrganizationSettings ? teamsByAdmin : allTeams;
  const { isOpen, handleClose, handleOpen } = useModalState();
  const userEmail = useSelector(Auth.selectors.getUserEmail) as string;
  const org = useSelector(User.selectors.getOrgId) as number;
  const timeZone = moment.tz.guess();
  const report: IReportInfo | undefined = useSelector(getReportToEdit);
  const reportId = useSelector(getReportIdToEdit);

  const methods = useForm<TAutomatedReportForm>({
    mode: 'all',
    defaultValues: { ...formDefaultValues, teams },
    resolver: yupResolver(AutomatedReportFormSchema),
  });
  const {
    control,
    handleSubmit,
    formState: { isValid, errors, isDirty },
    reset,
  } = methods;

  useSetFormDirtyEffect({ isDirty });

  const checkOptionIsSelected = useCallback((option: ITeam, value: ITeam): boolean => option.id === value.id, []);
  const handleDiscardModal = useCallback(() => handleClose(), [handleClose]);
  const handleGoBackToAutomatedReport = useCallback(() => {
    if (reportId) {
      dispatch(deleteReport.pending(reportId));
    }
    dispatch(setSidebarStep({ step: ReportingSidebarCategory[stepName].automatedReport }));
  }, [dispatch, reportId, stepName]);
  const handleOpenDiscardModal = useCallback(() => {
    handleOpen();
  }, [handleOpen]);

  useEffect(() => {
    if (report && isTeamsLoaded) {
      let frequencyValue = '';
      const isMonthly = report.schedule === ReportingFrequencyEnum.monthly;
      if (report.sendDay === '') {
        frequencyValue = isMonthly ? '1th' : 'Monday';
      } else {
        frequencyValue = isMonthly ? `${report.sendDay}th` : moment(report.sendDay, 'ddd').format('dddd');
      }

      const teamsIds = report.teamId;
      reset({
        teams: teams.filter(item => teamsIds.includes(item.id.toString())) || teams,
        reportingTimespan: reportingTimespan.find(item => item.key === report.timespan) || reportingTimespan[0],
        frequency: report.schedule.charAt(0).toUpperCase() + report.schedule.slice(1),
        days: frequencyValue,
        time: moment(report.sendTime, 'Hmm').format('h:mm A'),
        timezone: report.timezone,
      });
    }
  }, [report, reset, teams, isTeamsLoaded]);

  const onSubmit = (form: TAutomatedReportForm) => {
    const payload = {
      email: userEmail,
      timezone: timeZone,
      orgId: org,
      teamId: form.teams.map(item => item.id),
      schedule: form.frequency.toLowerCase(),
      sendDay: formattedSendDay(form),
      sendTime: moment(form.time, 'hh:mm A').format('HHmm'),
      timespan: form.reportingTimespan.key,
      name: GiftingInsightsAPICall[stepName],
      id: reportId,
    };
    trackEvent(`Gifting Insights - ${stepName} - Automated Reporting edit save changes`, payload);
    dispatch(editReport.pending(payload));
  };

  return (
    <StepSection step={stepType} title={`${stepName} Report Automation`}>
      <FormProvider {...methods}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <ReportingCriteria />
          <Box className={classNames(classes.box, classes.selectedTeams)}>
            <Controller
              control={control}
              name="teams"
              render={({ field: { onChange, value } }) => (
                <FormControl variant="outlined" fullWidth>
                  <Autocomplete
                    id="multiple-teams"
                    multiple
                    limitTags={3}
                    disableClearable
                    disableCloseOnSelect
                    options={teams}
                    value={value}
                    getOptionLabel={option => option.name}
                    isOptionEqualToValue={checkOptionIsSelected}
                    filterSelectedOptions
                    disabled={!isTeamsLoaded}
                    onChange={(_, teamsValue) => onChange(teamsValue)}
                    noOptionsText="No teams"
                    renderInput={params => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Select teams"
                        placeholder="Select teams"
                        data-testid="UsersManagement.Edit.TeamsSelect"
                      />
                    )}
                  />
                  {!!errors.teams && (
                    <FormHelperText className={classes.error}>
                      {((errors.teams as unknown) as FieldError).message}
                    </FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </Box>
          <ReportingFrequency />
          <Grid container direction="row" justifyContent="space-between">
            <Grid item>
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                data-testid="EditReport.ScheduleReport"
                disabled={!isValid || isStatusReportPending}
                className={classes.saveButton}
              >
                Save Changes
              </Button>
            </Grid>
            <Grid item>
              <Button className={classes.deleteButton} variant="outlined" onClick={handleOpenDiscardModal}>
                Delete Report
              </Button>
            </Grid>
          </Grid>
          <ModalConfirmationMessage
            isOpen={isOpen}
            title="Delete Report?"
            width="100%"
            icon="pencil"
            submitButtonText="Yes"
            cancelButtonText="No"
            backdropStyles={{ top: 0 }}
            onSubmit={handleGoBackToAutomatedReport}
            onDiscard={handleDiscardModal}
          >
            <Typography className="Body-Regular-Left-Static">
              Are you sure you wish to delete this automated report?
            </Typography>
          </ModalConfirmationMessage>
        </Box>
      </FormProvider>
    </StepSection>
  );
};

export default memo(EditReport);
