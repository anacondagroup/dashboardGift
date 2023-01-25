import React, { memo, useMemo, useCallback, useEffect } from 'react';
import { Box, Chip, Typography, TextField, FormControl, FormHelperText } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { ModalConfirmationMessage, AlyceTheme, IModalConfirmationMessageProps } from '@alycecom/ui';
import Autocomplete from '@mui/material/Autocomplete';
import { useDispatch, useSelector } from 'react-redux';
import { uniqBy } from 'ramda';
import { Controller, FieldError, useController, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { User } from '@alycecom/modules';

import { IUserTeam, IUser, ITeam } from '../../store/usersManagement.types';
import { getTeams } from '../../store/entities/teams';
import { getIsOperationPending } from '../../store/usersOperation/usersOperation.selectors';
import { getCurrentActionUsers } from '../../store/usersManagement.selectors';
import { assignUsersToTeamsRequest } from '../../store/usersOperation/usersOperation.actions';
import { userAssignTeamsValidation } from '../../store/usersOperation/usersOperation.schemas';
import { IUserAssignTeamsParams } from '../../store/usersOperation/usersOperation.types';
import { getIsAllSelected, getPagination } from '../../store/users/users.selectors';
import { prepareLabelForTeam } from '../../helpers/teamLabels.helpers';

const useStyles = makeStyles<AlyceTheme>(({ palette, spacing }) => ({
  avatar: {
    backgroundColor: palette.green.dark,
  },
  root: {
    width: 500,
    borderTop: `4px solid ${palette.green.dark}`,
  },
  submitButton: {
    backgroundColor: palette.green.dark,
    paddingLeft: spacing(1),
    paddingRight: spacing(1),
    marginLeft: '0px !important',
    width: 110,
    border: 'none',
    marginBottom: 0,
    '&:hover': {
      backgroundColor: palette.green.dark,
    },
    whiteSpace: 'nowrap',
    '&>span>span': {
      lineHeight: '1.3 !important',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
  },
  cancelButton: {
    paddingLeft: spacing(2),
    paddingRight: spacing(2),
    minWidth: 110,
    marginRight: spacing(2),
    maxWidth: 220,
    whiteSpace: 'nowrap',
    '&>span>span': {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  ul: {
    paddingLeft: spacing(3),
    '& > li': {
      paddingBottom: spacing(1),
    },
  },
}));

export interface IUserAssignModalProps extends Pick<IModalConfirmationMessageProps, 'onDiscard' | 'DialogProps'> {
  isOpen: boolean;
}

const UserAssignToTeamModal = ({ isOpen, ...ModalProps }: IUserAssignModalProps): JSX.Element => {
  const dispatch = useDispatch();
  const classes = useStyles({ isMobile: false });

  const teams = useSelector(getTeams);
  const users = useSelector(getCurrentActionUsers);
  const isLoading = useSelector(getIsOperationPending);
  const isAllSelected = useSelector(getIsAllSelected);
  const { total } = useSelector(getPagination);

  const currentUser = useSelector(User.selectors.getUser);

  const activeTeams = teams.filter(team => team.archivedAt === null);
  const affectedUsersCount = isAllSelected ? total : users.length;

  const {
    handleSubmit,
    control,
    reset,
    formState: { isValid, errors },
  } = useForm<IUserAssignTeamsParams>({
    mode: 'all',
    defaultValues: {
      teams: [],
    },
    resolver: yupResolver(userAssignTeamsValidation),
    context: { users },
  });

  const checkOptionIsSelected = useCallback((option: ITeam, value: ITeam): boolean => option.id === value.id, []);

  const handleAssignTeams = useCallback(
    ({ teams: newTeams }: IUserAssignTeamsParams) => {
      const teamIds = newTeams.map(team => team.id);
      dispatch(assignUsersToTeamsRequest(teamIds));
    },
    [dispatch],
  );

  const userTeams = useMemo(() => {
    const usersTeams = users.reduce((acc: IUserTeam[], user: IUser) => [...acc, ...user.teams], []);
    return uniqBy(item => item.id, usersTeams);
  }, [users]);

  const {
    field: { value, onChange },
  } = useController({
    control,
    name: 'teams',
  });

  const isMessageVisible = useMemo(() => {
    const selectedTeamsIds = value.map(team => team.id);
    const userTeamsIds = userTeams.map(team => team.id);

    return !userTeamsIds.every(id => selectedTeamsIds.includes(id));
  }, [userTeams, value]);

  useEffect(() => {
    if (isOpen && !isLoading) {
      reset({ teams: userTeams });
    }
    if (!isOpen) {
      reset({ teams: [] });
    }
  }, [reset, userTeams, isOpen, isLoading]);

  return (
    <ModalConfirmationMessage
      isOpen={isOpen}
      title={`Assign ${affectedUsersCount} ${affectedUsersCount === 1 ? 'user' : 'users'} to team(s)`}
      width="100%"
      icon="pencil"
      customClasses={classes}
      submitButtonText="Save"
      cancelButtonText="Cancel"
      submitButtonsProps={{ disabled: !isValid || isLoading }}
      discardButtonsProps={{ disabled: isLoading }}
      onSubmit={handleSubmit(handleAssignTeams)}
      {...ModalProps}
    >
      <Typography className="Body-Regular-Left-Static">
        Choose which team(s) {users.length === 1 ? users[0].email : 'the users'} should be part of
      </Typography>
      <Box mt={4} mb={3}>
        <Controller
          control={control}
          name="teams"
          render={() => (
            <FormControl error={Boolean(errors.teams)} variant="outlined" fullWidth>
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
                onChange={(_, newValue) => onChange(newValue)}
                renderInput={params => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Teams"
                    placeholder="Teams"
                    data-testid="UsersManagement.AssignToTeam.TeamsSelect"
                  />
                )}
                noOptionsText="No teams"
                disabled={isLoading}
              />
              {!!errors.teams && <FormHelperText>{((errors.teams as unknown) as FieldError).message}</FormHelperText>}
            </FormControl>
          )}
        />
      </Box>
      {isMessageVisible && (
        <ul className={classes.ul}>
          <li>
            Created and not sent gifts will be re associated with {currentUser.firstName} {currentUser.lastName}
          </li>
          <li>Sent gifts will be associated with the original gifter</li>
          <li>Recipients will be able to claim pending gifts sent by the original gifter</li>
        </ul>
      )}
    </ModalConfirmationMessage>
  );
};

export default memo(UserAssignToTeamModal);
