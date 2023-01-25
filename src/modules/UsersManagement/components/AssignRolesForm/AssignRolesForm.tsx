import React, { memo, useCallback, useEffect } from 'react';
import { Box, Button, FormControl, FormHelperText, MenuItem, TextField, Typography, Autocomplete } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { ActionButton, AlyceTheme, Icon, SelectFilter } from '@alycecom/ui';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useExternalErrors } from '@alycecom/hooks';

import { UsersSidebarStep } from '../../store/usersOperation/usersOperation.types';
import StepSection from '../StepSection/StepSection';
import { userAssignFormDefaultValues, userAssignFormResolver } from '../../store/usersCreate/usersCreate.schemas';
import { USER_ROLES_LIST } from '../../store/usersOperation/usersOperations.constants';
import StepSectionFooter from '../StepSectionFooter/StepSectionFooter';
import { setUsersSidebarStep } from '../../store/usersOperation/usersOperation.actions';
import { getTeams } from '../../store/entities/teams';
import { getErrors, getIsCreatePending, getRole, getUserTeams } from '../../store/usersCreate/usersCreate.selectors';
import { IUserAssignParams } from '../../store/usersCreate/usersCreate.types';
import { ITeam } from '../../store/usersManagement.types';
import { createUserRequest, setAssignRolesData } from '../../store/usersCreate/usersCreate.actions';
import UsersInfoList from '../UsersInfoList/UsersInfoList';
import { getUserDraftsCount } from '../../store/entities/userDrafts';
import { getIsBulkFlow } from '../../store/usersOperation/usersOperation.selectors';
import { prepareLabelForTeam } from '../../helpers/teamLabels.helpers';

const useStyles = makeStyles<AlyceTheme>(({ palette }) => ({
  backButton: {
    width: 130,
    height: 48,
    color: palette.link.main,
  },
}));

const AssignRolesForm = (): JSX.Element => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const isLoading = useSelector(getIsCreatePending);
  const externalErrors = useSelector(getErrors);
  const teams = useSelector(getTeams);
  const userTeams = useSelector(getUserTeams);
  const role = useSelector(getRole);
  const userDraftsCount = useSelector(getUserDraftsCount);
  const isBulkFlow = useSelector(getIsBulkFlow);

  const activeTeams = teams.filter(team => team.archivedAt === null);
  const stepsCount = isBulkFlow ? 4 : 2;

  const methods = useForm<IUserAssignParams>({
    mode: 'all',
    defaultValues: userAssignFormDefaultValues,
    resolver: userAssignFormResolver,
  });

  const {
    handleSubmit,
    formState: { errors },
    setError,
    control,
    getValues,
    reset,
  } = methods;

  const checkOptionIsSelected = useCallback((option: ITeam, value: ITeam): boolean => option.id === value.id, []);

  const handleCreateUser = useCallback(
    ({ role: roleItem, teams: teamItems }: IUserAssignParams) => {
      if (userDraftsCount > 0) {
        dispatch(
          createUserRequest({
            role: roleItem,
            teamIds: teamItems.map(team => team.id),
          }),
        );
      }
    },
    [userDraftsCount, dispatch],
  );

  const handleBack = useCallback(() => {
    const { teams: selectedTeams, role: selectedRole } = getValues();
    dispatch(setUsersSidebarStep(isBulkFlow ? UsersSidebarStep.importedUsersInfo : UsersSidebarStep.userInfo));
    dispatch(setAssignRolesData({ teams: selectedTeams, role: selectedRole }));
  }, [dispatch, getValues, isBulkFlow]);

  useExternalErrors<IUserAssignParams>(setError, externalErrors);

  useEffect(() => {
    reset({
      teams: userTeams,
      role,
    });
  }, [reset, role, userTeams]);

  return (
    <StepSection step={UsersSidebarStep.assignRoles}>
      <form onSubmit={handleSubmit(handleCreateUser)}>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          minHeight="calc(100vh - 222px)"
          mb={5}
        >
          <Box mb={3}>
            <UsersInfoList mb={3} />
            <Box width={400}>
              <Controller
                control={control}
                name="role"
                render={({ field: { onChange, value } }) => (
                  <FormControl error={!!errors.teams} variant="outlined" fullWidth>
                    <SelectFilter
                      label="Access level"
                      name="role"
                      fullWidth
                      value={value}
                      disabled={isLoading}
                      onFilterChange={({ role: roleOption }) => onChange(roleOption)}
                    >
                      {USER_ROLES_LIST.map(({ id, name }) => (
                        <MenuItem key={id} value={id}>
                          {name}
                        </MenuItem>
                      ))}
                    </SelectFilter>
                    {!!errors.role && <FormHelperText>{errors.role.message}</FormHelperText>}
                  </FormControl>
                )}
              />
              <Box mt={2}>
                <Controller
                  control={control}
                  name="teams"
                  render={({ field: { onChange, value } }) => (
                    <FormControl error={!!errors.teams} variant="outlined" fullWidth>
                      <Autocomplete
                        id="multiple-teams"
                        multiple
                        limitTags={3}
                        disableClearable
                        disableCloseOnSelect
                        options={activeTeams}
                        value={value}
                        getOptionDisabled={option => !option.isAdmin}
                        getOptionLabel={option => option.name}
                        isOptionEqualToValue={checkOptionIsSelected}
                        renderOption={(props, option) => (
                          <Typography {...props} data-testid={`UserAssignToTeamModal.Autocomplete.${option.id}`}>
                            {prepareLabelForTeam(option)}
                          </Typography>
                        )}
                        onChange={(_, teamsValue) => onChange(teamsValue)}
                        renderInput={params => (
                          <TextField {...params} variant="outlined" label="Teams" placeholder="Select teams" />
                        )}
                        noOptionsText="No teams"
                        disabled={isLoading}
                      />
                      {!!errors.teams && <FormHelperText>This field is required</FormHelperText>}
                    </FormControl>
                  )}
                />
              </Box>
            </Box>
          </Box>
          <StepSectionFooter
            stepNumber={stepsCount}
            stepsCount={stepsCount}
            backButton={
              <Button
                className={classes.backButton}
                variant="outlined"
                startIcon={<Icon icon="chevron-left" />}
                onClick={handleBack}
              >
                Back
              </Button>
            }
            nextButton={
              <ActionButton width={140} type="submit" disabled={isLoading}>
                Send invite(s)
              </ActionButton>
            }
          />
        </Box>
      </form>
    </StepSection>
  );
};

export default memo(AssignRolesForm);
