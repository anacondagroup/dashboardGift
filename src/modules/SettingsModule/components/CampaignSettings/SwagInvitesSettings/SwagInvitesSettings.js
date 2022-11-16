import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Radio, RadioGroup, FormControlLabel, Collapse } from '@mui/material';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import { CampaignSettings, SettingsItem } from '@alycecom/modules';
import { Button, Icon } from '@alycecom/ui';
import { useDispatch, useSelector } from 'react-redux';
import { useModalState } from '@alycecom/hooks';
import MuiAlert from '@mui/material/Alert';
import { makeStyles } from '@mui/styles';

import { REQUIRED_ACTIONS_FIELDS } from '../../../../../constants/campaignSettings.constants';
import { useSwagInvitesSettings } from '../../../hooks/useSwagInvitesSettings';
import useTeamCurrency from '../../../../../hooks/useTeamCurrency';
import { RequiredActionsForm } from '../GiftInvitesSettings/GiftInvitesForms';
import SwagGiftBudgetForm from '../../CampaignSettingsModule/CreateCampaignSidebar/SwagSelectWizard/Sections/SwagGiftBudgetSection/SwagGiftBudgetForm';
import { ExchangeOptions, SS_BUDGET_STEP, SS_MARKETPLACE_STEP } from '../../../../../constants/swagSelect.constants';
import SwagSelectCustomMarketplaceForm from '../../CampaignSettingsModule/CreateCampaignSidebar/SwagSelectWizard/Sections/SwagSelectExchangeCustomMarketplace/SwagSelectCustomMarketplaceForm';
import {
  swagSelectLoadCampaignRequest,
  swagSelectSetStepData,
  swagSelectUpdateCampaignBudgetRequest,
  swagSelectUpdateRestrictedProductsRequest,
} from '../../../store/campaign/swagSelect/swagSelect.actions';
import {
  getSwagSelectCampaignBudgetData,
  getSwagSelectCampaignMarketplaceData,
} from '../../../store/campaign/swagSelect/swagSelect.selectors';
import {
  getProductTypeIds,
  getProductTypesMap,
} from '../../../../MarketplaceModule/store/entities/productTypes/productTypes.selectors';
import { fetchProductTypes } from '../../../../MarketplaceModule/store/entities/productTypes/productTypes.actions';
import CustomMarketplaceName from '../../../../MarketplaceModule/components/Shared/CustomMarketplaceName/CustomMarketplaceName';
import SwagSelectDefaultProductSidebar from '../../CampaignSettingsModule/CreateCampaignSidebar/SwagSelectWizard/Sections/SwagMarketplaceOptionsSection/SwagSelectDefaultProductSidebar/SwagSelectDefaultProductSidebar';

const useStyles = makeStyles(theme => ({
  tableContainer: {
    maxHeight: 390,
    overflow: 'scroll',
  },
  tip: {
    backgroundColor: theme.palette.orange.main,
    fontSize: 16,
  },
}));

