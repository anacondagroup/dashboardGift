import React, { memo, useCallback, useEffect } from 'react';
import { Box, Button, MenuItem, TextField, FormControl, FormHelperText, Typography, Chip } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { ActionButton, AlyceTheme, SelectFilter } from '@alycecom/ui';
import { useForm, Controller, FieldError } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { useExternalErrors } from '@alycecom/hooks';
import Autocomplete from '@mui/material/Autocomplete';

import { UsersSidebarStep } from '../../store/usersOperation/usersOperation.types';
import StepSection from '../StepSection/StepSection';
import { USER_ROLES_LIST } from '../../store/usersOperation/usersOperations.constants';
import { getTeams } from '../../store/entities/teams';
import { IUserAssignParams } from '../../store/usersCreate/usersCreate.types';
import { ITeam, UserRoles } from '../../store/usersManagement.types';
import {
  setSingleSelectedUser,
  setUsersSidebarStep,
  updateUsersRequest,
} from '../../store/usersOperation/usersOperation.actions';
import {
  getIsOperationPending,
  getSingleSelectedUser,
  getErrors,
  getIsCurrentUserSelected,
} from '../../store/usersOperation/usersOperation.selectors';
import UserInfo from '../UserInfo/UserInfo';
import { editUserValidation } from '../../store/usersOperation/usersOperation.schemas';
import { prepareLabelForTeam } from '../../helpers/teamLabels.helpers';

const useStyles = makeStyles<AlyceTheme>(({ palette, spacing }) => ({
  cancelButton: {
    width: 130,
    height: 48,
    color: palette.link.main,
    marginRight: spacing(1),
    '&:hover': {
      border: `1px solid ${palette.divider}`,
    },
  },
}));

const EditUserForm = (): JSX.Element => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const isLoading = useSelector(getIsOperationPending);
  const externalErrors = useSelector(getErrors);
  const teams = useSelector(getTeams);
  const activeTeams = teams.filter(team => team.archivedAt === null);
  const selectedUser = useSelector(getSingleSelectedUser);
  const isItCurrentUser = useSelector(getIsCurrentUserSelected);

  const {
    handleSubmit,
    setError,
    control,
    reset,
    formState: { isValid, errors },
  } = useForm<IUserAssignParams>({
    mode: 'all',
    defaultValues: {
      role: UserRoles.member,
      teams: [],
    },
    resolver: yupResolver(editUserValidation),
    context: { user: selectedUser },
  });

  const checkOptionIsSelected = useCallback((option: ITeam, value: ITeam): boolean => option.id === value.id, []);

  const handleUpdateUser = useCallback(
    ({ role: roleItem, teams: teamItems }: IUserAssignParams) => {
      dispatch(
        updateUsersRequest({
          role: roleItem,
          teamIds: teamItems.map(team => team.id),
        }),
      );
    },
    [dispatch],
  );

  const handleClose = useCallback(() => {
    dispatch(setSingleSelectedUser(null));
    dispatch(setUsersSidebarStep(null));
  }, [dispatch]);

  useExternalErrors<IUserAssignParams>(setError, externalErrors);

  useEffect(() => {
    reset({
      teams: selectedUser?.teams || [],
      role: selectedUser && selectedUser.teams.length > 0 ? selectedUser.teams[0].access : UserRoles.member,
    });
  }, [reset, selectedUser]);

  return (
    <StepSection step={UsersSidebarStep.assignRoles}>
      <form onSubmit={handleSubmit(handleUpdateUser)}>
        <Box display="flex" flexDirection="column" justifyContent="space-between" height="calc(100vh - 222px)">
          <Box>
            {selectedUser && <UserInfo user={selectedUser} mt={1} mb={5} />}
            <Box width={400}>
              <Controller
                control={control}
                name="role"
                render={({ field: { onChange, value } }) => (
                  <FormControl error={!!errors.role} variant="outlined" fullWidth>
                    <SelectFilter
                      label="Access level"
                      name="role"
                      fullWidth
                      value={value}
                      disabled={isLoading || isItCurrentUser}
                      onFilterChange={({ role: roleOption }) => onChange(roleOption)}
                      dataTestId="UsersManagement.Edit.RoleSelect"
                    >
                      {USER_ROLES_LIST.map(({ id, name }) => (
                        <MenuItem key={id} value={id} data-testid={`UsersManagement.Edit.RoleSelect.${id}`}>
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
                        renderTags={(tagValue, getTagProps) =>
                          tagValue.map((option, index) => (
                            <Chip label={option.name} {...getTagProps({ index })} disabled={option?.belongsToTeam} />
                          ))
                        }
                        renderOption={(props, option) => (
                          <li {...props}>
                            <Typography data-testid={`UserAssignToTeamModal.Autocomplete.${option.id}`}>
                              {prepareLabelForTeam(option)}
                            </Typography>
                          </li>
                        )}
                        onChange={(_, teamsValue) => onChange(teamsValue)}
                        renderInput={params => (
                          <TextField
                            {...params}
                            variant="outlined"
                            label="Teams"
                            placeholder="Select teams"
                            data-testid="UsersManagement.Edit.TeamsSelect"
                          />
                        )}
                        noOptionsText="No teams"
                        disabled={isLoading}
                      />
                      {!!errors.teams && (
                        <FormHelperText>{((errors.teams as unknown) as FieldError).message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Box>
            </Box>
          </Box>
          <Box width={1} display="flex" alignItems="center" justifyContent="flex-end">
            <Button className={classes.cancelButton} variant="outlined" onClick={handleClose}>
              Cancel
            </Button>
            <ActionButton
              width={140}
              type="submit"
              disabled={isLoading || !isValid}
              data-testid="UsersManagement.Edit.Save"
            >
              Save
            </ActionButton>
          </Box>
        </Box>
      </form>
    </StepSection>
  );
};

export default memo(EditUserForm);
