import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { DashboardIcon, FlatButton } from '@alycecom/ui';
import { Box, Paper, Slide, Button, Divider } from '@mui/material';

import { apiService } from '../../../../../../store/configureStore';
import { getGiftsFromTransferSelection } from '../../../../store/breakdowns/giftTransfer/giftTransfer.selectors';
import { giftTransferringRequest } from '../../../../store/breakdowns/giftTransfer/giftTransfer.actions';

import SettingsGiftDiffs from './GiftDiffs/SettingsGiftDiffs';
import SenderGiftDiffs from './GiftDiffs/SenderGiftDiffs';

const ConfirmChangesAndMoveGift = ({ classes, campaign, goBack }) => {
  const dispatch = useDispatch();
  const giftIds = useSelector(getGiftsFromTransferSelection);
  const [senderDiffs, setSenderDiffs] = useState(undefined);
  const [settingsDiffs, setSettingsDiffs] = useState(undefined);
  const [isOpenSenderDiffs, setIsOpenSenderDiffs] = useState(false);
  const [isOpenSettingsDiffs, setIsOpenSettingsDiffs] = useState(false);

  useEffect(() => {
    apiService
      .post(`/enterprise/dashboard/gifts/transition/differences`, {
        body: {
          gift_ids: giftIds.map(({ id }) => id),
          target_campaign_id: campaign.id,
        },
      })
      .subscribe(response => {
        const { sender_differences: senderDifferences, settings_differences: settingsDifferences } = response;
        if (!Array.isArray(senderDifferences)) {
          setSenderDiffs(senderDifferences);
        }
        if (!Array.isArray(settingsDifferences)) {
          setSettingsDiffs(settingsDifferences);
        }
      });
  }, [campaign, giftIds]);

  const handleConfirm = useCallback(() => {
    dispatch(giftTransferringRequest({ giftIds: giftIds.map(({ id }) => id), targetCampaignId: campaign.id }));
  }, [dispatch, giftIds, campaign]);

  return (
    <Slide in={!!campaign} direction="left">
      <Box>
        <Box className={classes.goBackButton}>
          <FlatButton icon="arrow-left" onClick={() => goBack()}>
            Back to choose campaign
          </FlatButton>
        </Box>
        <Paper square className={classes.paper}>
          <Box className="H4-Chambray">One last thing...</Box>
          <Box mt={1} mb={3} className="Body-Regular-Left-Inactive">
            There’s a few things we need you to look at before we move these gifts to “{campaign.name}”. Please review
            below:
          </Box>
          {senderDiffs && (
            <>
              <Divider />
              <Box mt={3} display="flex">
                <Box width="40px">
                  <DashboardIcon icon="exchange" style={{ cursor: 'default' }} />
                </Box>
                <Box width="100%">
                  <Box className="Body-Medium-Static">{senderDiffs.original.length} gifts will be reassigned</Box>
                  <Box mt={1} className="Body-Small-Inactive">
                    These gifts are assigned to team member(s) that don’t have gift invites in {campaign.name}. They
                    will be automatically assigned to the campaign owner - {senderDiffs.target.sender_full_name}.
                  </Box>
                  {isOpenSenderDiffs && <SenderGiftDiffs diffs={senderDiffs} />}
                  <Box mt={1}>
                    <FlatButton
                      icon={!isOpenSenderDiffs ? 'eye' : 'eye-slash'}
                      onClick={() => setIsOpenSenderDiffs(!isOpenSenderDiffs)}
                    >
                      {!isOpenSenderDiffs ? 'View changes' : 'Hide changes'}
                    </FlatButton>
                  </Box>
                </Box>
              </Box>
            </>
          )}
          {settingsDiffs && (
            <>
              <Divider />
              <Box mt={3} display="flex">
                <Box width="40px">
                  <DashboardIcon icon="exchange" style={{ cursor: 'default' }} />
                </Box>
                <Box width="100%">
                  <Box className="Body-Medium-Static">
                    {settingsDiffs.original && settingsDiffs.original.length} gifts will have different settings
                  </Box>
                  <Box mt={1} className="Body-Small-Inactive">
                    These gifts have incompatible campaign settings to {campaign.name}. They will be automatically
                    updated to reflect the new campaign restrictions.
                  </Box>
                  {isOpenSettingsDiffs && <SettingsGiftDiffs diffs={settingsDiffs} campaignName={campaign.name} />}
                  <Box mt={1}>
                    <FlatButton
                      icon={!isOpenSettingsDiffs ? 'eye' : 'eye-slash'}
                      onClick={() => setIsOpenSettingsDiffs(!isOpenSettingsDiffs)}
                    >
                      {!isOpenSettingsDiffs ? 'View changes' : 'Hide changes'}
                    </FlatButton>
                  </Box>
                </Box>
              </Box>
              <Divider />
            </>
          )}
          {!settingsDiffs && !senderDiffs && (
            <Box mt={6} mb={6} align="center" className="H4-Chambray">
              Gifts will be moving without any changes
            </Box>
          )}
          <Box width="100%" mt={2}>
            <Button
              data-testid="Dashboard-GiftTransfer-ConfirmAndMove"
              className={classes.button}
              variant="contained"
              color="secondary"
              onClick={handleConfirm}
              fullWidth
            >
              Confirm changes and move gifts
            </Button>
          </Box>
        </Paper>
      </Box>
    </Slide>
  );
};

ConfirmChangesAndMoveGift.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string),
  campaign: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  goBack: PropTypes.func.isRequired,
};

ConfirmChangesAndMoveGift.defaultProps = {
  classes: {},
};

export default ConfirmChangesAndMoveGift;
