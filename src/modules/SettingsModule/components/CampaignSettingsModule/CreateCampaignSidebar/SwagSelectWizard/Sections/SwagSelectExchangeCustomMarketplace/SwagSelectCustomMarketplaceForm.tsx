import React, { useCallback, useEffect, useMemo } from 'react';
import { AlyceTheme, Icon } from '@alycecom/ui';
import { number, object } from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { CommonData } from '@alycecom/modules';
import { useSelector } from 'react-redux';
import MuiAlert from '@mui/material/Alert';
import { Box, Button, FormControl, FormHelperText, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';

import CustomMarketplaceSelect from '../../../../../../../MarketplaceModule/components/Shared/CustomMarketplaceSelect/CustomMarketplaceSelect';
import { makeGetCustomMarketplaceById } from '../../../../../../../MarketplaceModule/store/entities/customMarketplaces/customMarketplaces.selectors';

export type TSwagSelectCustomMarketplaceFormValue = {
  customMarketplaceId: null | number;
};

export interface ISwagSelectCustomMarketplaceFormProps {
  teamId: number;
  defaultValues: TSwagSelectCustomMarketplaceFormValue;
  onSubmit: (arg0: { formValues: TSwagSelectCustomMarketplaceFormValue; isDirty: boolean }) => void;
  isLoading?: boolean;
  submitButton?: React.ReactNode;
}

export const SelectCustomMarketplaceSchema = object().shape({
  customMarketplaceId: number().label('Custom marketplace').nullable().required(),
});

export const SelectCustomMarketplaceSchemaResolver = yupResolver(SelectCustomMarketplaceSchema);
export const SelectCustomMarketplaceSchemaDefaultValues = SelectCustomMarketplaceSchema.getDefault();

const useStyles = makeStyles<AlyceTheme>(({ palette }) => ({
  tip: {
    backgroundColor: palette.orange.main,
    fontSize: 16,
  },
}));

const SwagSelectCustomMarketplaceForm = ({
  defaultValues,
  onSubmit,
  teamId,
  isLoading = false,
  submitButton = undefined,
}: ISwagSelectCustomMarketplaceFormProps): JSX.Element => {
  const classes = useStyles();
  const {
    formState: { isDirty, errors },
    control,
    reset,
    watch,
    handleSubmit,
  } = useForm<TSwagSelectCustomMarketplaceFormValue>({
    mode: 'all',
    defaultValues: SelectCustomMarketplaceSchemaDefaultValues,
    resolver: SelectCustomMarketplaceSchemaResolver,
  });
  const customMarketplaceId = watch('customMarketplaceId');
  const customMarketplace = useSelector(
    useMemo(() => (customMarketplaceId ? makeGetCustomMarketplaceById(customMarketplaceId) : () => undefined), [
      customMarketplaceId,
    ]),
  );
  const countries = useSelector(
    useMemo(
      () =>
        CommonData.selectors.makeGetCountriesByIds(
          customMarketplace?.countryIds?.filter(
            countryId => countryId === CommonData.COUNTRIES.CA.id || countryId === CommonData.COUNTRIES.US.id,
          ) ?? [],
        ),
      [customMarketplace],
    ),
  );

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const handleFormSubmit = useCallback(
    formValues => {
      onSubmit({
        formValues,
        isDirty,
      });
    },
    [onSubmit, isDirty],
  );

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <Typography variant="h6" gutterBottom>
        Choose a Custom Marketplace
      </Typography>
      <Box mt={3}>
        <FormControl fullWidth error={!!errors.customMarketplaceId}>
          <Controller
            name="customMarketplaceId"
            control={control}
            render={({ field: { value, onChange } }) => (
              <CustomMarketplaceSelect
                disableEmptyMarketplaces
                permittedCountryIds={[CommonData.COUNTRIES.US.id, CommonData.COUNTRIES.CA.id]}
                teamId={teamId}
                value={value}
                onChange={onChange}
              />
            )}
          />
          {!!errors.customMarketplaceId?.message && (
            <FormHelperText>{errors.customMarketplaceId.message}</FormHelperText>
          )}
        </FormControl>
        {countries?.length > 0 && (
          <Box mt={2}>
            <MuiAlert
              icon={<Icon fontSize="inherit" icon="exclamation-circle" />}
              variant="filled"
              severity="warning"
              className={classes.tip}
            >
              Products from this marketplace are only available for recipients located in{' '}
              <b>{countries.map(country => country.name).join(', ')}.</b>
            </MuiAlert>
          </Box>
        )}
      </Box>
      {submitButton || (
        <Box width="100%" mt={3} display="flex" justifyContent="flex-end" alignItems="center">
          <Button
            variant="contained"
            color="secondary"
            type="submit"
            disabled={isLoading}
            endIcon={<Icon color="inherit" icon="arrow-right" />}
          >
            Next step
          </Button>
        </Box>
      )}
    </form>
  );
};

export default SwagSelectCustomMarketplaceForm;
