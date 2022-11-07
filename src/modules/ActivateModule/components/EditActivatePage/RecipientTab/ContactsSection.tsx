import React, { memo, useCallback, useEffect, useState } from 'react';
import { Box, Link, Skeleton, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { Features, HasFeature } from '@alycecom/modules';
import { Button, Icon } from '@alycecom/ui';

import {
  getActivateCampaignSourceType,
  getIsContactsLoaded,
  getIsContactsLoading,
  getMarketoComputedUrl,
  getTotalContacts,
  loadContactsRequest,
  resetStatusMetaData,
  setContactsFilters,
} from '../../../store/steps/recipients/contacts';
import {
  closeContactsUploadingSidebar,
  getIsUploadingContactsSidebarOpened,
  openContactsUploadingSidebar,
} from '../../../store/ui/createPage/contactsSidebar';
import GiftingOnTheFly from '../../RecipientsStep/GiftingOnTheFly/GiftingOnTheFly';
import { OutdatedUploadRequestSourceTypes } from '../../../store/steps/recipients/uploadRequest/uploadRequest.types';
import { getIsPreApprovedClaimEnabled } from '../../../store/steps/details';
import ContactsUploadingSidebar from '../../RecipientsStep/ContactsUploadingSidebar';

import ContactsTable from './ContactsTable';
import AddSingleRecipientForm from './AddSingleRecipientForm';
import ContactsSearch from './ContactsSearch';

interface IContactsSectionProps {
  campaignId: number;
}

const ContactsSection = ({ campaignId }: IContactsSectionProps): JSX.Element => {
  const dispatch = useDispatch();

  const isPreApprovedClaimEnabled = useSelector(getIsPreApprovedClaimEnabled);
  const isLoading = useSelector(getIsContactsLoading);
  const total = useSelector(getTotalContacts);
  const sourceType = useSelector(getActivateCampaignSourceType);
  const computedUrl = useSelector(getMarketoComputedUrl);
  const isLoaded = useSelector(getIsContactsLoaded);

  const handleOpenSidebar = useCallback(() => dispatch(openContactsUploadingSidebar()), [dispatch]);
  const handleCloseSidebar = useCallback(() => dispatch(closeContactsUploadingSidebar()), [dispatch]);
  const isUploadingContactsSidebarOpened = useSelector(getIsUploadingContactsSidebarOpened);

  const [displayAddSingleRecipientControl, setDisplayAddSingleRecipientControl] = useState(false);

  useEffect(
    () => () => {
      dispatch(resetStatusMetaData());
    },
    [dispatch],
  );

  const loadContacts = useCallback(() => {
    dispatch(loadContactsRequest({ campaignId }));
  }, [dispatch, campaignId]);

  const onSearchChange = useCallback(
    (search: string) => {
      dispatch(setContactsFilters({ search }));
    },
    [dispatch],
  );

  const getSourceLabel = () => {
    if (sourceType === OutdatedUploadRequestSourceTypes.File || !sourceType) {
      return '';
    }

    if (sourceType === OutdatedUploadRequestSourceTypes.Eloqua) {
      return (
        <Box display="flex" alignItems="center">
          ,&nbsp;<Box>Eloqua list</Box>
        </Box>
      );
    }
    if (sourceType === OutdatedUploadRequestSourceTypes.HubSpot) {
      return (
        <Box display="flex" alignItems="center">
          ,&nbsp;<Box>HubSpot list</Box>
        </Box>
      );
    }
    const label =
      sourceType === OutdatedUploadRequestSourceTypes.MarketoStatic ? 'Marketo Static list' : 'Marketo Smart list';
    return (
      <Box display="flex" alignItems="center">
        ,&nbsp;<Box>{label}</Box>,&nbsp;
        {computedUrl && (
          <Link href={computedUrl} target="_blank">
            {computedUrl}
          </Link>
        )}
      </Box>
    );
  };

  const handleShowSingleRecipientForm = useCallback(() => {
    setDisplayAddSingleRecipientControl(!displayAddSingleRecipientControl);
  }, [displayAddSingleRecipientControl]);

  return (
    <Box pt={2}>
      <Box mb={3}>
        <Typography className="Body-Regular-Left-Static-Bold">Overview</Typography>
        {isLoading && <Skeleton width={200} height={25} />}
        {isLoaded && isPreApprovedClaimEnabled && (
          <Box display="flex">
            {total} approved recipients {getSourceLabel()}
          </Box>
        )}
        {!isPreApprovedClaimEnabled && <Box>none</Box>}
      </Box>

      <HasFeature featureKey={Features.FLAGS.GIFTING_ON_THE_FLY}>
        <Box mb={4}>
          <GiftingOnTheFly
            disabled={!isPreApprovedClaimEnabled}
            disabledReason={
              'To use this feature you need to select the "add pre-approved recipients" option on the Details step.'
            }
          />
        </Box>
      </HasFeature>

      {isPreApprovedClaimEnabled && (
        <>
          <ContactsSearch onChange={onSearchChange} />
          <ContactsTable onLoadMore={loadContacts} />
        </>
      )}

      {displayAddSingleRecipientControl && (
        <AddSingleRecipientForm campaignId={campaignId} onCancel={handleShowSingleRecipientForm} />
      )}

      {isPreApprovedClaimEnabled && (
        <>
          <Box display="flex" mb={2}>
            <Button variant="text" startIcon={<Icon icon="file-upload" color="inherit" />} onClick={handleOpenSidebar}>
              Upload recipient list
            </Button>
            <Box ml={2}>
              <Button
                variant="text"
                startIcon={<Icon icon="plus" color="inherit" />}
                disabled={displayAddSingleRecipientControl}
                onClick={handleShowSingleRecipientForm}
              >
                Add single recipient
              </Button>
            </Box>
          </Box>

          <ContactsUploadingSidebar isOpen={isUploadingContactsSidebarOpened} onClose={handleCloseSidebar} />
        </>
      )}
    </Box>
  );
};

export default memo(ContactsSection);
