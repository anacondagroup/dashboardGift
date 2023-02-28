import React, { ReactElement, useCallback, memo, useState } from 'react';
import {
  Box,
  Grid,
  MenuItem,
  Paper,
  TextField,
  Button,
  FormHelperText,
  FormControl,
  Typography,
  Checkbox,
  FormGroup,
  FormControlLabel,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Link } from 'react-router-dom';
import { SettingsItem, CountriesPicker, TCountry, Features } from '@alycecom/modules';
import { ActionButton, BreadcrumbItem, Icon, SelectFilter, Tooltip } from '@alycecom/ui';
import { TErrors, TTeamMember } from '@alycecom/services';
import { useSelector } from 'react-redux';

import DashboardLayout from '../../../../../components/Dashboard/Shared/DashboardLayout';
import sparklesIcon from '../../../../../assets/images/flourishes.png';
import TeamMembersPicker from '../TeamMembersPicker/TeamMembersPicker';

const useStyles = makeStyles(({ palette, spacing }) => ({
  icon: {
    width: 32,
    height: 32,
    margin: spacing(-1, 1, 0, 0),
  },
  cancelButton: {
    color: palette.error.main,
    border: `1px solid ${palette.error.main}`,
    '&:hover': {
      color: palette.error.main,
      border: `1px solid ${palette.error.main}`,
      backgroundColor: palette.common.white,
    },
    width: 100,
    height: 48,
  },
  countryValueLabel: {
    color: palette.text.primary,
  },
  popper: {
    minWidth: 500,
    maxWidth: 700,
  },
  formGroup: {
    marginBottom: spacing(1.5),
  },
  toolTipIcon: {
    color: palette.grey.superLight,
    marginTop: spacing(1.5),
  },
  underlineLink: {
    textDecoration: 'underline',
  },
}));

interface ITeam {
  id: number;
  name: string;
}

interface ITeamMember {
  id: number;
  name: string;
}

export interface ICreateCampaignProps {
  campaignName: string;
  setCampaignName: (value: string) => void;
  teamList: ITeam[];
  team: number;
  teamName: string;
  setTeam: (value: Record<string, number>) => void;
  teamAdmins: ITeamMember[];
  teamMembers: TTeamMember[];
  campaignSpecificTeamMembers: TTeamMember[];
  setCampaignSpecificTeamMembers: (teamMembers: TTeamMember[]) => void;
  teamOwner: number;
  setTeamOwner: (value: Record<string, number>) => void;
  teamOwnerName: string;
  isLoading: boolean;
  onCreate: () => void;
  parentUrl: string;
  errors: TErrors;
  selectedCountries: TCountry[];
  setSelectedCountries: (countries: TCountry[]) => void;
  countries: TCountry[];
  purpose: string;
  purposesOptions: string[];
  onChangePurpose: (value: string) => void;
  numberOfRecipients: string;
  numberOfRecipientsOptions: string[];
  onChangeNumberOfRecipients: (value: string) => void;
}

