import React, { memo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, CardContent, TextField } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { setNewPasswordRequest } from '../../store/confirmation.actions';
import { getIsSetPasswordInProgress } from '../../store/confirmation.selectors';

const useStyles = makeStyles(({ spacing }) => ({
  card: {
    margin: spacing(7.5),
  },
  cardContent: {
    width: 477,
    padding: spacing(4),
    paddingBottom: 0,
  },
  button: {
    margin: spacing(2, 0),
  },
}));

const PASSWORD_PATTERN = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*[$&+,:;=?@#|'<>.^*()%!-]).{8,255}$/gm;

const schema = yup.object().shape({
  password: yup
    .string()
    .required('Required')
    .min(8, 'Must contain at least 8 characters')
    .max(255, "Can't contain more than 255 characters")
    .matches(PASSWORD_PATTERN, 'Must contain letters in both cases, a special symbol and a number'),
  passwordConfirmation: yup.string().oneOf([yup.ref('password')], 'Passwords must match'),
});

export interface INewPasswordForm {
  token: string;
}

const NewPasswordForm = ({ token }: INewPasswordForm): JSX.Element => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    reValidateMode: 'onSubmit',
  });
  const passwordField = register('password');
  const passwordConfirmationField = register('passwordConfirmation');

  const isInProgress = useSelector(getIsSetPasswordInProgress);

  const onSubmit = useCallback(
    data => {
      dispatch(setNewPasswordRequest({ ...data, token }));
    },
    [token, dispatch],
  );

  return (
    <Card className={classes.card}>
      <CardContent className={classes.cardContent}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            inputRef={passwordField.ref}
            {...passwordField}
            error={!!errors.password}
            helperText={errors.password?.message}
            name="password"
            type="password"
            label="New password"
            variant="outlined"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            inputProps={{ 'data-testid': 'AuthConfirmation.NewPassword' }}
          />
          <TextField
            inputRef={passwordConfirmationField.ref}
            {...passwordConfirmationField}
            error={!!errors.passwordConfirmation}
            helperText={errors.passwordConfirmation?.message}
            name="passwordConfirmation"
            type="password"
            label="Confirm password"
            variant="outlined"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            inputProps={{ 'data-testid': 'AuthConfirmation.NewPasswordConfirm' }}
          />
          <Button
            disabled={isInProgress}
            fullWidth
            type="submit"
            className={classes.button}
            variant="contained"
            color="secondary"
            data-testid="AuthConfirmation.Submit"
          >
            Go to Alyce Sign-In
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default memo(NewPasswordForm);
