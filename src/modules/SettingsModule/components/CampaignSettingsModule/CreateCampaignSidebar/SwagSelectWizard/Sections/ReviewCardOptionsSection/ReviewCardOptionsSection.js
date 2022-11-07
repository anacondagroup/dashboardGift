import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, TextField, Button } from '@mui/material';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterMoment from '@mui/lab/AdapterMoment';
import DatePicker from '@mui/lab/DatePicker';
import { makeStyles } from '@mui/styles';
import { FlatButton, Divider, DashboardIcon } from '@alycecom/ui';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';

import {
  codesAmountValues,
  addressToString,
  SS_CARD_CONFIGURATOR_STEP,
  SS_CARD_ORDER_OPTIONS_STEP,
  SWAG_SELECT_FLOW_STATES,
} from '../../../../../../../../constants/swagSelect.constants';
import UntouchedSection from '../../../../../CampaignSettings/CreateCampaignSidebar/CampaignSidebarSection/UntouchedSection/UntouchedSection';
import CompletedSection from '../../../../../CampaignSettings/CreateCampaignSidebar/CampaignSidebarSection/CompletedSection/CompletedSection';
import SkippedSection from '../../../../../CampaignSettings/CreateCampaignSidebar/CampaignSidebarSection/SkippedSection/SkippedSection';
import CampaignSidebarSectionAvatar from '../../../../../CampaignSettings/CreateCampaignSidebar/CampaignSidebarSectionAvatar/CampaignSidebarSectionAvatar';
import {
  swagSelectChangeStep,
  swagSelectSendOrderDataToProcessingRequest,
} from '../../../../../../store/campaign/swagSelect/swagSelect.actions';
import { getSwagSelectCardsOrderData } from '../../../../../../store/campaign/swagSelect/swagSelect.selectors';

const useStyles = makeStyles(({ palette, spacing }) => ({
  description: {
    color: palette.grey.main,
    fontSize: 14,
    lineHeight: 1.29,
  },
  button: {
    boxShadow: 'none',
  },
  buttonIcon: {
    marginLeft: spacing(1),
  },
  cardImage: {
    width: '100%',
    border: '1px solid #979797',
    borderRadius: '4px',
  },
  linkButton: {
    '& > div': {
      lineHeight: '1.2 !important',
    },
  },
}));

const CARD_IMAGES = [
  {
    key: 'front',
    name: 'Front',
  },
  {
    key: 'back',
    name: 'Back',
  },
];

const ReviewCardOptionsSection = ({ title, order, status, data, campaignId, isLoading }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { codesAmount, deliveryAddress, codesExpirationDate } = useSelector(getSwagSelectCardsOrderData);

  const handleEditCardDesign = useCallback(() => {
    dispatch(swagSelectChangeStep({ next: SS_CARD_CONFIGURATOR_STEP }));
  }, [dispatch]);

  const handleEditOrderData = useCallback(() => {
    dispatch(swagSelectChangeStep({ next: SS_CARD_ORDER_OPTIONS_STEP }));
  }, [dispatch]);

  const handleNext = useCallback(() => {
    dispatch(swagSelectSendOrderDataToProcessingRequest({ campaignId, orderId: data.orderId }));
  }, [campaignId, data, dispatch]);

  if (status === SWAG_SELECT_FLOW_STATES.UNTOUCHED) {
    return <UntouchedSection order={order} title={title} status={status} />;
  }

  if (status === SWAG_SELECT_FLOW_STATES.COMPLETED) {
    return (
      <CompletedSection order={order} title={title} status={status} campaignId={campaignId}>
        Card configured
      </CompletedSection>
    );
  }

  if (status === SWAG_SELECT_FLOW_STATES.SKIPPED) {
    return (
      <SkippedSection order={order} title={title} status={status} campaignId={campaignId}>
        {data.campaignType}
      </SkippedSection>
    );
  }

  return (
    <Box width={648}>
      <CampaignSidebarSectionAvatar status={status} avatar={order} />
      <Box pb={2} className="H4-Chambray">
        <Box pl={6} pr={1}>
          {title}
          <Box pt={1} className={classes.description}>
            Last step! Before we send your card(s) to get printed… we need you to review your designs and order amount.
            FYI - You can always add more cards after you print the initial ones!
          </Box>
        </Box>

        <Box px={3}>
          <Box mt={4}>
            <FlatButton className={classes.linkButton} icon="arrow-left" onClick={handleEditCardDesign}>
              Edit card design
            </FlatButton>
          </Box>

          <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
            {CARD_IMAGES.map(({ key, name }) => (
              <Box
                key={key}
                width={285}
                height={285}
                position="relative"
                border={1}
                borderColor="text.disabled"
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <img
                  className={classes.cardImage}
                  src={data[key === 'front' ? 'frontSideCardPreview' : 'backSideCardPreview']}
                  alt={key}
                />
                <Box position="absolute" bottom={-24} width={228} textAlign="center">
                  <Typography className="Body-Small-Static">{name}</Typography>
                </Box>
              </Box>
            ))}
          </Box>

          <Divider mt={5} mb={3} />

          <FlatButton className={classes.linkButton} icon="arrow-left" onClick={handleEditOrderData}>
            Edit order data
          </FlatButton>

          <Box mt={2}>
            <FormControl variant="outlined" fullWidth disabled>
              <InputLabel id="swag_card_count">How many cards should be printed?</InputLabel>
              <Select
                labelId="swag_card_count"
                label="How many cards should be printed?"
                id="swag_card_count"
                value={codesAmount}
                labelWidth={250}
              >
                {codesAmountValues.map(value => (
                  <MenuItem key={value} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <TextField
            fullWidth
            name="swag_card_address"
            error={false}
            label="Cards should be shipped to:"
            variant="outlined"
            margin="normal"
            value={addressToString(deliveryAddress)}
            disabled
          />

          <Box mt={2}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker
                disablePast
                disabled
                format={`[${moment(codesExpirationDate).fromNow(true)}] (dddd, LL)`}
                value={codesExpirationDate}
                renderInput={props => (
                  <TextField {...props} variant="outlined" fullWidth label="When should the cards expire?" />
                )}
                name="swag_card_expiration_date"
              />
            </LocalizationProvider>
          </Box>

          <Box mt={4}>
            <Typography className="Body-Regular-Left-Inactive">
              Estimated delivery date:{' '}
              <span className="Body-Regular-Left-Chambray-Bold">
                {moment().add(14, 'd').format('dddd, MMMM Do, YYYY')}
              </span>
            </Typography>
          </Box>

          <Box mt={4} textAlign="right">
            <Button
              width="auto"
              className={classes.button}
              variant="contained"
              color="secondary"
              onClick={handleNext}
              disabled={isLoading}
            >
              Confirm design / amount and order cards
              {!isLoading ? (
                <DashboardIcon className={classes.buttonIcon} color="inherit" icon="arrow-right" />
              ) : (
                <DashboardIcon className={classes.buttonIcon} spin color="inherit" icon="spinner" />
              )}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

ReviewCardOptionsSection.propTypes = {
  title: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  order: PropTypes.number.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.any,
  // eslint-disable-next-line react/forbid-prop-types
  campaignId: PropTypes.any,
  isLoading: PropTypes.bool,
};

ReviewCardOptionsSection.defaultProps = {
  data: {},
  campaignId: undefined,
  isLoading: false,
};

export default ReviewCardOptionsSection;