const CreateCampaign = ({
  campaignName,
  setCampaignName,
  teamList,
  team,
  teamName,
  setTeam,
  teamMembers,
  teamAdmins,
  campaignSpecificTeamMembers,
  setCampaignSpecificTeamMembers,
  teamOwner,
  setTeamOwner,
  teamOwnerName,
  isLoading,
  onCreate,
  parentUrl,
  errors,
  selectedCountries,
  setSelectedCountries,
  countries,
  purpose,
  purposesOptions,
  onChangePurpose,
  numberOfRecipients,
  numberOfRecipientsOptions,
  onChangeNumberOfRecipients,
}: ICreateCampaignProps): ReactElement => {
  const classes = useStyles();

  const handleChangeCountry = useCallback((selected: TCountry[]) => setSelectedCountries(selected), [
    setSelectedCountries,
  ]);

  const isCreateButtonDisabled =
    !campaignName || !purpose || !numberOfRecipients || selectedCountries.length === 0 || isLoading;

  const hasBudgetManagementSetup = useSelector(
    Features.selectors.hasFeatureFlag(Features.FLAGS.BUDGET_MANAGEMENT_SETUP),
  );

  const [setSpecificMembers, toggleSettingSpecificMembers] = useState(false);

  const handleChangeCheckbox = useCallback(() => {
    if (setSpecificMembers) {
      setCampaignSpecificTeamMembers([]);
    }
    toggleSettingSpecificMembers(!setSpecificMembers);
  }, [setCampaignSpecificTeamMembers, setSpecificMembers]);

  const toolTipTitle = (
    <Box>
      Each team member has an individual budget assigned to them they can draw from. To manage your team member&apos;s
      budget go to{' '}
      <Link className={classes.underlineLink} to="/settings/teams/users-management/users">
        Users & Teams
      </Link>
    </Box>
  );

  return (
    <DashboardLayout>
      <Box mb={2}>
        <Typography className="H3-Dark">Create new campaign</Typography>
        <BreadcrumbItem to="/settings/campaigns">All campaigns</BreadcrumbItem>
        <BreadcrumbItem>Create campaign</BreadcrumbItem>
      </Box>
      <Paper elevation={0}>
        <Box p={3}>
          <SettingsItem
            title="Campaign name"
            description="This campaign name is set to"
            isLoading={false}
            collapsible={false}
            value={campaignName}
          >
            <Box mt={2} mb={1} width={500}>
              <TextField
                id="campaign-name"
                variant="outlined"
                fullWidth
                required
                label="What is campaign name?"
                error={!!errors.name}
                helperText={errors.name}
                value={campaignName}
                onChange={e => setCampaignName(e.target.value)}
                placeholder="Campaign name"
              />
            </Box>
          </SettingsItem>

          <SettingsItem
            title="Assigned team"
            description="This campaign is tied to"
            isLoading={false}
            collapsible={false}
            value={teamName}
          >
            <Box width={500}>
              <SelectFilter
                fullWidth
                margin="normal"
                onFilterChange={setTeam}
                label="Who should be the assigned team?"
                value={team}
                name="teamId"
              >
                {teamList.map(teamItem => (
                  <MenuItem key={teamItem.id} value={teamItem.id}>
                    {teamItem.name}
                  </MenuItem>
                ))}
              </SelectFilter>
              {hasBudgetManagementSetup && (
                <>
                  <FormGroup row className={classes.formGroup}>
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
                    <Tooltip title={toolTipTitle} arrow>
                      <Icon icon="info-circle" className={classes.toolTipIcon} />
                    </Tooltip>
                  </FormGroup>
                  {setSpecificMembers && (
                    <TeamMembersPicker
                      teamMembers={teamMembers}
                      campaignSpecificTeamMembers={campaignSpecificTeamMembers}
                      setCampaignSpecificTeamMembers={setCampaignSpecificTeamMembers}
                    />
                  )}
                </>
              )}
            </Box>
          </SettingsItem>

          <SettingsItem
            title="Campaign owner"
            description="This campaign owner is set to"
            isLoading={false}
            collapsible={false}
            value={teamOwnerName}
          >
            <Box width={500}>
              <SelectFilter
                error={!!errors.owner_id}
                helperText={errors.owner_id ? errors.owner_id[0] : ''}
                fullWidth
                disabled={!team}
                margin="normal"
                onFilterChange={setTeamOwner}
                label="Who should be the campaign owner?"
                value={teamOwner}
                name="teamOwnerId"
              >
                {teamAdmins.map(admin => (
                  <MenuItem key={admin.id} value={admin.id}>
                    {admin.name}
                  </MenuItem>
                ))}
              </SelectFilter>
            </Box>
          </SettingsItem>
          <SettingsItem
            title="Campaign country"
            description="This campaign is set for recipients living in the following countries"
            isLoading={false}
            collapsible={false}
          >
            <Box width={500}>
              <FormControl error={Boolean(errors.countryIds)} variant="outlined" fullWidth>
                <CountriesPicker<true>
                  label="What should be the campaign country?"
                  searchLabel="Search countries"
                  name="countryId"
                  value={selectedCountries}
                  onChange={handleChangeCountry}
                  options={countries}
                  multiple
                  selectAllEnabled
                  classes={{
                    valueLabel: classes.countryValueLabel,
                    popper: classes.popper,
                  }}
                  showChips
                  buttonIconProps={{ fontSize: 0.8 }}
                  listboxProps={{ maxVisibleRows: 4 }}
                />
                {errors.countryIds && <FormHelperText>{errors.countryIds.join(' ')}</FormHelperText>}
              </FormControl>
            </Box>
          </SettingsItem>
          <SettingsItem
            title="Campaign purpose"
            isLoading={false}
            collapsible={false}
            icon={<img src={sparklesIcon} className={classes.icon} alt="Campaign purpose" />}
            hint="Let us know the purpose and audience of this campaign and Alyce will crunch some wonderful numbers for you!"
          >
            <Box width={500}>
              <SelectFilter
                name="purpose"
                label="Campaign purpose *"
                value={purpose}
                onFilterChange={({ purpose: value }) => onChangePurpose(value)}
                renderItems={() =>
                  purposesOptions.map(option => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))
                }
                error={Boolean(errors.campaignPurpose)}
                helperText={errors.campaignPurpose?.join(' ')}
                fullWidth
                margin="normal"
              />
            </Box>
            <Box width={500}>
              <SelectFilter
                name="numberOfRecipients"
                label="Estimated total recipients *"
                value={numberOfRecipients}
                onFilterChange={({ numberOfRecipients: value }) => onChangeNumberOfRecipients(value)}
                renderItems={() =>
                  numberOfRecipientsOptions.map(option => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))
                }
                error={Boolean(errors.numberOfRecipients)}
                helperText={errors.numberOfRecipients?.join(' ')}
                fullWidth
                margin="normal"
              />
            </Box>
          </SettingsItem>
          <Grid container justifyContent="space-between">
            <Grid item>
              <ActionButton
                disabled={isCreateButtonDisabled}
                width={200}
                onClick={onCreate}
                data-testid="CampaignSettings.CreateCampaign.Button"
              >
                {isLoading && <Icon spin icon="spinner" color="white" />}
                <Box pl={1}>Create campaign</Box>
              </ActionButton>
            </Grid>
            <Grid item>
              <Button className={classes.cancelButton} variant="outlined" component={Link} to={parentUrl}>
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </DashboardLayout>
  );
};

export default memo(CreateCampaign);
