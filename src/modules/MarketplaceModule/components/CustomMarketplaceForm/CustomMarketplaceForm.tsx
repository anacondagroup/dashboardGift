import React, { useEffect, memo, useCallback } from 'react';
import { FieldError, FormProvider, useForm } from 'react-hook-form';
import { Box, FormControl, FormGroup, FormHelperText, FormLabel, Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useDispatch, useSelector } from 'react-redux';
import { CommonData, User } from '@alycecom/modules';
import { omit } from 'ramda';
import { AlyceTheme, Button, Divider, ProductSidebarHeader } from '@alycecom/ui';
import { useHistory } from 'react-router-dom';
import { useExternalErrors } from '@alycecom/hooks';
import { useGetUserTeamsQuery } from '@alycecom/services';

import {
  customMarketplaceFormDefaultValue,
  customMarketplaceSchemaResolver,
} from '../../store/customMarketplace/customMarketplace.schemas';
import {
  getCustomMarketplaceErrors,
  getCustomMarketplaceSettingsAsFormValues,
  getDataChangeReason,
  getIsLoaded,
  getIsLoading as getCustomMarketplaceLoading,
  getMarketplaceId,
} from '../../store/customMarketplace/customMarketplace.selectors';
import {
  CustomMarketplaceField,
  TCustomMarketplaceCreatePayload,
  TCustomMarketplaceForm,
} from '../../store/customMarketplace/customMarketplace.types';
import {
  createCustomMarketplace,
  resetDataChangeReason,
  updateCustomMarketplace,
} from '../../store/customMarketplace/customMarketplace.actions';
import { DataChangeReason } from '../../store/customMarketplace/customMarketplace.reducer';
import { MARKETPLACE_ROUTES } from '../../routePaths';
import { MarketplaceMode } from '../../types';

import MarketplaceName from './fields/MarketplaceName';
import MarketplaceTeam from './fields/MarketplaceTeam';
import MarketplaceCountry from './fields/MarketplaceCountry';
import IsPhysicalGiftsAllowed from './fields/IsPhysicalGiftsAllowed';
import MinPrice from './fields/MinPrice';
import MaxPrice from './fields/MaxPrice';
import IsGIftCardsAllowed from './fields/IsGIftCardsAllowed';
import GiftCardPrice from './fields/GiftCardPrice';
import IsDonationsAllowed from './fields/IsDonationsAllowed';
import DonationPrice from './fields/DonationPrice';

export interface ICustomMarketplaceFormProps {
  id?: number;
  onCancel: () => void;
}

const useStyles = makeStyles<AlyceTheme>(({ palette, spacing, zIndex }) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: palette.common.white,
    height: 'max(100%, 100vh)',
  },
  sectionTitle: {
    fontWeight: 700,
    fontSize: '1.125rem',
    color: palette.text.primary,
  },
  bodyText: {
    fontSize: '0.875rem',
    color: palette.grey.main,
  },
  multiSelectPopper: {
    width: '100%',
    maxWidth: 'none',
  },
  footer: {
    zIndex: zIndex.speedDial,
    flex: '0 0 76px',
    backgroundColor: palette.divider,
    marginTop: spacing(4),
    padding: spacing(2, 4),
    display: 'flex',
    justifyContent: 'space-between',
    position: 'sticky',
    bottom: 0,
  },
}));

