import React, { useMemo } from 'react';
import { Autocomplete, Box, FormControl, FormControlProps, FormHelperText, TextField, Typography } from '@mui/material';
import { Control, useController } from 'react-hook-form';
import { billingGroupAdapter, GroupsTeamsIdentifier, useGetBillingGroupsQuery } from '@alycecom/services';
import { useSelector } from 'react-redux';
import { EntityId } from '@alycecom/utils';
import { Icon, Tooltip } from '@alycecom/ui';
import { toLower } from 'ramda';

import { TeamField, TTeamFormParams } from '../../../../../store/teams/team/team.types';
import { NEW_BILLING_GROUP_ID, NEW_BILLING_GROUP_NAME } from '../../../../../store/teams/team/team.constants';

import { styles } from './BillingGroup.styles';

type TBillingGroupProps = FormControlProps & {
  control: Control<TTeamFormParams>;
  canCreateNewGroup?: boolean;
};

const BILLING_GROUPS_PER_PAGE = 1000;

const BillingGroup = ({ control, canCreateNewGroup = true }: TBillingGroupProps): JSX.Element => {
  const { data, isFetching } = useGetBillingGroupsQuery({ currentPage: 1, perPage: BILLING_GROUPS_PER_PAGE });

  const { selectEntities, selectIds } = billingGroupAdapter.getSelectors(
    () => data ?? billingGroupAdapter.getInitialState(),
  );
  const groupsMap = useSelector(selectEntities);
  const groupIds = useSelector(selectIds);

  const ids = useMemo(() => {
    const filteredGroupIds = groupIds.filter(groupId => toLower(groupId as string) !== GroupsTeamsIdentifier.Ungrouped);
    if (canCreateNewGroup) {
      filteredGroupIds.push(NEW_BILLING_GROUP_ID);
    }
    return filteredGroupIds;
  }, [groupIds, canCreateNewGroup]);

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

  const getOptionLabel = (option: EntityId) => groupsMap[option]?.groupName || NEW_BILLING_GROUP_NAME;

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
            options={ids}
            getOptionLabel={getOptionLabel}
            renderOption={(props, option) => (
              <Box
                {...props}
                component="li"
                sx={styles.option}
                data-testid={`TeamInfoForm.Option.${getOptionLabel(option)}`}
              >
                <Box sx={styles.optionContent}>
                  {option === NEW_BILLING_GROUP_ID && <Icon icon="plus" sx={styles.plusIcon} />}
                  {getOptionLabel(option)}
                </Box>
              </Box>
            )}
            disabled={isFetching}
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
