import React, { useCallback, memo, InputHTMLAttributes } from 'react';
import { TextField, Box, Grid, Checkbox, FormControlLabel, FormControl, Collapse } from '@mui/material';
import { ActionButton } from '@alycecom/ui';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useExternalErrors } from '@alycecom/hooks';

import { selectors, actions, schemas } from '../../../../store/organisation/customFields';

const CustomFieldsForm = (): React.ReactElement => {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectors.getIsLoading);
  const externalErrors = useSelector(selectors.getAddFieldFormErrors);

  const {
    handleSubmit,
    watch,
    formState: { errors, isValid },
    reset,
    register,
    control,
    setError,
  } = useForm<Record<string, unknown>>({
    mode: 'all',
    resolver: yupResolver(schemas.addFieldFormSchema),
    shouldUnregister: false,
    defaultValues: {
      label: '',
      required: false,
    },
  });
  const { ref: labelRef, ...labelRegister } = register('label');

  const labelValue = watch('label');
  const isSubmitDisabled = isLoading || !isValid;
  const isRequiredInputVisible = !!labelValue;

  useExternalErrors(setError, externalErrors);

  const onSubmit = useCallback(
    ({ label, required }) => {
      dispatch(actions.addCustomField({ label, required }));
      reset({ label: '', required: false });
    },
    [dispatch, reset],
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box pt={3}>
        <Grid container spacing={2}>
          <Grid xs={7} md={4} item>
            <TextField
              inputRef={labelRef}
              {...labelRegister}
              fullWidth
              name="label"
              error={!!errors.label}
              // @ts-ignore
              helperText={errors.label?.message}
              variant="outlined"
              label="Custom field name"
              inputProps={{
                'data-testid': 'OrgSettings.CustomFields.CustomFieldName',
              }}
            />
          </Grid>
          <Grid component={Box} flexShrink={0} xs={5} md={8} item>
            <ActionButton
              type="submit"
              data-testid="OrgSettings.CustomFields.AddCustomFieldButton"
              disabled={isSubmitDisabled}
              width="auto"
            >
              + Add a custom field
            </ActionButton>
          </Grid>
        </Grid>
      </Box>
      <Collapse in={isRequiredInputVisible} unmountOnExit>
        <Controller
          name="required"
          control={control}
          render={({ field: { value, onChange } }) => (
            <FormControl>
              <FormControlLabel
                // @ts-ignore
                checked={value}
                onChange={(event, checked) => onChange(checked)}
                control={
                  <Checkbox
                    color="primary"
                    inputProps={
                      {
                        'data-testid': 'OrgSettings.CustomFields.CustomFieldRequiredCheckbox',
                      } as InputHTMLAttributes<HTMLInputElement>
                    }
                  />
                }
                label={`Set “${labelValue}” to be a required field`}
              />
            </FormControl>
          )}
        />
      </Collapse>
    </form>
  );
};

export default memo(CustomFieldsForm);
