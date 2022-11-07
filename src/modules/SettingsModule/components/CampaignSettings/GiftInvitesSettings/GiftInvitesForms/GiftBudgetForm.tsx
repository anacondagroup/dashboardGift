import React, { useCallback, memo, useMemo } from 'react';
import { Box, InputAdornment, TextField, Typography } from '@mui/material';
import { ActionButton, AlyceTheme } from '@alycecom/ui';
import { TErrors } from '@alycecom/services';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useExternalErrors } from '@alycecom/hooks';
import { Currencies, CurrencyConverter, ICurrency } from '@alycecom/modules';
import { makeStyles } from '@mui/styles';

import { ICampaignBudget } from '../../../../store/campaign/giftInvites/giftInvites.types';
import { campaignBudgetValidationSchema } from '../../../../store/campaign/giftInvites/giftInvites.schemas';
import { IPriceAvailability } from '../../../../../MarketplaceModule/store/priceAvailability/priceAvailability.types';
import GiftCardsMarketplaceLink from '../../../../../MarketplaceModule/components/Shared/GiftCardsMarketplaceLink';

export interface IBudgetFormProps {
  giftMinPrice: number;
  giftMaxPrice: number;
  giftCardPrice: number;
  giftDonationPrice: number;
  currencySign: string;
  campaignCurrencies: ICurrency[];
  priceAvailability: IPriceAvailability;
  countryIds: number[];
  onSave: (budget: ICampaignBudget) => void;
  isLoading?: boolean;
  errors?: TErrors<ICampaignBudget>;
}

const useStyles = makeStyles<AlyceTheme>(({ spacing }) => ({
  giftCardPreviewLink: {
    marginTop: spacing(1),
    marginBottom: spacing(4),
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'none',
    },
  },
}));

