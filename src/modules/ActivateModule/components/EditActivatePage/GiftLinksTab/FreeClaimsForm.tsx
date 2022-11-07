import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, TextField } from '@mui/material';
import { useDebouncedValue } from '@alycecom/hooks';
import { useController, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import {
  getDetailsData,
  getClaimedGiftsCount,
  getRemainingClaims,
  updateFreeClaims,
} from '../../../store/steps/details';
import { totalClaimsSchema, TTotalClaimsFields } from '../../../store/steps/details/detailsForm.schemas';
import { useTrackCampaignFreeClaimsUpdated } from '../../../hooks/useTrackActivate';
import { useActivate } from '../../../hooks/useActivate';

const styles = {
  root: {
    mb: 5,
  },
  title: {
    color: 'text.primary',
    fontWeight: 700,
    mt: 2,
  },
  subtitle: {
    fontSize: '0.875rem',
    color: 'grey.main',
  },
  field: {
    mt: 2,
    mb: 2,
  },
  remaining: {
    color: 'error.main',
  },
} as const;

const FreeClaimsForm = (): JSX.Element => {
  const { campaignId } = useActivate();
  const dispatch = useDispatch();
  const details = useSelector(getDetailsData);
  const remaining = useSelector(getRemainingClaims);
  const claimedGiftsCount = useSelector(getClaimedGiftsCount);
  const { freeClaims } = details || {};

  const { control, handleSubmit, resetField } = useForm<TTotalClaimsFields>({
    mode: 'all',
    resolver: yupResolver(totalClaimsSchema),
    context: {
      claimedGiftsCount,
    },
  });

  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({
    control,
    name: 'freeClaims',
  });
  const hasError = !!error?.message;
  const [debouncedValue] = useDebouncedValue(value, 1000);
  const isReady = value === debouncedValue;

  const trackFreeClaimsUpdated = useTrackCampaignFreeClaimsUpdated({ campaignId: Number(campaignId) });

  const formSubmitHandler = useMemo(
    () =>
      handleSubmit((data: TTotalClaimsFields) => {
        dispatch(updateFreeClaims(data));
        trackFreeClaimsUpdated({ prevClaims: freeClaims, nextClaims: data.freeClaims });
      }),
    [handleSubmit, dispatch, trackFreeClaimsUpdated, freeClaims],
  );

  useEffect(() => {
    if (isReady && typeof value === 'number' && value !== freeClaims && !hasError) {
      formSubmitHandler();
    }
  }, [isReady, freeClaims, value, formSubmitHandler, hasError]);

  useEffect(() => {
    resetField('freeClaims', {
      defaultValue: freeClaims ?? 0,
    });
  }, [resetField, freeClaims]);

  return (
    <form>
      <Box sx={styles.root}>
        <Box sx={styles.title}>Total Claims</Box>
        <Box sx={styles.subtitle}>
          You must set a maximum number of claims, after which recipients may see a &quot;Your gift has expired&quot;
          messaging.
        </Box>
        <TextField
          sx={styles.field}
          variant="outlined"
          label="Total Claims"
          value={value ?? ''}
          onChange={({ target: { value: freeClaimsValue } }) => {
            const parsedValue = Number(freeClaimsValue);
            onChange(Number.isNaN(parsedValue) || freeClaimsValue === '' ? null : parsedValue);
          }}
          error={hasError}
          helperText={error?.message}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <Box sx={styles.title}>
          Remaining:{' '}
          <Box component="span" sx={styles.remaining}>
            {remaining}
          </Box>
        </Box>
      </Box>
    </form>
  );
};

export default FreeClaimsForm;
