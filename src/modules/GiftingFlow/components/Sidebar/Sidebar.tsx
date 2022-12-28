import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Drawer } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useSetUrlQuery, useUrlQuery } from '@alycecom/hooks';
import { AlyceTheme } from '@alycecom/ui';
import {
  TCampaign,
  CampaignType,
  appApi,
  ProspectingBatchesTagType,
  CampaignsApiTag,
  TCampaignSort,
} from '@alycecom/services';
import { useDispatch, useSelector } from 'react-redux';
import {
  ContactDetails,
  CreateGift,
  Features,
  GiftingFlow,
  useMarketplaceCountryEffect,
  User,
} from '@alycecom/modules';
import classNames from 'classnames';
import { SortDirection } from '@alycecom/utils';

import { getProfile, getProfileIsLoading } from '../../../../store/contact/profile/profile.selectors';
import { getStateUpdatedTimeState } from '../../../../store/common/stateUpdatedTime/stateUpdatedTime.selectors';
import { getContactCountryId } from '../../../../store/contact/contact.selectors';
import { useRecipientAnywhere } from '../../../../hooks/useRecipientAnywhere';
import { tabsKeys } from '../../../../constants/sidebarTabs.constants';
import { profileLoadRequest, resetProfile } from '../../../../store/contact/profile/profile.actions';
import {
  useTrackAddContactSidebarEffect,
  useTrackBulkSidebarEffect,
  useTrackGiftingSidebarEffect,
} from '../../../../hooks/useTrackSidebar';
import { IProfile } from '../../../../store/contact/profile/profileCompatibility.types';
import GiftingFlowModule from '../GiftingFlow';
import OneToOneSidebarHeader from '../OneToOneSidebarHeader';
import SelectCampaignSidebarHeader from '../SelectCampaignSidebarHeader';
import ContactHistory from '../ContactHistory';
import BulkCreateContacts from '../../../../components/BulkCreateContacts/BulkCreateContacts';
import { GiftingFlowType } from '../../types/giftingFlow.types';

const initialWidth = 600;
const largeWidth = 1200;
const useStyles = makeStyles<AlyceTheme, { width: number }>(() => ({
  root: {
    width: ({ width = initialWidth }) => width,
    display: 'flex',
    flexDirection: 'column',
  },
  container: {
    height: '100vh',
    overflow: 'hidden',
    transition: 'width .2s ease-out',
    display: 'flex',
    flexDirection: 'column',
  },
  sidebarBody: {
    overflow: 'auto',
    height: 'calc(100vh - 70px)',
  },
  sidebarBodyWithTabs: {
    height: 'calc(100vh - 140px)',
  },
  sidebarBodyProspectingFlow: {
    flex: '1 1 auto',
  },
}));

export interface ISidebarProps {
  teamId: number;
}

