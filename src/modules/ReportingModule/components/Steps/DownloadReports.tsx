import React, { memo, useCallback, useMemo } from 'react';
import { AlyceTheme, createRangeItems, DateRangeSelect, REQUEST_DATE_FORMAT } from '@alycecom/ui';
import { Controller, FieldError, useForm, FormProvider } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames';
import { Autocomplete, Box, FormControl, FormHelperText, TextField, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { User } from '@alycecom/modules';
import LoadingButton from '@mui/lab/LoadingButton';

import {
  GiftingInsights,
  ReportingSidebarStep,
  GiftingInsightsAPICall,
} from '../../store/reporting/reporting.constants';
import StepSection from '../StepSection';
import { getIsLoaded, getTeams, getTeamsByAdmin } from '../../../../store/teams/teams.selectors';
import { TDownloadReportForm, DownloadReportFormSchema } from '../../store/reporting/reporting.schemas';
import { PermissionKeys } from '../../../../constants/permissions.constants';
import { ITeam } from '../../../UsersManagement/store/usersManagement.types';
import { getDownloadReportPending } from '../../store/reporting/reporting.selectors';
import { downloadReport } from '../../store/reporting/reporting.actions';
import { makeHasPermissionSelector } from '../../../../store/common/permissions/permissions.selectors';
import { useReportingTrackEvent } from '../../../SettingsModule/hooks/useReportingTrackEvent';

const useStyles = makeStyles<AlyceTheme>(({ palette, spacing }) => ({
  box: {
    width: 250,
    marginBottom: 26,
  },
  error: {
    color: palette.error.main,
  },
  reportingTimeframe: {
    width: 250,
  },
  selectTeams: {
    width: 544,
  },
  sendReportLabel: {
    padding: spacing(1, 0, 4, 0),
  },
  button: {
    padding: spacing(1.5, 3),
  },
  allTeamsDescription: {
    fontSize: 16,
    fontStyle: 'italic',
    marginTop: spacing(2),
    marginBottom: spacing(4.6),
  },
}));

interface IDownloadReportProps {
  stepName: GiftingInsights;
  stepType: ReportingSidebarStep;
  stepTitle: string;
}

const DownloadReports = ({ stepName, stepType, stepTitle }: IDownloadReportProps): JSX.Element => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const trackEvent = useReportingTrackEvent();
  const hasOrganizationSettings = useSelector(
    useMemo(() => makeHasPermissionSelector(PermissionKeys.OrganisationAdmin), []),
  );
  const allTeams = useSelector(getTeams);
  const canManage = useSelector(User.selectors.getUserCanManageTeams);
  const isLoaded = useSelector(getIsLoaded);
  const teamsByAdmin = useSelector(getTeamsByAdmin(canManage));
  const org = useSelector(User.selectors.getOrgId) as number;
  const isDownloadReportPending = useSelector(getDownloadReportPending);
  const userEmail = useSelector(User.selectors.getUserEmail) as string;

  const teams = !hasOrganizationSettings ? teamsByAdmin : allTeams;
  const rangeItems = useMemo(() => createRangeItems(REQUEST_DATE_FORMAT), []);

  const methods = useForm<TDownloadReportForm>({
    mode: 'all',
    defaultValues: {
      reportingTimeframe: rangeItems[4].value,
      teams: stepName !== GiftingInsights.teamUsage ? teams : [],
    },
    resolver: yupResolver(DownloadReportFormSchema),
  });
  const {
    control,
    handleSubmit,
    formState: { isValid, errors },
  } = methods;

  const checkOptionIsSelected = useCallback((option: ITeam, value: ITeam): boolean => option.id === value.id, []);

  const onSubmit = useCallback(
    (form: TDownloadReportForm) => {
      const allTime = form.reportingTimeframe?.preset === 'All Times';

      const allTimeDate = new Date().toISOString().split('T')[0];

      const payload = {
        orgId: org,
        teamId: form.teams ? form?.teams?.map(item => item.id) : [],
        startDate: allTime ? allTimeDate : form.reportingTimeframe?.from,
        endDate: allTime ? allTimeDate : form.reportingTimeframe?.to,
        name: GiftingInsightsAPICall[stepName],
        runOnce: true,
        allTime,
      };
      trackEvent(`Gifting Insights - ${stepName} On Demand - Send Report Clicked`, payload);
      dispatch(downloadReport.pending(payload));
    },
    [dispatch, org, stepName, trackEvent],
  );

  return (
    <StepSection step={stepType} title={stepTitle}>
      <FormProvider {...methods}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Box className={classNames(classes.box, classes.reportingTimeframe)}>
            <Controller
              control={control}
              name="reportingTimeframe"
              render={({ field: { onChange, value } }) => (
                <DateRangeSelect
                  from={value?.from}
                  to={value?.to}
                  onChange={onChange}
                  format="YYYY-MM-DD"
                  dataTestId="DownloadReportsDate.DateRange"
                  label="Reporting Timeframe"
                  fullWidth
                />
              )}
            />
            {!!errors.reportingTimeframe?.from && (
              <FormHelperText className={classes.error}>
                {((errors.reportingTimeframe?.from as unknown) as FieldError).message}
              </FormHelperText>
            )}
          </Box>

          <Box className={classNames(classes.box, classes.selectTeams)}>
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
                    disabled={!isLoaded}
                    onChange={(_, teamsValue) => onChange(teamsValue)}
                    noOptionsText="No teams"
                    renderInput={params => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Select teams"
                        placeholder="Select teams"
                        data-testid="DownloadPerformanceSummary.Edit.TeamsSelect"
                      />
                    )}
                  />
                  {!!errors?.teams && (
                    <FormHelperText className={classes.error}>
                      {((errors?.teams as unknown) as FieldError).message}
                    </FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </Box>
          <Typography className={classes.sendReportLabel}>
            Report will be emailed to {userEmail} within 2 minutes
          </Typography>
          <Box className={classes.box}>
            <LoadingButton
              className={classes.button}
              type="submit"
              color="secondary"
              variant="contained"
              size="small"
              disabled={!isValid}
              loading={isDownloadReportPending}
              data-testid="DownloadReportButton.DownloadReport"
            >
              Send Report
            </LoadingButton>
          </Box>
        </Box>
      </FormProvider>
    </StepSection>
  );
};

export default memo(DownloadReports);