const CustomMarketplaceForm = ({ onCancel }: ICustomMarketplaceFormProps): JSX.Element => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { push } = useHistory();
  const id = useSelector(getMarketplaceId);
  const settingsAsValues = useSelector(getCustomMarketplaceSettingsAsFormValues);
  const [defaultSelectedTeam] = useSelector(User.selectors.getUserCanManageTeams);
  const { isLoading: isTeamsLoading } = useGetUserTeamsQuery(undefined, { skip: true });
  const isCustomMarketplaceLoading = useSelector(getCustomMarketplaceLoading);
  const isLoaded = useSelector(getIsLoaded);
  const isCountriesLoaded = useSelector(CommonData.selectors.getIsCommonDataLoaded);
  const dataChangeReason = useSelector(getDataChangeReason);
  const externalErrors = useSelector(getCustomMarketplaceErrors);
  const isUpdated = dataChangeReason === DataChangeReason.Updated;
  const isCreated = dataChangeReason === DataChangeReason.Created;
  const formMethods = useForm<TCustomMarketplaceForm>({
    mode: 'all',
    defaultValues: customMarketplaceFormDefaultValue,
    resolver: customMarketplaceSchemaResolver,
  });
  const {
    handleSubmit,
    setValue,
    trigger,
    formState: { isDirty, errors },
    reset,
    setError,
    control,
  } = formMethods;
  const isSubmitDisabled = !isDirty || isTeamsLoading || isCustomMarketplaceLoading || !isCountriesLoaded;
  const isMarketplaceOptionsHasError = !!errors.isGiftCardsAllowed || !!errors.isDonationsAllowed;

  // @ts-ignore
  useExternalErrors(setError, externalErrors);

  useEffect(() => {
    if (!id && !!defaultSelectedTeam) {
      setValue(CustomMarketplaceField.TeamIds, [defaultSelectedTeam], { shouldDirty: false });
    }
  }, [defaultSelectedTeam, id, setValue]);

  useEffect(() => {
    if (isCreated && id) {
      dispatch(resetDataChangeReason());
      push(MARKETPLACE_ROUTES.buildCustomPath(id, MarketplaceMode.Edit));
    }
  }, [isCreated, id, push, dispatch]);

  useEffect(() => {
    if (isUpdated) {
      dispatch(resetDataChangeReason());
      onCancel();
    }
  }, [isUpdated, onCancel, dispatch]);

  useEffect(() => {
    if (isLoaded) {
      reset(settingsAsValues);
    }
  }, [isLoaded, settingsAsValues, reset]);

  const onSubmit = useCallback(
    (form: TCustomMarketplaceForm) => {
      const settings = omit(
        [
          CustomMarketplaceField.IsDonationsAllowed,
          CustomMarketplaceField.IsGiftCardsAllowed,
          CustomMarketplaceField.IsPhysicalGiftsAllowed,
        ],
        form,
      ) as TCustomMarketplaceCreatePayload;
      if (id) {
        dispatch(updateCustomMarketplace({ ...settings, id }));
      } else {
        dispatch(createCustomMarketplace(settings));
      }
    },
    [dispatch, id],
  );

  return (
    <FormProvider {...formMethods}>
      <Box className={classes.root} component="form" onSubmit={handleSubmit(onSubmit)}>
        <ProductSidebarHeader onClose={onCancel}>
          <Box ml={2} fontSize={20}>
            {id ? 'Edit' : 'Create'} Custom Marketplace
          </Box>
        </ProductSidebarHeader>
        <Box py={2} pl={2} pr={5} flex="1 1 auto">
          <Box className={classes.sectionTitle} mt={1} mb={1.5}>
            Marketplace details
          </Box>
          <MarketplaceName control={control} error={errors.name?.message} />
          <Box mt={5}>
            <MarketplaceTeam control={control} error={((errors.teamIds as unknown) as FieldError)?.message} />
          </Box>
          <Divider mt={6} mb={2} />
          <Box className={classes.sectionTitle}>Destination</Box>
          <Box mt={3}>
            <MarketplaceCountry control={control} disabled={!!id} />
          </Box>
          <Divider mt={4} mb={2} />
          <Box className={classes.sectionTitle}>Gift Budget</Box>
          <Box mt={2}>
            <IsPhysicalGiftsAllowed
              control={control}
              trigger={trigger}
              error={errors.isPhysicalGiftsAllowed?.message}
            />
          </Box>
          <Box mt={2}>
            <Grid container direction="row" wrap="nowrap" spacing={2}>
              <Grid component={Box} item flex="0 0 50%">
                <MinPrice control={control} error={errors.minPrice?.message} setValue={setValue} trigger={trigger} />
              </Grid>
              <Grid component={Box} item flex="0 0 50%">
                <MaxPrice control={control} error={errors.maxPrice?.message} setValue={setValue} trigger={trigger} />
              </Grid>
            </Grid>
          </Box>
          <FormControl component={Box} mt={2} error={isMarketplaceOptionsHasError}>
            <FormLabel component={Box} className={classes.sectionTitle} mt={5}>
              Gift Cards
            </FormLabel>
            <FormGroup>
              <Box mt={1}>
                <IsGIftCardsAllowed control={control} trigger={trigger} setValue={setValue} />
              </Box>
              <Box mt={1} pl={4}>
                <GiftCardPrice control={control} error={errors.giftCardPrice?.message} />
              </Box>
              <FormLabel component={Box} className={classes.sectionTitle} mt={4}>
                Donations
              </FormLabel>
              <Box mt={1}>
                <IsDonationsAllowed control={control} trigger={trigger} setValue={setValue} />
              </Box>
              <Box mt={1} pl={4} maxWidth={200}>
                <DonationPrice control={control} error={errors.donationPrice?.message} />
              </Box>
            </FormGroup>
            {isMarketplaceOptionsHasError && (
              <FormHelperText component={Box} pt={2}>
                Gift cards or donations should be enabled
              </FormHelperText>
            )}
          </FormControl>
        </Box>
        <Box className={classes.footer}>
          <Button onClick={onCancel}>Cancel</Button>
          <Button color="secondary" type="submit" disabled={isSubmitDisabled}>
            Save Marketplace
          </Button>
        </Box>
      </Box>
    </FormProvider>
  );
};

export default memo(CustomMarketplaceForm);
