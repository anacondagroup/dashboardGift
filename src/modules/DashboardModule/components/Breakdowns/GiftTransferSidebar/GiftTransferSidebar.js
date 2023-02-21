import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@mui/styles';
import { Box, Drawer, Typography } from '@mui/material';
import { SidebarHeader as HeaderTopBar } from '@alycecom/ui';

import giftingFlowImage from '../../../../../assets/images/contact-details-top-bar.svg';
import {
  getGiftsCountFromTransferSelection,
  getGiftTransferId,
  getGiftTransferSidebarState,
} from '../../../store/breakdowns/giftTransfer/giftTransfer.selectors';
import { closeGiftTransferSidebar } from '../../../store/breakdowns/giftTransfer/giftTransfer.actions';

import TransferringProgress from './TransferringProcess/TransferringProcess';
import SelectCampaign from './SelectCampaign/SelectCampaign';
import ConfirmChangesAndMoveGift from './ConfirmChangesAndMoveGift/ConfirmChangesAndMoveGift';

const WIDTH = 400;

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  paper: {
    padding: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  container: {
    width: WIDTH,
    padding: theme.spacing(2),
  },
  goBackButton: {
    margin: `0 ${theme.spacing(2)}`,
  },
  title: {
    color: theme.palette.common.white,
    fontSize: 20,
    width: 250,
    lineHeight: 1.25,
  },
  button: {
    boxShadow: 'none',
  },
}));

const GiftTransferSidebar = ({ teamId, campaignId }) => {
  const isSidebarOpen = useSelector(getGiftTransferSidebarState);
  const transferringId = useSelector(getGiftTransferId);
  const selectedGiftsCount = useSelector(getGiftsCountFromTransferSelection);

  const dispatch = useDispatch();
  const classes = useStyles();
  const [selectedCampaign, setCampaign] = useState(undefined);
  const handleBackToSelectCampaign = useCallback(value => {
    setCampaign(value);
  }, []);

  const onCloseSidebar = useCallback(() => {
    dispatch(closeGiftTransferSidebar());
  }, [dispatch]);

  const giftLabel = selectedGiftsCount > 1 ? 'these gifts' : 'this gift';

  return (
    <Drawer open={isSidebarOpen} anchor="right" onClose={onCloseSidebar}>
      <Box>
        <HeaderTopBar onClose={onCloseSidebar} bgTheme="green-gradient" bgImage={giftingFlowImage}>
          <Typography className={classes.title}>Let&apos;s move {giftLabel} to another campaign</Typography>
        </HeaderTopBar>
      </Box>
      {!transferringId && (
        <Box className={classes.container}>
          {!selectedCampaign && (
            <SelectCampaign classes={classes} onSelect={setCampaign} teamId={teamId} campaignId={campaignId} />
          )}
          {selectedCampaign && (
            <ConfirmChangesAndMoveGift
              classes={classes}
              goBack={handleBackToSelectCampaign}
              campaign={selectedCampaign}
            />
          )}
        </Box>
      )}
      {transferringId && (
        <Box className={classes.container}>
          <TransferringProgress classes={classes} transferringId={transferringId} />
        </Box>
      )}
    </Drawer>
  );
};

GiftTransferSidebar.propTypes = {
  teamId: PropTypes.number.isRequired,
  campaignId: PropTypes.number,
};

GiftTransferSidebar.defaultProps = {
  campaignId: undefined,
};

export default GiftTransferSidebar;
