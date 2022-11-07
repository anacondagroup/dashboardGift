import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import { Box } from '@mui/material';
import { SettingsItem, VIDEO_TYPE_EMBED, VIDEO_TYPE_VIDYARD, Features } from '@alycecom/modules';
import { TrackEvent } from '@alycecom/services';

import GiftInvitationMethodsTable from '../GiftInvitationMethodsTable/GiftInvitationMethodsTable';
import { CAMPAIGN_TYPES, REQUIRED_ACTIONS_FIELDS } from '../../../../../constants/campaignSettings.constants';
import MarketplaceVendorsRestrictions from '../MarketplaceVendorsRestrictions/MarketplaceVendorsRestrictions';
import MarketplaceGiftTypeRestrictions from '../MarketplaceGiftTypeRestrictions/MarketplaceGiftTypeRestrictions';
import GiftLimitsSettingsLoader from '../../CampaignSettingsModule/hoc/GiftLimitsSettingsLoader';
import {
  campaignCurrencyShape,
  campaignGiftInvitesCustomisationSettingsShape,
  campaignGiftInvitesSettingsShape,
} from '../../CampaignSettingsModule/shapes/campaignGiftInvitesSettings.shape';
import {
  getIsLoading,
  getSelectedGiftInvitationMethodNames,
} from '../../../store/campaign/invitationMethods/invitationMethods.selectors';
import { fetchGiftInvitationMethods } from '../../../store/campaign/invitationMethods/invitationMethods.actions';
import { getCampaignSettingsBudgetTitle } from '../../../helpers/campaignBudget.helpers';
import { getSettings } from '../../../store/teams/generalSettings/generalSettings.actions';
import { getCanOverrideGiftExpireInDaysSetting } from '../../../store/teams/generalSettings/generalSettings.selectors';
import { usePriceAvailability } from '../../../../MarketplaceModule/hooks/usePriceAvailability';
import { makeGetCustomMarketplaceById } from '../../../../MarketplaceModule/store/entities/customMarketplaces/customMarketplaces.selectors';
import { getCampaignCustomMarketplaceId } from '../../../store/campaign/commonData/commonData.selectors';
import { fetchCustomMarketplaces } from '../../../../MarketplaceModule/store/entities/customMarketplaces/customMarketplaces.actions';

import { GiftBudgetForm, RequiredActionsForm, GiftExpirationForm } from './GiftInvitesForms';
import GiftLimitsForm from './GiftInvitesForms/GiftLimitsForm/GiftLimitsForm';
import GiftRedirectForm from './GiftInvitesForms/GiftRedirectForm';
import GiftVideoMessageForm from './GiftInvitesForms/GiftVideoMessageForm';
import CustomMarketplaceForm from './GiftInvitesForms/CustomMarketplaceForm';

const getGiftLimitString = limits => {
  const limitsCount = limits.every(limit => limit.default_gift_limits_amount === limits[0].default_gift_limits_amount)
    ? limits[0].default_gift_limits_amount
    : 'Multiple';
  return `${limitsCount} limits for each team member`;
};