const GiftInvitesSettings = ({ campaign }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const data = useSelector(getSwagSelectCampaignBudgetData);
  const marketplaceData = useSelector(getSwagSelectCampaignMarketplaceData);
  const { settings, isLoading, onSaveRequiredActions, errors } = useSwagInvitesSettings(campaign.id);
  const [defaultProduct, setDefaultProduct] = useState({
    productId: marketplaceData?.defaultProductId,
    denomination: marketplaceData?.defaultProductDenomination,
  });
  const { handleOpen, handleClose, isOpen } = useModalState();
  const productTypesMap = useSelector(getProductTypesMap);
  const productTypeIds = useSelector(getProductTypeIds);
  const [exchangeOption, setExchangeOption] = useState('');
  const currency = useTeamCurrency(campaign.id);
  const currencySign = R.propOr('', 'sign', currency);
  const requiredActions = settings.required_actions;
  const requiredActionsNames = useMemo(() => {
    if (!requiredActions) {
      return [];
    }
    return R.compose(
      R.map(action => REQUIRED_ACTIONS_FIELDS[action]),
      R.filter(action => requiredActions[action] === true),
      R.keys,
    )(requiredActions);
  }, [requiredActions]);

  useEffect(() => {
    dispatch(swagSelectLoadCampaignRequest(campaign.id, false));
  }, [dispatch, campaign.id]);

  useEffect(() => {
    if (data?.exchangeOption) {
      setExchangeOption(data.exchangeOption);
    }
  }, [data?.exchangeOption]);

  useEffect(() => {
    setDefaultProduct({
      productId: marketplaceData?.defaultProductId,
      denomination: marketplaceData?.defaultProductDenomination,
    });
  }, [marketplaceData?.defaultProductId, marketplaceData?.defaultProductDenomination]);

  const handleSubmitExchangeOption = useCallback(
    ({ formValues }) => {
      dispatch(
        swagSelectSetStepData({
          step: SS_BUDGET_STEP,
          data: {
            ...formValues,
            exchangeOption,
          },
        }),
      );
      dispatch(swagSelectUpdateCampaignBudgetRequest(campaign.id));
    },
    [campaign.id, dispatch, exchangeOption],
  );

  const handleSelectDefaultGift = useCallback(
    ({ id, denomination }) => {
      setDefaultProduct({ productId: id, denomination: denomination?.price });
      handleClose();
    },
    [handleClose],
  );

  const handleUpdateDefaultProduct = useCallback(() => {
    dispatch(
      swagSelectSetStepData({
        step: SS_MARKETPLACE_STEP,
        data: { defaultProductId: defaultProduct?.productId, defaultProductDenomination: defaultProduct?.denomination },
      }),
    );
    dispatch(swagSelectUpdateRestrictedProductsRequest(campaign.id));
  }, [dispatch, defaultProduct, campaign.id]);

  const chosenProductTypes = useMemo(
    () =>
      R.without(data?.restrictedProductTypeIds ?? [], productTypeIds)
        .map(id => productTypesMap[id]?.label)
        .join(', '),
    [data?.restrictedProductTypeIds, productTypesMap, productTypeIds],
  );

  const chosenBudgetValues = useMemo(
    () =>
      [
        typeof data?.minGiftAmount === 'number' && typeof data?.maxGiftAmount === 'number'
          ? `Physical: ${currencySign}${data.minGiftAmount} - ${currencySign}${data.maxGiftAmount}`
          : '',
        typeof data?.donationMaxAmount === 'number' ? `Donation: ${currencySign}${data.donationMaxAmount}` : '',
        typeof data?.giftCardMaxAmount === 'number' ? `Gift Card: ${currencySign}${data.giftCardMaxAmount}` : '',
      ]
        .filter(Boolean)
        .join(', '),
    [currencySign, data],
  );

  const restrictedVendorsCount = (data?.restrictedMerchantIds?.length ?? 0) + (data?.restrictedBrandIds?.length ?? 0);

  useEffect(() => {
    dispatch(fetchProductTypes());
  }, [dispatch]);

  return (
    <>
      <SettingsItem
        title="Gift Types, Budgets and Vendors"
        isLoading={isLoading}
        value={
          data?.exchangeOption === ExchangeOptions.Budget ? (
            <>
              <Box display="flex">
                <Box color="text.primary" fontWeight={400}>
                  Allowed Gift Types:
                </Box>
                <Box ml={1} className="Body-Regular-Left-Chambray-Bold">
                  {chosenProductTypes}
                </Box>
              </Box>
              <Box display="flex">
                <Box color="text.primary" fontWeight={400}>
                  Budgets:
                </Box>
                <Box ml={1} className="Body-Regular-Left-Chambray-Bold">
                  {chosenBudgetValues}
                </Box>
              </Box>
              <Box display="flex">
                <Box color="text.primary" fontWeight={400}>
                  Vendors:
                </Box>
                <Box ml={1} className="Body-Regular-Left-Chambray-Bold">
                  {restrictedVendorsCount ? `Restricted ${restrictedVendorsCount} vendors` : 'No restricted vendors'}
                </Box>
              </Box>
            </>
          ) : (
            <Box display="flex">
              <Box color="text.primary" fontWeight={400}>
                Custom Marketplace:
              </Box>
              <Box ml={1} className="Body-Regular-Left-Chambray-Bold">
                {data?.customMarketplaceId && <CustomMarketplaceName id={data.customMarketplaceId} />}
              </Box>
            </Box>
          )
        }
      >
        <RadioGroup value={exchangeOption} onChange={event => setExchangeOption(event.target.value)}>
          <FormControlLabel
            value={ExchangeOptions.Budget}
            control={<Radio color="primary" />}
            label="Specify Gift Options"
          />
          <FormControlLabel
            value={ExchangeOptions.CustomMarketplace}
            control={<Radio color="primary" />}
            label="Choose a Custom Marketplace"
          />
        </RadioGroup>
        <Box mt={2}>
          <Collapse in={exchangeOption === ExchangeOptions.Budget} mountOnEnter unmountOnExit>
            <SwagGiftBudgetForm
              onSubmit={handleSubmitExchangeOption}
              teamId={campaign.team_id}
              defaultValues={data || {}}
              submitButton={
                <Box mt={2}>
                  <Button type="submit" color="secondary">
                    Save
                  </Button>
                </Box>
              }
            />
          </Collapse>
          <Collapse in={exchangeOption === ExchangeOptions.CustomMarketplace} mounOnEnter unmountOnExit>
            <SwagSelectCustomMarketplaceForm
              teamId={campaign.team_id}
              defaultValues={data || {}}
              onSubmit={handleSubmitExchangeOption}
              submitButton={
                <Box mt={2}>
                  <Button type="submit" color="secondary">
                    Save
                  </Button>
                </Box>
              }
            />
          </Collapse>
        </Box>
      </SettingsItem>
      <SettingsItem
        title="Default Product"
        isLoading={false}
        value={
          <>
            <Box ml={1} className="Body-Regular-Left-Chambray-Bold">
              {defaultProduct?.productId && (
                <CampaignSettings.DefaultGift
                  productId={defaultProduct?.productId}
                  denomination={defaultProduct?.denomination}
                  variant="text"
                  component="span"
                />
              )}
            </Box>
            {marketplaceData?.isDefaultProductInBudget === false && (
              <Box mt={2}>
                <MuiAlert
                  icon={<Icon fontSize="inherit" icon="exclamation-circle" />}
                  variant="filled"
                  severity="warning"
                  className={classes.tip}
                >
                  Leading Gift is outside of your selected budget range. Please select another gift.
                </MuiAlert>
              </Box>
            )}
          </>
        }
      >
        <Box>
          <Collapse in={!!defaultProduct?.productId} unmountOnExit mountOnEnter>
            <Box mt={3} mb={2}>
              <CampaignSettings.DefaultGift
                productId={defaultProduct?.productId}
                denomination={defaultProduct?.denomination}
              />
            </Box>
          </Collapse>
          <Button variant="outlined" endIcon={<Icon icon="gift" />} onClick={() => handleOpen()}>
            {defaultProduct?.productId ? 'Change Gift' : 'Select Gift'}
          </Button>
          <SwagSelectDefaultProductSidebar
            campaignId={campaign.id}
            onChange={handleSelectDefaultGift}
            onClose={handleClose}
            open={isOpen}
          />
          <Box mt={2}>
            <Button onClick={handleUpdateDefaultProduct} color="secondary">
              Save
            </Button>
          </Box>
        </Box>
      </SettingsItem>
      <SettingsItem
        title="Required actions"
        description={`Set the default required action fields for this campaign when a recipient accepts a gift. ${campaign.name} currently has ${requiredActionsNames.length} defaults`}
        isLoading={isLoading}
        value={requiredActionsNames.length ? requiredActionsNames.join(', ') : 'None'}
      >
        <RequiredActionsForm
          actions={R.is(Array, settings.required_actions) ? undefined : settings.required_actions}
          isLoading={isLoading}
          errors={errors}
          onSave={onSaveRequiredActions}
          showCanOverrideActions={false}
        />
      </SettingsItem>
    </>
  );
};
GiftInvitesSettings.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  campaign: PropTypes.object.isRequired,
};

export default GiftInvitesSettings;
