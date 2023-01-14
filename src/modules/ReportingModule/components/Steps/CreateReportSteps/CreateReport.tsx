import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { AlyceTheme, ModalConfirmationMessage } from '@alycecom/ui';
import { Controller, FieldError, FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames';
import moment from 'moment-timezone';
import { Auth, User } from '@alycecom/modules';
import { useModalState } from '@alycecom/hooks';
import { makeStyles } from '@mui/styles';

import {
  GiftingInsights,
  GiftingInsightsAPICall,
  ReportingSidebarCategory,
  ReportingSidebarStep,
} from '../../../store/reporting/reporting.constants';
import { getCreateStatusFulfilled, getCreateStatusPending } from '../../../store/reporting/reporting.selectors';
import StepSection from '../../StepSection';
import { getIsLoaded, getTeams, getTeamsByAdmin } from '../../../../../store/teams/teams.selectors';
import {
  AutomatedReportFormSchema,
  formDefaultValues,
  TAutomatedReportForm,
} from '../../../store/reporting/reporting.schemas';
import usePermissions from '../../../../../hooks/usePermissions';
import { PermissionKeys } from '../../../../../constants/permissions.constants';
import { createReport } from '../../../store/reporting/reporting.actions';
import { setSidebarStep } from '../../../store/reportingSidebar/reportingSidebar.actions';
import { ITeam } from '../../../../../store/teams/teams.types';
import { formattedSendDay } from '../../../../SettingsModule/helpers/reporting.helpers';
import { useReportingTrackEvent } from '../../../hooks/useReportingTrackEvent';
import { useSetFormDirtyEffect } from '../../../hooks/useSetFormDirtyEffect';
import { renderTeamLabel } from '../../../../../helpers';

import ReportingFrequency from './ReportingFrequency';
import ReportingCriteria from './ReportingCriteria';

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
  discardButton: {
    width: 154,
    height: 48,
    color: palette.link.main,
    fontSize: 16,
    marginRight: spacing(1.05),
  },
  allTeamsText: {
    fontStyle: 'italic',
    fontSize: 16,
    marginBottom: spacing(4),
    marginTop: spacing(2),
  },
  checkboxLabel: {
    marginLeft: 0,
    marginTop: 15,
  },
}));

interface ICreateReport {
  stepName: GiftingInsights;
  stepType: ReportingSidebarStep;
  stepTitle: string;
}

const CreateReport = ({ stepName, stepType, stepTitle }: ICreateReport): JSX.Element => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [includeArchived, setIncludeArchived] = useState(false);
  const trackEvent = useReportingTrackEvent();
  const allTeams: ITeam[] = useSelector(getTeams);
  const canManage: number[] = useSelector(User.selectors.getUserCanManageTeams);
  const areTeamsLoaded = useSelector(getIsLoaded);
  const isStatusReportFulfilled = useSelector(getCreateStatusFulfilled);
  const isStatusReportPending = useSelector(getCreateStatusPending);
  const permissions = usePermissions();
  const hasOrganizationSettings = permissions.includes(PermissionKeys.OrganisationAdmin);
  const teamsByAdmin = useSelector(getTeamsByAdmin(canManage));
  const teams = !hasOrganizationSettings ? teamsByAdmin : allTeams;
  const { isOpen, handleClose, handleOpen } = useModalState();
  const userEmail = useSelector(Auth.selectors.getUserEmail) as string;
  const org = useSelector(User.selectors.getOrgId) as number;
  const timeZone = moment.tz.guess();
  const checkOptionIsSelected = useCallback((option: ITeam, value: ITeam): boolean => option.id === value.id, []);
  const handleDiscardModal = useCallback(() => handleClose(), [handleClose]);

  const archivedTeams = teams.filter(item => item.archivedAt !== null);
  const isShowArchivedToggle = useMemo(() => archivedTeams.length > 0, [archivedTeams]);
  const targetTeams = includeArchived ? teams : teams.filter(item => item.archivedAt === null);
  const handleIncludeArchived = useCallback(
    (_, status) => {
      trackEvent('Include archived — clicked', { page: 'giftingInsights', includeArchived: status ? 'yes' : 'no' });
      setIncludeArchived(status);
    },
    [trackEvent, setIncludeArchived],
  );

  const handleGoBackToAutomatedReport = useCallback(() => {
    dispatch(setSidebarStep({ step: ReportingSidebarCategory[stepName].automatedReport }));
  }, [dispatch, stepName]);

  const handleOpenDiscardModal = useCallback(() => {
    handleOpen();
  }, [handleOpen]);

  useEffect(() => {
    if (isStatusReportFulfilled) {
      dispatch(setSidebarStep({ step: ReportingSidebarCategory[stepName].automatedReport }));
    }
  }, [dispatch, isStatusReportFulfilled, stepName]);
  const methods = useForm<TAutomatedReportForm>({
    mode: 'all',
    defaultValues: {
      ...formDefaultValues,
      teams: stepName !== GiftingInsights.teamUsage ? targetTeams : [],
    },
    resolver: yupResolver(AutomatedReportFormSchema),
  });
  const {
    control,
    handleSubmit,
    formState: { isValid, errors, isDirty },
  } = methods;

  useSetFormDirtyEffect({ isDirty });

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
    };
    trackEvent(`Gifting Insights - ${stepName} Automated - Schedule Report Clicked`, payload);
    dispatch(createReport.pending(payload));
  };

  return (
    <StepSection step={stepType} title={stepTitle}>
      <FormProvider {...methods}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <ReportingCriteria />
          {isShowArchivedToggle && (
            <FormControlLabel
              className={classes.checkboxLabel}
              control={<Switch checked={includeArchived} onChange={handleIncludeArchived} color="primary" />}
              label="Show archived teams"
            />
          )}
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
                    options={targetTeams}
                    value={value}
                    getOptionLabel={renderTeamLabel}
                    isOptionEqualToValue={checkOptionIsSelected}
                    filterSelectedOptions
                    disabled={!areTeamsLoaded}
                    onChange={(_, teamsValue) => onChange(teamsValue)}
                    noOptionsText="No teams"
                    renderInput={params => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Select teams"
                        placeholder="Select teams"
                        data-testid="CreateReport.TeamsSelect"
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
                data-testid="CreateReport.ScheduleReport"
                disabled={!isValid || isStatusReportPending}
              >
                Schedule Report
              </Button>
            </Grid>
            <Grid item>
              <Button className={classes.discardButton} variant="outlined" onClick={handleOpenDiscardModal}>
                Discard Report
              </Button>
            </Grid>
          </Grid>
          <ModalConfirmationMessage
            isOpen={isOpen}
            title="Discard Report?"
            width="100%"
            icon="pencil"
            submitButtonText="Yes"
            cancelButtonText="No"
            backdropStyles={{ top: 0 }}
            onSubmit={handleGoBackToAutomatedReport}
            onDiscard={handleDiscardModal}
          >
            <Typography className="Body-Regular-Left-Static">
              Are you sure you wish to discard this automated report?
            </Typography>
          </ModalConfirmationMessage>
        </Box>
      </FormProvider>
    </StepSection>
  );
};

export default memo(CreateReport);