const GiftInvitesSettings = ({
  isLoading,
  campaign,
  campaignType,
  customisation,
  campaignId,
  currency,
  campaignCurrencies,
  campaignName,
  onSaveBudget,
  onSaveRequiredActions,
  onSaveGiftExpiration,
  onSaveGiftRedirect,
  onSaveGiftVideo,
  invitesErrors,
  teamId,
}) => {
  const dispatch = useDispatch();
  const { trackEvent } = TrackEvent.useTrackEvent();

  const getCampaignProp = useCallback(prop => campaign && campaign[prop], [campaign]);
  const getCustomisationProp = useCallback(prop => customisation && customisation[prop], [customisation]);

  const isGiftInvitationMethodsLoading = useSelector(getIsLoading);
  const selectedGiftInvitationMethodNames = useSelector(getSelectedGiftInvitationMethodNames);
  const canOverrideGiftExpireSetting = useSelector(getCanOverrideGiftExpireInDaysSetting);
  const customMarketplaceId = useSelector(getCampaignCustomMarketplaceId);
  const customMarketplace = useSelector(makeGetCustomMarketplaceById(customMarketplaceId));
  const isCustomMarketplacesEnabled = useSelector(
    Features.selectors.hasFeatureFlag(Features.FLAGS.CUSTOM_MARKETPLACES),
  );

  const isBudgetManagementLimitEnabled = useSelector(
    Features.selectors.hasFeatureFlag(Features.FLAGS.BUDGET_MANAGEMENT_LIMIT),
  );
  const isBudgetManagementSetupEnabled = useSelector(
    Features.selectors.hasFeatureFlag(Features.FLAGS.BUDGET_MANAGEMENT_SETUP),
  );
  const hasBudgetFeaturesEnabled = isBudgetManagementLimitEnabled && isBudgetManagementSetupEnabled;

  const priceAvailability = usePriceAvailability(campaignId);

  useEffect(() => {
    dispatch(getSettings(teamId));
  }, [dispatch, teamId]);

  const requiredActions = getCampaignProp('required_actions');
  const videoLandingPageValue = useMemo(() => {
    const videoType = getCustomisationProp('recipient_video_type');
    if (videoType === VIDEO_TYPE_EMBED) {
      return 'Yes, use a video link';
    }
    if (videoType === VIDEO_TYPE_VIDYARD) {
      return 'Yes, Vidyard Video';
    }

    return 'No, do not use a video link';
  }, [getCustomisationProp]);

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

  const campaignBudget = useMemo(
    () => ({
      giftMinPrice: getCampaignProp('enterprise_min_price') || 0,
      giftMaxPrice: getCampaignProp('enterprise_max_price') || 0,
      giftCardPrice: getCampaignProp('enterprise_gift_card_price') || 0,
      giftDonationPrice: getCampaignProp('enterprise_donation_price') || 0,
    }),
    [getCampaignProp],
  );

  const currencySign = R.propOr('', 'sign', currency);
  const budgetTitle = getCampaignSettingsBudgetTitle({
    budget: campaignBudget,
    priceAvailability,
    currencySign,
  });

  const redirectSettingsValue = useMemo(() => (getCustomisationProp('redirect_url') ? 'Yes - use a CTA link' : 'No'), [
    getCustomisationProp,
  ]);

  const handleBudgetSave = useCallback(
    ({
      enterprise_min_price: giftMinPrice,
      enterprise_max_price: giftMaxPrice,
      enterprise_gift_card_price: giftCardPrice,
      enterprise_donation_price: giftDonationPrice,
    }) => {
      onSaveBudget({
        campaignId,
        campaignType,
        giftMinPrice,
        giftMaxPrice,
        giftCardPrice,
        giftDonationPrice,
      });
      trackEvent('Campaign gift budget - updated', { countryIds: campaign.countryIds.toString(), campaignId });
    },
    [onSaveBudget, campaignId, campaignType, trackEvent, campaign],
  );

  useEffect(() => {
    dispatch(fetchGiftInvitationMethods({ campaignId }));
  }, [dispatch, campaignId]);

  useEffect(() => {
    if (isCustomMarketplacesEnabled) {
      dispatch(fetchCustomMarketplaces());
    }
  }, [dispatch, isCustomMarketplacesEnabled]);

  return (
    <>
      {isCustomMarketplacesEnabled && (
        <SettingsItem
          title="Custom Marketplace"
          value={customMarketplace?.name ?? 'None'}
          description={
            <>
              Use a pre-configured Custom Marketplace (overrides Gift budget, Gift Types and Gift vendors settings
              below). <br />
              Currently is set to
            </>
          }
          isLoading={isLoading}
        >
          <CustomMarketplaceForm
            customMarketplaceId={customMarketplaceId}
            campaignId={campaignId}
            countryIds={getCampaignProp('countryIds')}
            teamId={teamId}
          />
        </SettingsItem>
      )}
      <SettingsItem
        title="Gift budget"
        description="The current gift budget is set to"
        isLoading={isLoading}
        value={budgetTitle}
        disabled={
          (!priceAvailability.isPhysicalAvailable &&
            !priceAvailability.isDigitalAvailable &&
            !priceAvailability.isDonationAvailable) ||
          !!customMarketplaceId
        }
        subtitle={customMarketplaceId ? '*Determined by Custom Marketplace selection above' : ''}
      >
        <GiftBudgetForm
          isLoading={isLoading}
          {...campaignBudget}
          currencySign={currencySign}
          campaignCurrencies={campaignCurrencies}
          errors={invitesErrors}
          onSave={handleBudgetSave}
          priceAvailability={priceAvailability}
          countryIds={getCampaignProp('countryIds')}
        />
      </SettingsItem>
      <MarketplaceGiftTypeRestrictions
        teamId={teamId}
        campaignId={campaignId}
        campaignType={campaignType}
        campaignName={campaignName}
        campaignLoading={isLoading}
        disabled={!!customMarketplaceId}
        subtitle={customMarketplaceId ? '*Determined by Custom Marketplace selection above' : ''}
      />
      <MarketplaceVendorsRestrictions
        campaignId={campaignId}
        campaignType={campaignType}
        campaignName={campaignName}
        campaignLoading={isLoading}
        disabled={!!customMarketplaceId}
        subtitle={customMarketplaceId ? '*Determined by Custom Marketplace selection above' : ''}
      />
      {campaignType === CAMPAIGN_TYPES.STANDARD && (
        <>
          <SettingsItem
            title="Gift invitation method"
            description={`Let us know what delivery methods this campaign is allowed use as a delivery method. ${campaignName} is currently set to`}
            isLoading={isGiftInvitationMethodsLoading}
            value={selectedGiftInvitationMethodNames || 'None'}
          >
            <>
              <GiftInvitationMethodsTable campaignId={campaignId} teamId={teamId} />
            </>
          </SettingsItem>
          {!hasBudgetFeaturesEnabled && (
            <GiftLimitsSettingsLoader
              campaignId={campaignId}
              render={({
                giftLimits,
                onChange,
                onSave,
                limitsIsLoading,
                handleSelectLimit,
                handleSelectAll,
                selectedUsers,
              }) => (
                <SettingsItem
                  title="Gift limits"
                  description={`Set how many gift invites each team member should be allowed to send through this campaign during a certain time period. ${campaignName} is currently set to`}
                  isLoading={limitsIsLoading}
                  value={(giftLimits && giftLimits.length && getGiftLimitString(giftLimits)) || ''}
                >
                  <Box mt={3}>
                    <GiftLimitsForm
                      giftLimits={giftLimits}
                      onChange={onChange}
                      onSave={onSave}
                      isLoading={limitsIsLoading}
                      onSelectUserLimit={handleSelectLimit}
                      onSelectAll={handleSelectAll}
                      selectedUsers={selectedUsers}
                      campaignId={campaignId}
                    />
                  </Box>
                </SettingsItem>
              )}
            />
          )}
        </>
      )}
      <SettingsItem
        title="Required actions"
        description={`Set the default required action fields for this campaign when a recipient accepts a gift. ${campaignName} currently has ${requiredActionsNames.length} defaults`}
        isLoading={isLoading}
        value={requiredActionsNames.length ? requiredActionsNames.join(', ') : 'None'}
      >
        <RequiredActionsForm
          actions={getCampaignProp('required_actions')}
          canOverrideActions={!!getCampaignProp('can_override_required_actions')}
          showCanOverrideActions={campaignType !== CAMPAIGN_TYPES.ACTIVATE}
          isLoading={isLoading}
          errors={invitesErrors}
          onSave={onSaveRequiredActions}
        />
      </SettingsItem>
      {campaignType === CAMPAIGN_TYPES.STANDARD && (
        <SettingsItem
          title="Gift expiration"
          description={`Tell us when the gift invite should expire after it has been delivered. ${campaignName} default is currently set to`}
          isLoading={isLoading}
          value={`${getCampaignProp('gift_expiration')} days`}
          disabled={!canOverrideGiftExpireSetting}
        >
          <GiftExpirationForm
            isLoading={isLoading}
            giftExpiration={getCampaignProp('gift_expiration') || 0}
            onSave={onSaveGiftExpiration}
          />
        </SettingsItem>
      )}
      <SettingsItem
        title="Gift Invitation Landing Page Video Link"
        description={`Embed a video on the gift invitation landing page for this campaign. This video will replace the personal message for all landing pages that are part of this campaign. ${campaignName} is currently set to`}
        isLoading={isLoading}
        value={videoLandingPageValue}
      >
        <GiftVideoMessageForm
          isLoading={isLoading}
          errors={invitesErrors}
          campaignId={campaignId}
          campaignName={campaignName}
          vidyardImage={getCustomisationProp('vidyard_image') || ''}
          vidyardVideo={getCustomisationProp('vidyard_video') || ''}
          allowOverride={getCampaignProp('can_override_recipient_video') || false}
          videoMessage={getCustomisationProp('recipient_video') || ''}
          type={getCustomisationProp('recipient_video_type')}
          onSave={onSaveGiftVideo}
        />
      </SettingsItem>
      <SettingsItem
        title="Post gift CTA"
        description={`Want to make it so this campaign has a CTA link after the recipient accepts their gift? ${campaignName} CTA link is currently set to`}
        isLoading={isLoading}
        value={redirectSettingsValue}
      >
        <GiftRedirectForm
          isLoading={isLoading}
          errors={invitesErrors}
          redirectUrl={getCustomisationProp('redirect_url') || ''}
          redirectHeader={getCustomisationProp('redirect_header') || ''}
          redirectBody={getCustomisationProp('redirect_message') || ''}
          redirectButton={getCustomisationProp('redirect_button') || ''}
          redirectConfirmed={getCustomisationProp('redirect_confirm') || false}
          onSave={onSaveGiftRedirect}
        />
      </SettingsItem>
    </>
  );
};

GiftInvitesSettings.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  campaignId: PropTypes.number.isRequired,
  campaign: campaignGiftInvitesSettingsShape,
  customisation: campaignGiftInvitesCustomisationSettingsShape,
  campaignType: PropTypes.string.isRequired,
  currency: campaignCurrencyShape,
  campaignCurrencies: PropTypes.arrayOf(campaignCurrencyShape).isRequired,
  campaignName: PropTypes.string,
  onSaveBudget: PropTypes.func.isRequired,
  onSaveRequiredActions: PropTypes.func.isRequired,
  onSaveGiftExpiration: PropTypes.func.isRequired,
  onSaveGiftRedirect: PropTypes.func.isRequired,
  onSaveGiftVideo: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  invitesErrors: PropTypes.object,
  teamId: PropTypes.number,
};

GiftInvitesSettings.defaultProps = {
  campaignName: '',
  campaign: null,
  customisation: null,
  currency: null,
  invitesErrors: {},
  teamId: null,
};

export default GiftInvitesSettings;