const Sidebar = ({ teamId }: ISidebarProps): JSX.Element => {
  const classes = useStyles({ width: 600 });

  const {
    sidebarTab,
    contactId = '',
    campaignId = '',
    enrichmentId = '',
    giftId = '',
    memberId = '',
    dateRangeFrom,
    dateRangeTo,
    flowType,
    batchId: urlBatchId,
  } = useUrlQuery([
    'sidebarTab',
    'contactId',
    'campaignId',
    'enrichmentId',
    'memberId',
    'giftId',
    'dateRangeFrom',
    'dateRangeTo',
    'flowType',
    'batchId',
  ]);
  const setUrlQuery = useSetUrlQuery();

  const dispatch = useDispatch();
  const profile = useSelector(getProfile) as IProfile;
  const isLoading = useSelector(getProfileIsLoading) as boolean;
  const user = useSelector(User.selectors.getUser);
  const forceReloadTimestamp = useSelector(getStateUpdatedTimeState);
  const countryId = useSelector(getContactCountryId);

  const hasInternational = useSelector(
    useMemo(() => Features.selectors.hasFeatureFlag(Features.FLAGS.INTERNATIONAL), []),
  );

  const hasBudgetManagementLimit = useSelector(
    Features.selectors.hasFeatureFlag(Features.FLAGS.BUDGET_MANAGEMENT_LIMIT),
  );
  const hasBudgetManagementSetup = useSelector(
    Features.selectors.hasFeatureFlag(Features.FLAGS.BUDGET_MANAGEMENT_SETUP),
  );
  const hasBudgetFeaturesEnabled = hasBudgetManagementLimit && hasBudgetManagementSetup;

  useMarketplaceCountryEffect(countryId);

  const [sidebarWidth, setSidebarWidth] = useState(initialWidth);

  const isOpen = Boolean(contactId || sidebarTab);
  const recipient = useRecipientAnywhere();

  const hasContact = Boolean(contactId);
  const hasGift = Boolean(giftId);
  const hasEnrichment = Boolean(enrichmentId);
  const hasCampaign = Boolean(campaignId);
  const isSendGiftTab = sidebarTab === tabsKeys.SEND_GIFT;
  const showBulkCreateContacts = sidebarTab === tabsKeys.BULK_CREATE_CONTACTS;

  const isOneToOneFlow = isOpen && hasCampaign && flowType === GiftingFlowType.OneToOne;
  const isProspectingFlow = isOpen && flowType === GiftingFlowType.Prospecting;

  const showCampaignsList =
    isOpen && !hasCampaign && !hasContact && !hasGift && !hasEnrichment && !showBulkCreateContacts && !urlBatchId;
  const showCreateContact = isOneToOneFlow && !showBulkCreateContacts && !hasContact && !hasGift && !hasEnrichment;
  const showResearchContact = isOneToOneFlow && hasContact && hasEnrichment && !hasGift;
  const showCreateGift =
    isOneToOneFlow && !showBulkCreateContacts && isSendGiftTab && hasContact && !hasGift && !hasEnrichment;
  const showSendGift = isSendGiftTab && hasContact && hasGift;

  const parsedCampaignId = parseInt(campaignId, 10);
  const parsedContactId = parseInt(contactId, 10);
  const parsedMemberId = parseInt(memberId, 10);

  const hasSidebarTabs = !showCreateContact && !showResearchContact;
  const isOneToOneSidebarVisible = !showCampaignsList && !isProspectingFlow;

  useEffect(() => {
    if (contactId || giftId) {
      dispatch(profileLoadRequest({ contactId, giftId }));
    }
  }, [contactId, dispatch, forceReloadTimestamp, giftId]);

  useTrackBulkSidebarEffect(showBulkCreateContacts);
  useTrackAddContactSidebarEffect(showCreateContact);
  useTrackGiftingSidebarEffect(sidebarTab, giftId);

  useEffect(() => {
    if (sidebarTab === tabsKeys.PROFILE && giftId) {
      dispatch(profileLoadRequest({ giftId }));
    }
  }, [sidebarTab, giftId, dispatch, contactId]);

  useEffect(() => {
    if (profile.isUnsubscribed && sidebarTab === tabsKeys.SEND_GIFT) {
      setUrlQuery({ sidebarTab: tabsKeys.PROFILE });
    }
  }, [profile, sidebarTab, setUrlQuery]);

  const isPreviewStep = useSelector(GiftingFlow.selectors.getIsCreateBatchStepContactsPreview);
  useEffect(() => {
    const width = isPreviewStep ? largeWidth : initialWidth;
    setSidebarWidth(width);
  }, [isPreviewStep]);

  const goToHistory = useCallback(() => setUrlQuery({ sidebarTab: tabsKeys.HISTORY }), [setUrlQuery]);
  const goToSend = useCallback(() => setUrlQuery({ sidebarTab: tabsKeys.SEND_GIFT }), [setUrlQuery]);
  const goToProfile = useCallback(() => setUrlQuery({ sidebarTab: tabsKeys.PROFILE }), [setUrlQuery]);
  const goBack = useCallback(() => setUrlQuery({ sidebarTab: tabsKeys.SEND_GIFT }), [setUrlQuery]);
  const handleCreate = useCallback(createdGiftId => setUrlQuery({ giftId: createdGiftId }), [setUrlQuery]);
  const handleSendCampaignGift = useCallback(
    giftCampaignId => setUrlQuery({ campaignId: giftCampaignId, contactId: null, giftId: null }),
    [setUrlQuery],
  );
  const handleCreateContact = useCallback(
    ({ id, enrichment_id: newEnrichmentId }) => {
      dispatch(resetProfile());
      setUrlQuery({ contactId: id, enrichmentId: newEnrichmentId, sidebarTab: tabsKeys.SEND_GIFT });
    },
    [setUrlQuery, dispatch],
  );
  const handleBulkCreateContacts = useCallback(() => setUrlQuery({ sidebarTab: tabsKeys.BULK_CREATE_CONTACTS }), [
    setUrlQuery,
  ]);
  const handleEnrichmentFinished = useCallback(() => {
    setUrlQuery({ contactId, sidebarTab: tabsKeys.SEND_GIFT, enrichmentId: null });
  }, [contactId, setUrlQuery]);
  const handleTrySearchContact = useCallback(
    () => setUrlQuery({ contactId: null, giftId: null, enrichmentId: null, sidebarTab: tabsKeys.SEND_GIFT }),
    [setUrlQuery],
  );

  const handleClose = useCallback(() => {
    setUrlQuery({
      contactId: null,
      giftId: null,
      sidebarTab: null,
      enrichmentId: null,
      campaignId: null,
      giftStatusId: null,
      flowType: null,
      batchId: null,
    });
  }, [setUrlQuery]);

  const handleCloseSidebar = useCallback(() => {
    handleClose();
    dispatch(GiftingFlow.actions.resetGiftingFlowState());
    dispatch(appApi.util.invalidateTags([{ type: ProspectingBatchesTagType.Batch, id: Number(urlBatchId) }]));
    dispatch(appApi.util.invalidateTags([{ type: CampaignsApiTag.Campaign, id: Number(campaignId) }]));
  }, [handleClose, dispatch, urlBatchId, campaignId]);

  const handleSelectCampaign = useCallback(
    (campaign: TCampaign) => {
      const flowTypeValue =
        campaign.type === CampaignType.Prospecting ? GiftingFlowType.Prospecting : GiftingFlowType.OneToOne;
      setUrlQuery({ campaignId: campaign.id, flowType: flowTypeValue });
    },
    [setUrlQuery],
  );

  const userDetails = useMemo(
    () => ({
      id: user.id,
      fullName: `${user.firstName} ${user.lastName}`,
      firstName: user.firstName,
      lastName: user.lastName,
      company: user.company,
      avatar: user.avatar,
      countryId: user.countryId,
      orgName: user.organisation.name,
      orgId: user.organisation.id,
      timezone: user.timezone,
    }),
    [user],
  );

  const contact = useMemo(
    () => ({
      id: recipient.id,
      firstName: recipient.firstName,
      lastName: recipient.lastName,
      email: recipient.email,
    }),
    [recipient],
  );

  const sendGiftModuleSettings = useMemo(
    () => ({
      user: userDetails,
      vidyardClientId: window.APP_CONFIG.vidyardClientId,
      dashboardHost: window.APP_CONFIG.dashboardHost,
      apiHost: window.APP_CONFIG.apiHost,
    }),
    [userDetails],
  );

  const selectCampaignMultisort: TCampaignSort[] = useMemo(
    () => [
      {
        field: 'isFavourite',
        direction: SortDirection.desc,
      },
      hasBudgetFeaturesEnabled
        ? { field: 'insufficientBudget', direction: SortDirection.asc }
        : { field: 'giftsLimit', direction: SortDirection.desc },
      { field: 'name', direction: SortDirection.asc },
    ],
    [hasBudgetFeaturesEnabled],
  );

  const handleOpenBatch = useCallback(
    (batchId: number) => {
      setUrlQuery({ batchId, flowType: GiftingFlowType.Prospecting });
    },
    [setUrlQuery],
  );

  return (
    <Drawer disableEnforceFocus open={isOpen} anchor="right" onClose={handleCloseSidebar}>
      <Box className={classes.container} width={sidebarWidth}>
        {showCampaignsList && <SelectCampaignSidebarHeader onClose={handleCloseSidebar} />}
        {isOneToOneSidebarVisible && (
          <OneToOneSidebarHeader isTabsVisible={hasSidebarTabs} onClose={handleCloseSidebar} />
        )}
        <Box
          className={classNames(classes.sidebarBody, {
            [classes.sidebarBodyWithTabs]: hasSidebarTabs,
            [classes.sidebarBodyProspectingFlow]: !isOneToOneSidebarVisible,
          })}
        >
          {showCampaignsList && (
            <GiftingFlow.SelectCampaign
              filters={{
                types: [CampaignType.One2One, CampaignType.Prospecting],
                multisort: selectCampaignMultisort,
              }}
              onSelect={handleSelectCampaign}
              onOpenBatch={handleOpenBatch}
            />
          )}
          {isProspectingFlow && <GiftingFlowModule onClose={handleCloseSidebar} />}
          {!showCreateContact && (
            <>
              {sidebarTab === tabsKeys.PROFILE && (
                <ContactDetails.ContactProfile
                  handleGiftViewHistory={goToHistory}
                  handleGiftCreate={goToSend}
                  isLoading={isLoading}
                  profile={profile}
                  user={userDetails}
                />
              )}
              {sidebarTab === tabsKeys.HISTORY && (
                <ContactHistory
                  contactId={parsedContactId}
                  dateRangeFrom={dateRangeFrom}
                  dateRangeTo={dateRangeTo}
                  teamId={teamId}
                  campaignId={parsedCampaignId}
                  memberId={parsedMemberId}
                />
              )}
              {showCreateGift && (
                <CreateGift.CreateGiftModule
                  contactId={parsedContactId}
                  defaultCampaignId={parsedCampaignId}
                  user={userDetails}
                  settings={{ apiHost: window.APP_CONFIG.apiHost }}
                  onCreate={handleCreate}
                  onClose={handleClose}
                />
              )}
              {showSendGift && (
                <CreateGift.SendGiftModule
                  giftId={giftId}
                  onClose={handleClose}
                  contact={profile}
                  onNeedMoreInfo={goToProfile}
                  onSendCampaignGift={handleSendCampaignGift}
                  settings={sendGiftModuleSettings}
                  profileName={profile.firstName}
                />
              )}
            </>
          )}
          {showCreateContact && (
            <CreateGift.CreateContactModule
              user={userDetails}
              campaignId={parsedCampaignId}
              hasInternational={hasInternational}
              onCreate={handleCreateContact}
              onBulkCreate={handleBulkCreateContacts}
              onClose={handleClose}
            />
          )}
          {showResearchContact && (
            <CreateGift.ContactEnrichmentModule
              enrichmentId={parseInt(enrichmentId, 10)}
              onEnrichmentFinished={handleEnrichmentFinished}
              onTrySearchContactAgain={handleTrySearchContact}
              contact={contact}
            />
          )}
          {showBulkCreateContacts && (
            <BulkCreateContacts
              goBack={goBack}
              onClose={handleClose}
              initialWidth={initialWidth}
              onWidthSet={setSidebarWidth}
              campaignId={parsedCampaignId}
            />
          )}
        </Box>
        <GiftingFlow.StepperFooterContainer />
      </Box>
    </Drawer>
  );
};

export default memo(Sidebar);