const GiftBudgetForm = ({
  giftMinPrice,
  giftMaxPrice,
  giftCardPrice,
  giftDonationPrice,
  currencySign,
  campaignCurrencies,
  priceAvailability,
  countryIds,
  onSave,
  isLoading = false,
  errors: externalErrors = {},
}: IBudgetFormProps): JSX.Element => {
  const classes = useStyles();
  const handleSaveBudget = useCallback(
    (data: ICampaignBudget) => {
      onSave({
        ...data,
        enterprise_min_price: data.enterprise_min_price ?? 0,
        enterprise_max_price:
          data.enterprise_max_price ?? (data.enterprise_gift_card_price > 1 ? data.enterprise_gift_card_price - 1 : 1),
        enterprise_gift_card_price: data.enterprise_gift_card_price ?? giftCardPrice,
        enterprise_donation_price: data.enterprise_donation_price ?? giftDonationPrice,
      });
    },
    [onSave, giftCardPrice, giftDonationPrice],
  );

  const {
    handleSubmit,
    setError,
    register,
    formState: { isValid, errors },
    watch,
  } = useForm<ICampaignBudget>({
    mode: 'all',
    defaultValues: {
      enterprise_min_price: giftMinPrice,
      enterprise_max_price: giftMaxPrice,
      enterprise_gift_card_price: giftCardPrice,
      enterprise_donation_price: giftDonationPrice,
    },
    resolver: yupResolver(campaignBudgetValidationSchema),
    context: { priceAvailability },
  });
  const { ref: minPriceRef, ...minPriceRegister } = register('enterprise_min_price');
  const { ref: maxPriceRef, ...maxPriceRegister } = register('enterprise_max_price');
  const { ref: cardPriceRef, ...cardPriceRegister } = register('enterprise_gift_card_price');
  const { ref: donationPriceRef, ...donationPriceRegister } = register('enterprise_donation_price');

  useExternalErrors<ICampaignBudget>(setError, externalErrors);

  const isSaveDisabled = isLoading || !isValid;

  const convertToCurrencies = useMemo(
    () =>
      campaignCurrencies.filter(currency => currency.id !== Currencies.constants.USD_ID).map(currency => currency.id),
    [campaignCurrencies],
  );
  const watchGiftCardPrice = watch('enterprise_gift_card_price');

  return (
    <form onSubmit={handleSubmit(handleSaveBudget)}>
      {priceAvailability.isPhysicalAvailable && (
        <Box mt={1}>
          <Typography className="Body-Regular-Left-Static-Bold">Merchandise</Typography>
        </Box>
      )}
      <Box display="flex" flexDirection="column">
        {priceAvailability.isPhysicalAvailable && (
          <Box width={360} display="flex" alignItems="flex-start" justifyContent="space-between">
            <Box width={160}>
              <TextField
                inputRef={minPriceRef}
                {...minPriceRegister}
                id="field-enterprise_min_price-id"
                type="number"
                name="enterprise_min_price"
                label="Min amount"
                placeholder="Min amount"
                fullWidth
                disabled={isLoading}
                variant="outlined"
                margin="normal"
                required
                InputProps={{
                  startAdornment: <InputAdornment position="start">{currencySign}</InputAdornment>,
                }}
                error={!!errors.enterprise_min_price}
                helperText={errors.enterprise_min_price && errors.enterprise_min_price.message}
              />
            </Box>
            <Box width={160}>
              <TextField
                inputRef={maxPriceRef}
                {...maxPriceRegister}
                id="field-enterprise_max_price-id"
                type="number"
                name="enterprise_max_price"
                label="Max amount"
                placeholder="Max amount"
                fullWidth
                disabled={isLoading}
                variant="outlined"
                margin="normal"
                required
                InputProps={{
                  startAdornment: <InputAdornment position="start">{currencySign}</InputAdornment>,
                }}
                error={!!errors.enterprise_max_price}
                helperText={errors.enterprise_max_price && errors.enterprise_max_price.message}
              />
            </Box>
          </Box>
        )}
        {priceAvailability.isDigitalAvailable && (
          <>
            <Box mt={3}>
              <Typography className="Body-Regular-Left-Static-Bold">Gift cards</Typography>
            </Box>
            <Box width={160}>
              <TextField
                inputRef={cardPriceRef}
                {...cardPriceRegister}
                id="field-enterprise_gift_card_price-id"
                type="number"
                name="enterprise_gift_card_price"
                label="Gift card price"
                placeholder="Gift card price"
                fullWidth
                disabled={isLoading}
                variant="outlined"
                margin="normal"
                required
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                error={!!errors.enterprise_gift_card_price}
                helperText={errors.enterprise_gift_card_price && errors.enterprise_gift_card_price.message}
              />
            </Box>
            {convertToCurrencies.length > 0 && (
              <Box ml={6} width={350}>
                <CurrencyConverter.Component
                  price={Number(watchGiftCardPrice)}
                  fromCurrencyId={Currencies.constants.USD_ID}
                  toCurrencyIds={convertToCurrencies}
                />
              </Box>
            )}
            <GiftCardsMarketplaceLink
              className={classes.giftCardPreviewLink}
              giftCardPrice={watchGiftCardPrice}
              countryIds={countryIds}
            />
          </>
        )}
        {priceAvailability.isDonationAvailable && (
          <>
            <Box mt={1}>
              <Typography className="Body-Regular-Left-Static-Bold">
                Gift donation <span className="Body-Regular-Left-Static">- available in {currencySign} only</span>
              </Typography>
            </Box>
            <Box width={160}>
              <TextField
                inputRef={donationPriceRef}
                {...donationPriceRegister}
                id="field-enterprise_donation_price-id"
                type="number"
                name="enterprise_donation_price"
                label="Amount"
                placeholder="Amount"
                fullWidth
                disabled={isLoading}
                variant="outlined"
                margin="normal"
                required
                InputProps={{
                  startAdornment: <InputAdornment position="start">{currencySign}</InputAdornment>,
                }}
                error={!!errors.enterprise_donation_price}
                helperText={errors.enterprise_donation_price && errors.enterprise_donation_price.message}
              />
            </Box>
          </>
        )}
        <Box width={1} display="flex" justifyContent="space-between" mt={2}>
          <ActionButton type="submit" width={100} disabled={isSaveDisabled}>
            Save
          </ActionButton>
        </Box>
      </Box>
    </form>
  );
};

export default memo(GiftBudgetForm);
