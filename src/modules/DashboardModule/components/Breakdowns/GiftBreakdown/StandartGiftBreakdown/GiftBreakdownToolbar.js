import React, { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { SearchField, ActionsMenu, Icon, ModalConfirmationMessage } from '@alycecom/ui';
import { TrackEvent } from '@alycecom/services';
import { makeStyles } from '@mui/styles';
import { Box, Grid, Typography } from '@mui/material';
import { CreateGift } from '@alycecom/modules';
import { useUrlQuery } from '@alycecom/hooks';

import {
  getGiftsCountFromTransferSelection,
  getGiftsFromTransferSelection,
} from '../../../../store/breakdowns/giftTransfer/giftTransfer.selectors';
import {
  giftDisableRequest,
  giftExpireRequest,
  giftUnExpireRequest,
  openGiftTransferSidebar,
} from '../../../../store/breakdowns/giftTransfer/giftTransfer.actions';

const { giftStatuses } = CreateGift.constants;

const useStyles = makeStyles(({ palette, spacing }) => ({
  giftCounter: {
    whiteSpace: 'nowrap',
  },
  filtersButton: {
    width: '100%',
    height: '48px',
    boxShadow: 'none',
    padding: spacing(1, 3),
    color: palette.link.main,
    backgroundColor: 'transparent',
    border: `1px solid #c4c4c4`,
    '&:hover': {
      backgroundColor: palette.grey.A200,
    },
  },
  filtersIcon: {
    marginRight: spacing(1),
  },
  actionButton: {
    minWidth: 130,
    minHeight: 48,
    color: palette.link.main,
    height: '100%',
  },
  root: {
    width: 500,
    borderTop: `4px solid ${palette.secondary.main}`,
  },
  avatar: {
    backgroundColor: palette.secondary.main,
  },
  submitButton: {
    backgroundColor: palette.secondary.main,
  },
}));

const GiftBreakdownToolbar = ({ placeholder, search, onSearch, teamId, campaignId, memberId }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { trackEvent } = TrackEvent.useTrackEvent();
  const selectedGiftsCount = useSelector(getGiftsCountFromTransferSelection);
  const selectedGifts = useSelector(getGiftsFromTransferSelection);

  const [isOpenConfirm, setIsOpenConfirm] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState('');
  const [confirmActionTitle, setConfirmActionTitle] = useState('');
  const [confirmMessage, setConfirmMessage] = useState('');
  const { dateRangeFrom, dateRangeTo, giftSort: sort, giftDirection: sortDirection, giftPage: page } = useUrlQuery([
    'dateRangeFrom',
    'dateRangeTo',
    'giftSort',
    'giftDirection',
    'giftSearch',
    'giftPage',
  ]);

  const giftParams = useMemo(
    () => ({
      teamId,
      campaignId,
      memberId,
      dateRangeFrom,
      dateRangeTo,
      sort,
      sortDirection,
      search,
      page,
    }),
    [teamId, campaignId, memberId, dateRangeFrom, dateRangeTo, sort, sortDirection, search, page],
  );

  const handleMoveGifts = useCallback(() => {
    trackEvent('Gift breakdown bulk action - clicked', { actionName: 'move', giftsCount: selectedGiftsCount });
    dispatch(openGiftTransferSidebar());
  }, [trackEvent, dispatch, selectedGiftsCount]);

  const submitExpireGifts = useCallback(() => {
    trackEvent('Gift breakdown bulk action - clicked', { actionName: 'expire', giftsCount: selectedGiftsCount });
    const giftIds = selectedGifts.map(gift => gift.id);
    dispatch(giftExpireRequest({ ...giftParams, giftIds }));
  }, [trackEvent, selectedGiftsCount, selectedGifts, dispatch, giftParams]);

  const handleExpireGifts = useCallback(() => {
    setConfirmActionTitle('Expire');
    setConfirmTitle(`Expire ${selectedGiftsCount} gift(s)`);
    setConfirmMessage('This action will prevent recipients to access gift links.');
    setIsOpenConfirm(true);
  }, [selectedGiftsCount]);

  const handleUnexpireGifts = useCallback(() => {
    trackEvent('Gift breakdown bulk action - clicked', { actionName: 'unexpire', giftsCount: selectedGifts.length });
    const giftIds = selectedGifts.map(gift => gift.id);
    dispatch(giftUnExpireRequest({ ...giftParams, giftIds }));
  }, [trackEvent, selectedGifts, dispatch, giftParams]);

  const submitDisableGifts = useCallback(() => {
    trackEvent('Gift breakdown bulk action - clicked', { actionName: 'disable', giftsCount: selectedGiftsCount });
    const giftIds = selectedGifts.map(gift => gift.id);
    dispatch(giftDisableRequest({ ...giftParams, giftIds }));
  }, [trackEvent, selectedGiftsCount, selectedGifts, dispatch, giftParams]);

  const handleDisabledGifts = useCallback(() => {
    // /api/v1/gifts/bulk/disable:
    setConfirmActionTitle('Disable');
    setConfirmTitle(`Disable ${selectedGiftsCount} gift(s)`);
    setConfirmMessage('This action will prevent users to send selected gifts.');
    setIsOpenConfirm(true);
  }, [selectedGiftsCount]);

  const isDisableExpire = useMemo(
    () =>
      selectedGifts.filter(
        gift =>
          ![giftStatuses.WAITING_GIFT_INVITATION, giftStatuses.GIFT_EMAIL_SENT, giftStatuses.GIFT_ACCESSED].includes(
            gift.giftStatusId,
          ),
      ).length > 0,
    [selectedGifts],
  );

  const isDisableUnExpire = useMemo(
    () => selectedGifts.filter(gift => gift.giftStatusId !== giftStatuses.EXPIRED).length > 0,
    [selectedGifts],
  );

  const isDisableDisable = useMemo(
    () =>
      selectedGifts.filter(
        gift =>
          ![
            giftStatuses.GIFT_CREATED,
            giftStatuses.NEED_MORE_INFO,
            giftStatuses.REVIEW,
            giftStatuses.PRODUCTS_PROPOSED,
            giftStatuses.SCHEDULED,
            giftStatuses.WAITING_GIFT_INVITATION,
          ].includes(gift.giftStatusId),
      ).length > 0,
    [selectedGifts],
  );

  const tooltip = !selectedGiftsCount ? 'Select at least one gift' : null;
  const giftLabel = selectedGiftsCount > 1 ? 'gifts' : 'gift';

  const menuItems = useMemo(
    () => [
      {
        id: 'expire',
        text: `Expire ${giftLabel}`,
        action: handleExpireGifts,
        tooltip: isDisableExpire ? 'Only pending gifts may be expired' : tooltip,
        dataTestId: 'GiftBreakdown.Actions.Expire',
        disabled: isDisableExpire || !selectedGiftsCount,
      },
      {
        id: 'unexpire',
        text: `Unexpire ${giftLabel}`,
        action: handleUnexpireGifts,
        dataTestId: 'GiftBreakdown.Actions.Unexpire',
        tooltip: isDisableUnExpire ? 'Only expired gifts may be un-expired' : tooltip,
        disabled: isDisableUnExpire || !selectedGiftsCount,
      },
      {
        id: 'move',
        text: `Move ${giftLabel}`,
        action: handleMoveGifts,
        dataTestId: 'GiftBreakdown.Actions.Move',
        tooltip,
        disabled: !selectedGiftsCount,
      },
      {
        id: 'disabled',
        text: `Disable ${giftLabel}`,
        action: handleDisabledGifts,
        tooltip: isDisableDisable ? 'Only unsent gifts may be disabled' : tooltip,
        dataTestId: 'GiftBreakdown.Actions.Disable',
        disabled: isDisableDisable || !selectedGiftsCount,
      },
    ],
    [
      tooltip,
      handleExpireGifts,
      isDisableExpire,
      handleUnexpireGifts,
      isDisableUnExpire,
      handleMoveGifts,
      handleDisabledGifts,
      isDisableDisable,
      selectedGiftsCount,
      giftLabel,
    ],
  );

  const handleDiscard = useCallback(() => {
    setIsOpenConfirm(false);
  }, []);

  const handleConfirm = useCallback(() => {
    if (confirmActionTitle === 'Disable') {
      submitDisableGifts();
    }
    if (confirmActionTitle === 'Expire') {
      submitExpireGifts();
    }
    setIsOpenConfirm(false);
  }, [confirmActionTitle, submitDisableGifts, submitExpireGifts]);

  return (
    <Grid container direction="row" wrap="nowrap">
      <SearchField placeholder={placeholder} value={search} onChange={onSearch} />
      <Box ml={10} display="flex" justify="flex-end" alignItems="center">
        {Boolean(selectedGiftsCount) && (
          <Typography className={classes.giftCounter}>
            {selectedGiftsCount} gift{selectedGiftsCount === 1 ? '' : 's'} selected
          </Typography>
        )}
        <Box ml={2} onClick={() => {}}>
          <ActionsMenu
            ActionButtonProps={{
              classes: { root: classes.actionButton },
              endIcon: <Icon icon="chevron-down" />,
            }}
            menuItems={menuItems}
            menuData={selectedGifts}
          />
        </Box>
      </Box>
      <ModalConfirmationMessage
        title={confirmTitle}
        icon="question-circle"
        submitButtonText={confirmActionTitle}
        cancelButtonText="Cancel"
        width="100%"
        isOpen={isOpenConfirm}
        onSubmit={handleConfirm}
        onDiscard={handleDiscard}
        customClasses={classes}
      >
        <Typography>{confirmMessage}</Typography>
      </ModalConfirmationMessage>
    </Grid>
  );
};

GiftBreakdownToolbar.propTypes = {
  placeholder: PropTypes.string,
  search: PropTypes.string,
  onSearch: PropTypes.func.isRequired,
  campaignId: PropTypes.number,
  teamId: PropTypes.number,
  memberId: PropTypes.number,
};

GiftBreakdownToolbar.defaultProps = {
  placeholder: '',
  search: '',
  teamId: null,
  campaignId: null,
  memberId: null,
};

export default GiftBreakdownToolbar;
