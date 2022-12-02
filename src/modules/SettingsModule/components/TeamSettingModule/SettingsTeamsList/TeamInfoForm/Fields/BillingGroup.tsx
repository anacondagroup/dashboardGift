import React from 'react';
import { Autocomplete, Box, FormControlProps, FormControl, FormHelperText, TextField, Typography } from '@mui/material';
import { Control, useController } from 'react-hook-form';
import { useGetBillingGroupsQuery, billingGroupAdapter } from '@alycecom/services';
import { useSelector } from 'react-redux';
import { EntityId } from '@alycecom/utils';
import { Icon, Tooltip } from '@alycecom/ui';

import { TeamField, TTeamFormParams } from '../../../../../store/teams/team/team.types';
import { GroupsTeamsConstants } from '../../../../../../BillingModule/constants/groupsTeams.constants';

const styles = {
  root: {
    mt: 2,
  },
  autocomplete: {
    mt: 2,
  },
  formControl: {
    width: 350,
  },
  wrapper: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  label: {
    fontSize: 16,
    color: 'primary.main',
  },
  icon: {
    ml: 1,
    mt: 4,
    color: 'primary.superLight',
  },
  tooltip: {
    width: 180,
  },
} as const;

type TBillingGroupProps = FormControlProps & {
  control: Control<TTeamFormParams>;
};

const BILLING_GROUPS_PER_PAGE = 1000;

const BillingGroup = ({ control }: TBillingGroupProps): JSX.Element => {
  const { groupsIds, isLoading, selectEntities } = useGetBillingGroupsQuery(
    { currentPage: 1, perPage: BILLING_GROUPS_PER_PAGE },
    {
      selectFromResult: result => ({
        ...result,
        ...billingGroupAdapter.getSelectors(() => result?.data ?? billingGroupAdapter.getInitialState()),
        groupsIds: result.data?.ids.filter(groupId => groupId !== GroupsTeamsConstants.Ungrouped) ?? [],
      }),
    },
  );

  const groupsMap = useSelector(selectEntities);

  const {
    fieldState: { error },
    field: { value, onChange },
  } = useController({
    control,
    name: TeamField.GroupId,
  });

  const handleSelectGroup = (event: unknown, newGroupId: EntityId | null) => {
    onChange(newGroupId);
  };

  const getOptionLabel = (option: EntityId) => groupsMap[option]?.groupName || '';

  return (
    <Box sx={styles.root}>
      <Typography sx={styles.label}>Source of gift spend for this team</Typography>
      <Box sx={styles.wrapper}>
        <FormControl sx={styles.formControl} error={!!error} variant="outlined" fullWidth>
          <Autocomplete<EntityId, false, true>
            sx={styles.autocomplete}
            value={value}
            fullWidth
            onChange={handleSelectGroup}
            renderInput={props => <TextField {...props} variant="outlined" label="Billing group *" />}
            options={groupsIds}
            getOptionLabel={getOptionLabel}
            renderOption={(props, option) => (
              <li {...props}>
                <Box
                  whiteSpace="nowrap"
                  textOverflow="ellipsis"
                  overflow="hidden"
                  data-testId={`TeamInfoForm.Option.${getOptionLabel(option)}`}
                >
                  {getOptionLabel(option)}
                </Box>
              </li>
            )}
            loading={isLoading}
            data-testid="TeamInfoForm.BillingGroupSelector"
          />
          {error?.message && <FormHelperText>{error?.message}</FormHelperText>}
        </FormControl>
        <Tooltip
          placement="right-start"
          sx={styles.tooltip}
          title="A team can only be assigned to one Billing Group. This Billing Group will be used for gift deposit and gift spends."
        >
          <Icon icon="info-circle" sx={styles.icon} />
        </Tooltip>
      </Box>
    </Box>
  );
};

export default BillingGroup;
