import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { ContactDetails, UnsubscribedErrorMessage } from '@alycecom/modules';
import { useSetUrlQuery } from '@alycecom/hooks';
import { Grid, CircularProgress, Box } from '@mui/material';

import { historyLoadRequest } from '../../../../store/contact/history/history.actions';
import { getGifts, getHistoryIsLoading } from '../../../../store/contact/history/history.selectors';
import { getProfile } from '../../../../store/contact/profile/profile.selectors';
import { tabsKeys } from '../../../../constants/sidebarTabs.constants';
import { IProfile } from '../../../../store/contact/profile/profileCompatibility.types';
import { TGiftHistoryItem } from '../../../../store/contact/history/giftHistoryCompatibility.types';

export interface IContactHistoryProps {
  contactId?: number;
  teamId: number;
  campaignId: number;
  dateRangeFrom: string;
  dateRangeTo: string;
  memberId?: number;
}

const styles = {
  loaderWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
} as const;

const ContactHistory = ({
  contactId,
  teamId,
  campaignId,
  dateRangeFrom,
  dateRangeTo,
  memberId,
}: IContactHistoryProps): JSX.Element => {
  const dispatch = useDispatch();

  const isLoading = useSelector(getHistoryIsLoading) as boolean;
  const profile = useSelector(getProfile) as IProfile;
  const gifts = useSelector(getGifts) as TGiftHistoryItem[];

  useEffect(() => {
    // member id does not make sense without tied team
    const needTeam = !!memberId;

    if (needTeam && teamId) {
      dispatch(historyLoadRequest({ contactId, teamId, campaignId, dateRangeFrom, dateRangeTo, memberId }));
    }

    if (!needTeam) {
      dispatch(historyLoadRequest({ contactId, teamId, campaignId, dateRangeFrom, dateRangeTo, memberId }));
    }
  }, [contactId, teamId, campaignId, dateRangeFrom, dateRangeTo, memberId, dispatch]);

  const updateUrlFunc = useSetUrlQuery();

  return (
    <Grid>
      {isLoading ? (
        <Box sx={styles.loaderWrapper}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {profile.isUnsubscribed && <UnsubscribedErrorMessage />}
          {gifts.map(gift => (
            <ContactDetails.GiftsHistoryListItem
              canUseGiftCreateFlow={!profile.isUnsubscribed}
              hideStatuses={gifts.length > 1}
              key={gift.id}
              gift={gift}
              name={profile.firstName}
              email={profile.email}
              onViewGiftDetails={() => updateUrlFunc({ giftId: gift.id, sidebarTab: tabsKeys.SEND_GIFT })}
            />
          ))}
        </>
      )}
    </Grid>
  );
};

ContactHistory.propTypes = {
  contactId: PropTypes.string.isRequired,
  teamId: PropTypes.number,
  campaignId: PropTypes.string,
  dateRangeFrom: PropTypes.string,
  dateRangeTo: PropTypes.string,
  memberId: PropTypes.string,
};

ContactHistory.defaultProps = {
  teamId: null,
  memberId: null,
  campaignId: null,
  dateRangeFrom: null,
  dateRangeTo: null,
};

export default ContactHistory;
