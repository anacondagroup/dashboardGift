import React, { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { useController, useForm, useWatch } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { Box, Checkbox, FormControlLabel, FormGroup, Grid, Link, Theme, Typography } from '@mui/material';
import { useApplyManualFormErrorsEffect } from '@alycecom/hooks';
import { CampaignSettings, Features } from '@alycecom/modules';
import { Icon, Tooltip } from '@alycecom/ui';
import { useGetTeamMembersQuery, TTeamMember } from '@alycecom/services';
import { skipToken } from '@reduxjs/toolkit/query';

import {
  detailsFormDefaultValues,
  DetailsFormFields,
  detailsFormResolver,
  TDetailsFormValues,
} from '../../store/prospectingCampaign/steps/details/details.schemas';
import { useProspecting } from '../../hooks';
import { getDetailsData, getDetailsErrors } from '../../store/prospectingCampaign/steps/details/details.selectors';
import { SectionTitle } from '../styled/Styled';
import TeamMembersPicker from '../../../SettingsModule/components/CampaignSettings/TeamMembersPicker/TeamMembersPicker';

import CampaignName from './Fields/CampaignName';
import Team from './Fields/Team';
import CampaignManager from './Fields/CampaignManager';
import Countries from './Fields/Countries';
import EmailNotificationsController from './Fields/EmailNotificationController';
import CampaignInstructions from './Fields/CampaignInstructions';

export interface IDetailsChildRendererProps {
  isDirty: boolean;
}

export interface IDetailsFormProps {
  onSubmit: (values: TDetailsFormValues, isDirty: boolean) => void;
  children: ReactNode | ((arg0: IDetailsChildRendererProps) => ReactNode);
}

const styles = {
  toolTipIcon: {
    marginTop: ({ spacing }: Theme) => spacing(1),
    color: ({ palette }: Theme) => palette.grey.superLight,
  },
  underlineLink: {
    textDecoration: 'underline',
  },
} as const;

const DetailsForm = ({ onSubmit, children }: IDetailsFormProps): JSX.Element => {
  const { campaignId } = useProspecting();
  const {
    control,
    handleSubmit,
    formState: { isDirty },
    setError,
    reset,
    setValue,
  } = useForm<TDetailsFormValues>({
    resolver: detailsFormResolver,
    defaultValues: detailsFormDefaultValues,
  });

  const teamId = useWatch({ control, name: DetailsFormFields.Team });

  const { data: teamMembersData, isLoading } = useGetTeamMembersQuery(teamId ? { teamId: `${teamId}` } : skipToken);

  const data = useSelector(getDetailsData);
  const existingTeamMemberIds = useMemo(() => (data ? data.teamMemberIds : []), [data]);
  const errors = useSelector(getDetailsErrors);

  const hasBudgetManagementSetup = useSelector(
    Features.selectors.hasFeatureFlag(Features.FLAGS.BUDGET_MANAGEMENT_SETUP),
  );

  const {
    field: { onChange: onChangeTeamMemberIds, value: specificTeamMembersIds },
  } = useController({
    control,
    name: DetailsFormFields.TeamMemberIds,
  });

  const [setSpecificMembers, toggleSettingSpecificMembers] = useState(false);

  const teamMembers: TTeamMember[] = useMemo(() => {
    if (!isLoading && teamMembersData) {
      return Object.values(teamMembersData.entities) as TTeamMember[];
    }
    return [] as TTeamMember[];
  }, [teamMembersData, isLoading]);

  const campaignSpecificTeamMembers: TTeamMember[] = useMemo(
    () => teamMembers.filter(teamMember => specificTeamMembersIds.indexOf(teamMember.id.valueOf() as number) !== -1),
    [teamMembers, specificTeamMembersIds],
  );

  const handleSetCampaignSpecificTeamMembers = useCallback(
    (specificTeamMembers: TTeamMember[]) => {
      onChangeTeamMemberIds(specificTeamMembers.map(teamMember => teamMember.id));
    },
    [onChangeTeamMemberIds],
  );

  const handleChangeCheckbox = useCallback(() => {
    if (setSpecificMembers) {
      onChangeTeamMemberIds([]);
    }

    if (!setSpecificMembers) {
      onChangeTeamMemberIds(existingTeamMemberIds);
    }

    toggleSettingSpecificMembers(!setSpecificMembers);
  }, [onChangeTeamMemberIds, setSpecificMembers, existingTeamMemberIds]);

  const handleTeamChange = useCallback(() => {
    onChangeTeamMemberIds([]);
  }, [onChangeTeamMemberIds]);

  const toolTipTitle = (
    <Box>
      Each team member has an individual budget assigned to them they can draw from. To manage your team member&apos;s
      budget go to{' '}
      <Link href="/settings/teams/users-management/users" sx={styles.underlineLink}>
        Users & Teams
      </Link>
    </Box>
  );

  const submitHandler = (form: TDetailsFormValues) => {
    onSubmit(form, isDirty);
  };

  useEffect(() => {
    if (data) {
      reset(data);
    }
  }, [reset, data]);

  useApplyManualFormErrorsEffect<TDetailsFormValues>(setError, errors);
  const { useEntities, isFulfilled } = CampaignSettings.hooks.useTeams();
  const teamsMap = useEntities();
  const teams = useMemo(
    () =>
      Object.keys(teamsMap)
        .map(teamKey => teamsMap[teamKey])
        .filter(team => team?.archivedAt === null),
    [teamsMap],
  );

  useEffect(() => {
    if (isFulfilled && teams[0].id && !campaignId) {
      setValue(DetailsFormFields.Team, teams[0].id);
    }
  }, [setValue, isFulfilled, teams, campaignId]);

  useEffect(() => {
    if (data?.teamMemberIds) {
      onChangeTeamMemberIds(data.teamMemberIds);
      toggleSettingSpecificMembers(data.teamMemberIds.length > 0);
    }
  }, [data?.teamMemberIds, onChangeTeamMemberIds, toggleSettingSpecificMembers]);

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <Box mb={2}>
        <SectionTitle>Campaign Details</SectionTitle>
      </Box>
      <Grid component={Box} maxWidth={400} direction="column" container spacing={5}>
        <Grid item>
          <CampaignName control={control} />
        </Grid>
        <Grid item>
          <Team control={control} draft={!campaignId} onTeamChange={handleTeamChange} />
          {hasBudgetManagementSetup && (
            <>
              <Box mb={1}>
                <FormGroup row>
                  <FormControlLabel
                    control={
                      <Checkbox
                        value="enabled"
                        color="primary"
                        checked={setSpecificMembers}
                        onChange={handleChangeCheckbox}
                      />
                    }
                    label={<Typography color="primary">Grant access to specific team members</Typography>}
                  />
                  <Tooltip title={toolTipTitle} arrow>
                    <Box sx={styles.toolTipIcon}>
                      <Icon icon="info-circle" />
                    </Box>
                  </Tooltip>
                </FormGroup>
              </Box>
              {setSpecificMembers && (
                <Box ml={4}>
                  <TeamMembersPicker
                    teamMembers={teamMembers}
                    campaignSpecificTeamMembers={campaignSpecificTeamMembers}
                    setCampaignSpecificTeamMembers={handleSetCampaignSpecificTeamMembers}
                  />
                </Box>
              )}
            </>
          )}
        </Grid>
        <Grid item>
          <CampaignManager control={control} />
        </Grid>
        <Grid item>
          <Countries control={control} />
        </Grid>
      </Grid>
      <Box mt={3} mb={2}>
        <SectionTitle>Email Notifications</SectionTitle>
      </Box>
      <EmailNotificationsController control={control} />
      <Box mt={9} mb={20} maxWidth={400}>
        <CampaignInstructions control={control} />
      </Box>
      {typeof children === 'function' ? children({ isDirty }) : children}
    </form>
  );
};

export default DetailsForm;
