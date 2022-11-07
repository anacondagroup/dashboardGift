import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Box, Divider, Grid, Theme, Typography } from '@mui/material';
import { useApplyManualFormErrorsEffect } from '@alycecom/hooks';
import { Button, ProductSidebar, ProductSidebarHeader } from '@alycecom/ui';
import moment from 'moment';

import {
  setOpenCloseCodesSettingsBar,
  updateDraftSwagCardOrder,
} from '../../../../store/swagCampaign/steps/codes/codes.actions';
import {
  CreateCardOrderSectionTitle,
  EXPIRATION_DATE_FORMAT,
} from '../../../../store/swagCampaign/steps/codes/codes.constants';
import {
  DeliveryAddressLabels,
  DeliveryAddressDataFields,
  TPhysicalCardsFormValues,
} from '../../../../store/swagCampaign/steps/codes/codes.types';
import {
  physicalCardsSettingsResolver,
  physicalCardsSettingsDefaultValues,
} from '../../../../store/swagCampaign/steps/codes/codes.schemas';
import {
  getCardsOrder,
  getErrors,
  getIsOpenCodesSettingBar,
} from '../../../../store/swagCampaign/steps/codes/codes.selectors';

import AmountCards from './fields/AmountCards';
import ContactName from './fields/ContactName';
import AddressLine from './fields/AddressLine';
import City from './fields/City';
import State from './fields/State';
import ZipCode from './fields/ZipCode';
import Country from './fields/Country';
import OrderName from './fields/OrderName';
import ExpiationDate from './fields/ExpirationDate';

const styles = {
  headerTitle: {
    color: ({ palette }: Theme) => palette.common.white,
    fontWeight: 'bolder',
    marginLeft: '1.5em',
  },
  footer: {
    width: 550,
    height: 75,
    position: 'fixed',
    bottom: 0,
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: ({ palette }: Theme) => palette.primary.light,
    padding: ({ spacing }: Theme) => spacing(2),
    zIndex: ({ zIndex }: Theme) => zIndex.appBar,
  },
} as const;

const CodeSettingsSideBar = (): JSX.Element => {
  const dispatch = useDispatch();

  const isOpen = useSelector(getIsOpenCodesSettingBar);
  const cardOrderData = useSelector(getCardsOrder);
  const errors = useSelector(getErrors);

  const { control, handleSubmit, reset, setError } = useForm<TPhysicalCardsFormValues>({
    resolver: physicalCardsSettingsResolver,
    defaultValues: physicalCardsSettingsDefaultValues,
  });

  const [countryId, setCountryId] = useState<number>(1);

  const closeSideBar = useCallback(() => {
    dispatch(setOpenCloseCodesSettingsBar(false));
    if (!cardOrderData) {
      reset();
    }
  }, [cardOrderData, dispatch, reset]);

  const onSubmit = useCallback(
    (values: TPhysicalCardsFormValues) => {
      const formData = {
        ...values,
        codesExpirationDate: moment(values.codesExpirationDate).format(EXPIRATION_DATE_FORMAT),
        deliveryAddress: {
          ...values.deliveryAddress,
          countryId: values.deliveryAddress.countryId,
        },
      };
      dispatch(updateDraftSwagCardOrder(formData));
      dispatch(setOpenCloseCodesSettingsBar(false));
    },
    [dispatch],
  );

  useEffect(() => {
    if (cardOrderData) {
      reset(cardOrderData, { keepDefaultValues: false });
    }
  }, [cardOrderData, reset]);

  useApplyManualFormErrorsEffect<TPhysicalCardsFormValues>(setError, errors);

  return (
    <ProductSidebar isOpen={isOpen} onClose={closeSideBar} width={550}>
      <ProductSidebarHeader onClose={closeSideBar} height={84}>
        <Typography sx={styles.headerTitle}>{CreateCardOrderSectionTitle}</Typography>
      </ProductSidebarHeader>

      <Grid component={Box} m={3} maxWidth={480} height="70em" direction="column" container spacing={1.5}>
        <Grid component={Box} mb={2} item>
          <AmountCards control={control} />
        </Grid>
        <Divider />
        <Grid component={Box} mb={2} item>
          <ContactName control={control} />
        </Grid>
        <Divider />
        <Grid item>
          <AddressLine
            control={control}
            nameField={DeliveryAddressDataFields.AddressLine1}
            labelText={DeliveryAddressLabels.AddressLine1}
            dataTestId="SwagBuilder.CodesStep.PhysicalCodes.AddressLine1"
          />
        </Grid>
        <Grid item>
          <AddressLine
            control={control}
            nameField={DeliveryAddressDataFields.AddressLine2}
            labelText={DeliveryAddressLabels.AddressLine2}
            dataTestId="SwagBuilder.CodesStep.PhysicalCodes.AddressLine2"
            isRequired={false}
          />
        </Grid>
        <Grid component={Box} ml={2} container>
          <Grid item xs={4}>
            <City control={control} />
          </Grid>
          <Grid component={Box} mt={2} mr={2} ml={2} item xs={4}>
            <State control={control} countryId={countryId} />
          </Grid>
          <Grid item xs={3}>
            <ZipCode control={control} />
          </Grid>
        </Grid>
        <Grid component={Box} mb={2} item>
          <Country control={control} handleChangeCountry={setCountryId} />
        </Grid>
        <Divider />
        <Grid item>
          <OrderName control={control} />
        </Grid>
        <Grid item>
          <ExpiationDate control={control} />
        </Grid>
      </Grid>
      <Box flex="0 0 94px" position="relative">
        <Box sx={styles.footer}>
          <Box ml={3}>
            <Button type="button" borderColor="divider" color="default" onClick={closeSideBar}>
              Cancel
            </Button>
          </Box>
          <Box mr={2}>
            <Button type="button" color="primary" onClick={handleSubmit(onSubmit)}>
              Save
            </Button>
          </Box>
        </Box>
      </Box>
    </ProductSidebar>
  );
};

export default CodeSettingsSideBar;
