import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Features, SettingsItem } from '@alycecom/modules';
import { TTeamMember, useGetTeamMembersQuery } from '@alycecom/services';
import { Icon, Tooltip } from '@alycecom/ui';
import { Box, Button, Checkbox, FormControlLabel, FormGroup, Theme, Typography, Link, Select } from '@mui/material';
import { useSelector } from 'react-redux';

import TeamMembersPicker from '../TeamMembersPicker/TeamMembersPicker';
import { getCampaignTeamId } from '../../../store/campaign/commonData/commonData.selectors';

const styles = {
  container: {
    width: '500px',
  },
  formGroup: {
    marginBottom: ({ spacing }: Theme) => spacing(1.5),
  },
  toolTipLink: {
    display: 'inline',
    textDecoration: 'underline',
  },
  toolTipIcon: {
    color: ({ palette }: Theme) => palette.grey.superLight,
    marginTop: ({ spacing }: Theme) => spacing(1.5),
  },
  pickerContainer: {
    marginLeft: ({ spacing }: Theme) => spacing(4.5),
  },
  select: {
    '& .MuiSelect-select.Mui-disabled': {
      WebkitTextFillColor: ({ palette }: Theme) => palette.grey.main,
    },
  },
  saveButton: {
    width: '100px',
    height: '48px',
    fontSize: '16px',
    fontWeight: 'normal',
    marginTop: ({ spacing }: Theme) => spacing(2),
    color: ({ palette }: Theme) => palette.common.white,
    backgroundColor: ({ palette }: Theme) => palette.green.dark,
    '&:hover': {
      backgroundColor: ({ palette }: Theme) => palette.green.mountainMeadowLight,
    },
  },
} as const;

interface TeamSettingsProps {
  teamName: string;
  campaignSpecificTeamMemberIds: string[];
  isCampaignGeneralSettingsLoading: boolean;
  onSubmit: (teamMemberIds: string[]) => void;
}

const TeamSettings = ({
  teamName,
  campaignSpecificTeamMemberIds,
  isCampaignGeneralSettingsLoading,
  onSubmit,
}: TeamSettingsProps): JSX.Element => {
  const isBudgetManagementSetupEnabled = useSelector(
    Features.selectors.hasFeatureFlag(Features.FLAGS.BUDGET_MANAGEMENT_SETUP),
  );

  const campaignTeamId = useSelector(getCampaignTeamId);
  const [campaignSpecificTeamMembers, setCampaignSpecificTeamMembers] = useState([] as TTeamMember[]);
  const [preExistingCampaignSpecificTeamMembers, setPreExistingCampaignSpecificTeamMembers] = useState(
    [] as TTeamMember[],
  );
  const [setSpecificMembers, toggleSettingSpecificMembers] = useState(false);

  const { data, isSuccess: teamMembersQuerySucceeded } = useGetTeamMembersQuery({ teamId: campaignTeamId });

  const teamMembers = useMemo(() => Object.values(data?.entities || []) as TTeamMember[], [data]);
  const campaignSpecificTeamMemberNames = campaignSpecificTeamMembers
    .map((member: TTeamMember, index: number) => {
      const prefix = index === 0 ? ':' : '';
      return `${prefix} ${member.firstName} ${member.lastName}`;
    })
    .toString();

  const handleChangeCheckbox = useCallback(() => {
    if (setSpecificMembers) {
      setCampaignSpecificTeamMembers([]);
    }

    if (!setSpecificMembers) {
      setCampaignSpecificTeamMembers(preExistingCampaignSpecificTeamMembers);
    }

    toggleSettingSpecificMembers(!setSpecificMembers);
  }, [
    setSpecificMembers,
    preExistingCampaignSpecificTeamMembers,
    setCampaignSpecificTeamMembers,
    toggleSettingSpecificMembers,
  ]);

  const toolTipTitle = (
    <Box>
      Each team member has an individual budget assigned to them they can draw from. To manage your team member&apos;s
      budget go to{' '}
      <Link sx={styles.toolTipLink} href="/settings/teams/users-management/users">
        Users & Teams
      </Link>
    </Box>
  );

  // Only include the campaign specific members if FF is enabled
  const settingsItemValue = isBudgetManagementSetupEnabled ? `${teamName}${campaignSpecificTeamMemberNames}` : teamName;

  const handleSave = useCallback(() => {
    onSubmit(campaignSpecificTeamMembers.map(member => member.id as string));
  }, [onSubmit, campaignSpecificTeamMembers]);

  useEffect(() => {
    if (teamMembersQuerySucceeded && data && campaignSpecificTeamMemberIds) {
      const members = Object.values(data.entities) as TTeamMember[];

      const campaignSpecificMembers = members.filter(member =>
        campaignSpecificTeamMemberIds.includes(member.id as string),
      );

      setCampaignSpecificTeamMembers(campaignSpecificMembers);
      setPreExistingCampaignSpecificTeamMembers(campaignSpecificMembers);
      toggleSettingSpecificMembers(campaignSpecificMembers.length > 0);
    }
  }, [
    data,
    campaignSpecificTeamMemberIds,
    teamMembersQuerySucceeded,
    toggleSettingSpecificMembers,
    setPreExistingCampaignSpecificTeamMembers,
  ]);

  return (
    <SettingsItem
      title="Assigned team"
      description="This campaign is tied to"
      collapsible={isBudgetManagementSetupEnabled}
      isLoading={isCampaignGeneralSettingsLoading}
      value={settingsItemValue}
    >
      <Box sx={styles.container}>
        {isBudgetManagementSetupEnabled && (
          <>
            <FormGroup row sx={styles.formGroup}>
              <Select
                value={teamName}
                fullWidth
                disabled
                sx={styles.select}
                renderValue={value => <Typography>{value}</Typography>}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    value="enabled"
                    color="primary"
                    checked={setSpecificMembers}
                    onChange={handleChangeCheckbox}
                    data-testid="SpecificTeamMembers.Checkbox"
                  />
                }
                label={<Typography color="primary">Grant access to specific team members</Typography>}
              />
              <Tooltip title={toolTipTitle} arrow placement="top-start">
                <>
                  <Icon icon="info-circle" sx={styles.toolTipIcon} />
                </>
              </Tooltip>
            </FormGroup>
            {setSpecificMembers && (
              <Box sx={styles.pickerContainer}>
                <TeamMembersPicker
                  teamMembers={teamMembers}
                  campaignSpecificTeamMembers={campaignSpecificTeamMembers}
                  setCampaignSpecificTeamMembers={setCampaignSpecificTeamMembers}
                />
              </Box>
            )}
            <Button type="submit" variant="contained" sx={styles.saveButton} onClick={handleSave}>
              Save
            </Button>
          </>
        )}
      </Box>
    </SettingsItem>
  );
};

export default memo(TeamSettings);
