import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Box, Paper, Button, Typography, MenuItem, TextField, Autocomplete } from '@mui/material';

import { loadAllowedCampaignsRequest } from '../../../../store/breakdowns/giftTransfer/giftTransfer.actions';
import { getAllowedCampaigns } from '../../../../store/breakdowns/giftTransfer/giftTransfer.selectors';

const SelectCampaign = ({ classes, onSelect, teamId, campaignId }) => {
  const dispatch = useDispatch();

  const campaigns = useSelector(getAllowedCampaigns);
  const items = useMemo(
    () =>
      campaigns.map(item => ({
        label: item.name,
        value: item,
      })),
    [campaigns],
  );

  const [campaign, setCampaign] = useState();

  useEffect(() => {
    dispatch(loadAllowedCampaignsRequest({ teamId, campaignId }));
  }, [campaignId, teamId, dispatch]);

  const handleMoveGift = useCallback(() => {
    onSelect(campaign.value);
  }, [campaign, onSelect]);

  return (
    <Paper square className={classes.paper}>
      <Typography className="H4-Chambray">What campaign should we add these gifts to?</Typography>
      <Box mt={2}>
        <Autocomplete
          value={campaign}
          renderInput={params => (
            <TextField
              {...params}
              variant="outlined"
              label="Select a Campaign"
              data-testId="Dashboard-GiftTransfer-SelectCampaignTarget"
            />
          )}
          options={items}
          getOptionLabel={option => option.label}
          renderOption={(props, option) => (
            <MenuItem {...props} key={option.label} data-testid="Dashboard-GiftTransfer-SelectCampaignMenuItem">
              {option.label}
            </MenuItem>
          )}
          focusOnClear
          onChange={(_, value) => {
            setCampaign(value);
          }}
        />
      </Box>
      <Box display="flex" justifyContent="flex-end" mt={2}>
        <Button
          data-testid="Dashboard-GiftTransfer-MoveGifts"
          className={classes.button}
          variant="contained"
          color="secondary"
          component="div"
          onClick={handleMoveGift}
          disabled={!campaign}
        >
          Move gifts
        </Button>
      </Box>
    </Paper>
  );
};

SelectCampaign.propTypes = {
  teamId: PropTypes.number.isRequired,
  campaignId: PropTypes.number,
  onSelect: PropTypes.func.isRequired,
  classes: PropTypes.objectOf(PropTypes.string),
};

SelectCampaign.defaultProps = {
  classes: {},
  campaignId: undefined,
};

export default SelectCampaign;
