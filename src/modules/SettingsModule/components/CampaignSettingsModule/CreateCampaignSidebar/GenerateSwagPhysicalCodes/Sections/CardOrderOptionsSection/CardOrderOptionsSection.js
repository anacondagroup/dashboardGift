import React, { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@mui/styles';
import { Box, FormControl, InputLabel, MenuItem, Select, Divider, TextField, Button, Grid } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { CommonData } from '@alycecom/modules';
import { DashboardIcon, HtmlTip } from '@alycecom/ui';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterMoment from '@mui/lab/AdapterMoment';
import DatePicker from '@mui/lab/DatePicker';
import moment from 'moment';
import { mergeRight, omit } from 'ramda';

import { addressToString, codesAmountValues } from '../../../../../../../../constants/swagSelect.constants';
import UntouchedSection from '../../../../../CampaignSettings/CreateCampaignSidebar/CampaignSidebarSection/UntouchedSection/UntouchedSection';
import CompletedSection from '../../../../../CampaignSettings/CreateCampaignSidebar/CampaignSidebarSection/CompletedSection/CompletedSection';
import SkippedSection from '../../../../../CampaignSettings/CreateCampaignSidebar/CampaignSidebarSection/SkippedSection/SkippedSection';
import CampaignSidebarSectionAvatar from '../../../../../CampaignSettings/CreateCampaignSidebar/CampaignSidebarSectionAvatar/CampaignSidebarSectionAvatar';
import {
  swagPhysicalCampaignDataRequest,
  swagPhysicalCodesChangeStep,
  swagPhysicalCodesSetStep,
} from '../../../../../../store/campaign/swagPhysicalCodes/swagPhysicalCodes.actions';
import { GENERATE_SWAG_PHYSICAL_STATES, GSP_STEP_2 } from '../../../../../../../../constants/swagPhysical.constants';

const useStyles = makeStyles(theme => ({
  description: {
    color: theme.palette.grey.main,
    fontSize: 14,
    lineHeight: 1.29,
  },
  ul: {
    marginBlockStart: 0,
    marginBlockEnd: 0,
  },
  li: {
    fontSize: 14,
  },
  button: {
    boxShadow: 'none',
    width: 145,
  },
  buttonIcon: {
    marginLeft: theme.spacing(1),
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
}));

const defaultDeliveryAddress = {
  countryId: 1,
  state: '',
  city: '',
  addressLine1: '',
  addressLine2: '',
  zip: null,
};

const CardOrderOptionsSection = ({ title, order, status, data, campaignId, isLoading }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const governments = useSelector(CommonData.selectors.getGovernments);
  const countries = useSelector(CommonData.selectors.getNonInternationalCountries);
  const [codesAmount, setCodesAmount] = useState(data.codesAmount || codesAmountValues[0]);
  const [contactName, setContactName] = useState(data.contactName || '');
  const [deliveryAddress, setAddress] = useState(data.deliveryAddress || defaultDeliveryAddress);
  const [codesExpirationDate, setExpirationDate] = useState(
    (data.codesExpirationDate && moment(data.codesExpirationDate)) || moment().add(90, 'd'),
  );
  const [errors, setErrors] = useState({});

  const validate = useCallback(
    (value, field) => {
      const updatedErrors = { ...errors };

      if (!value) {
        updatedErrors[field] = 'Required field';
      } else {
        delete updatedErrors[field];
      }

      setErrors(updatedErrors);
    },
    [errors, setErrors],
  );

  const onUpdateDeliveryAddress = useCallback(
    (value, field) => {
      const updatedAddress = { ...deliveryAddress };
      if (field === 'countryId') {
        updatedAddress.countryId = value;
        updatedAddress.state = governments[value][0].name;
        updatedAddress.zip = '';
        validate(updatedAddress.zip, 'zip');
      } else {
        const checkedValue = value && value.trimLeft();
        validate(checkedValue, field);
        updatedAddress[field] = checkedValue;
      }
      setAddress(updatedAddress);
    },
    [validate, deliveryAddress, governments],
  );

  const onUpdateDeliveryLine2Address = useCallback(
    event => {
      setAddress({
        ...deliveryAddress,
        addressLine2: event.target.value.trimLeft(),
      });
    },
    [deliveryAddress],
  );

  const handleContactNameField = useCallback(
    value => {
      const checkedValue = value && value.trimLeft();
      validate(checkedValue, 'contactName');
      setContactName(checkedValue);
    },
    [validate, setContactName],
  );

  const handleNextStep = useCallback(() => {
    const componentData = mergeRight(data, {
      codesAmount,
      contactName,
      deliveryAddress,
      codesExpirationDate: codesExpirationDate.format('YYYY-MM-DD'),
    });
    dispatch(
      swagPhysicalCodesSetStep({
        step: GSP_STEP_2,
        data: mergeRight(data, componentData),
      }),
    );
    dispatch(swagPhysicalCampaignDataRequest(campaignId));
  }, [data, codesAmount, contactName, deliveryAddress, codesExpirationDate, dispatch, campaignId]);

  const handleEdit = useCallback(() => {
    dispatch(swagPhysicalCodesChangeStep({ next: GSP_STEP_2 }));
  }, [dispatch]);

  const isNextDisabled = useMemo(
    () =>
      !!Object.values(errors).length ||
      !Object.values({
        codesAmount,
        contactName,
        ...omit(['addressLine2'], deliveryAddress),
        codesExpirationDate,
      }).every(Boolean),
    [codesAmount, codesExpirationDate, contactName, deliveryAddress, errors],
  );

  if (status === GENERATE_SWAG_PHYSICAL_STATES.UNTOUCHED) {
    return <UntouchedSection order={order} title={title} status={status} />;
  }

  if (status === GENERATE_SWAG_PHYSICAL_STATES.COMPLETED) {
    return (
      <CompletedSection
        order={order}
        title={title}
        status={status}
        campaignId={campaignId}
        handleEdit={handleEdit}
        multiline
      >
        {`Batch has ${codesAmount} cards and it will ship to ${addressToString(deliveryAddress)}`}
      </CompletedSection>
    );
  }

  if (status === GENERATE_SWAG_PHYSICAL_STATES.SKIPPED) {
    return (
      <SkippedSection order={order} title={title} status={status} campaignId={campaignId}>
        {data.campaignType}
      </SkippedSection>
    );
  }

  return (
    <Box width={648}>
      <CampaignSidebarSectionAvatar status={status} avatar={order} />
      <Box pb={2} pl="52px" className="H4-Chambray">
        {title}
        <Box pt={1} pr={1} className={classes.description}>
          Before we print your card(s)… we need to know how many you want to get printed, where they should be shipped,
          and when they should expire! FYI - You can always print more codes after you confirm and print these ones!
        </Box>
      </Box>
      <Box pt={1} px={3}>
        <Box className="Body-Medium-Static">How many cards should be printed?</Box>
        <Box mt={2}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel id="ss_amount_cards">Select amount of cards</InputLabel>
            <Select
              labelId="ss_amount_cards"
              label="Select amount of cards"
              id="ss_amount_cards"
              value={codesAmount}
              onChange={e => setCodesAmount(e.target.value)}
              labelWidth={163}
            >
              {codesAmountValues.map(amount => (
                <MenuItem key={amount} value={amount}>
                  {amount}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box mt={2}>
            <HtmlTip>Please note: A minimum of {codesAmountValues[0]} cards is required for printing.</HtmlTip>
          </Box>
          <Box my={3}>
            <Divider />
          </Box>
          <Box className="Body-Medium-Static">Where would you like the cards to be shipped to?</Box>
          <TextField
            fullWidth
            error={!!(errors && errors.contactName)}
            helperText={errors && errors.contactName}
            label="Contact name"
            variant="outlined"
            margin="normal"
            value={contactName}
            onChange={e => handleContactNameField(e.target.value)}
          />
          <Box mt={2} mb={1}>
            <Divider />
          </Box>
          <TextField
            fullWidth
            error={!!(errors && errors.addressLine1)}
            helperText={errors && errors.addressLine1}
            label="Street address"
            variant="outlined"
            margin="normal"
            value={deliveryAddress.addressLine1}
            onChange={e => onUpdateDeliveryAddress(e.target.value, 'addressLine1')}
          />
          <TextField
            fullWidth
            error={!!(errors && errors.addressLine2)}
            helperText={errors && errors.addressLine2}
            label="Apt / Suite / Other"
            variant="outlined"
            margin="normal"
            value={deliveryAddress.addressLine2}
            onChange={onUpdateDeliveryLine2Address}
          />
          <Grid container direction="row" wrap="nowrap" spacing={2}>
            <Grid item xs={4}>
              <TextField
                fullWidth
                error={!!(errors && errors.city)}
                helperText={errors && errors.city}
                label="City"
                variant="outlined"
                margin="normal"
                value={deliveryAddress.city}
                onChange={e => onUpdateDeliveryAddress(e.target.value, 'city')}
              />
            </Grid>
            <Grid item xs={4}>
              <Box mt={2}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel id="swag_order_states">State / Province</InputLabel>
                  <Select
                    labelId="swag_order_states"
                    label="State / Province"
                    id="swag_order_states"
                    value={deliveryAddress.state}
                    onChange={e => onUpdateDeliveryAddress(e.target.value, 'state')}
                    labelWidth={120}
                  >
                    {governments[deliveryAddress.countryId].map(item => (
                      <MenuItem key={item.name} value={item.name}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                error={!!(errors && errors.zip)}
                helperText={errors && errors.zip}
                label={deliveryAddress.countryId === 1 ? 'Zip code' : 'Postal code'}
                variant="outlined"
                margin="normal"
                value={deliveryAddress.zip}
                onChange={e => onUpdateDeliveryAddress(e.target.value, 'zip')}
              />
            </Grid>
          </Grid>
          <Box mt={2}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel id="swag_order_country">Country</InputLabel>
              <Select
                labelId="swag_order_country"
                label="Country"
                id="swag_order_country"
                value={deliveryAddress.countryId}
                onChange={e => onUpdateDeliveryAddress(e.target.value, 'countryId')}
                labelWidth={60}
              >
                {countries.map(item => (
                  <MenuItem key={item.name} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
        <Box mt={3} mb={3}>
          <Divider />
        </Box>
        <Box mt={2} className="Body-Medium-Static">
          When should the cards expire?
        </Box>
        <Box mt={2}>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DatePicker
              value={codesExpirationDate}
              onChange={setExpirationDate}
              disablePast
              inputFormat={`[${codesExpirationDate.fromNow(true)}] (dddd, LL)`}
              renderInput={props => <TextField {...props} variant="outlined" fullWidth label="Expiration date" />}
            />
          </LocalizationProvider>
        </Box>
        <Box width="100%" mt={4} display="flex" justifyContent="flex-end">
          <Button
            className={classes.button}
            variant="contained"
            color="secondary"
            onClick={handleNextStep}
            fullWidth
            disabled={isLoading || isNextDisabled}
          >
            Next step
            {!isLoading ? (
              <DashboardIcon className={classes.buttonIcon} color="inherit" icon="arrow-right" />
            ) : (
              <DashboardIcon className={classes.buttonIcon} spin color="inherit" icon="spinner" />
            )}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

CardOrderOptionsSection.propTypes = {
  title: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  order: PropTypes.number.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.any,
  // eslint-disable-next-line react/forbid-prop-types
  campaignId: PropTypes.any,
  isLoading: PropTypes.bool,
};

CardOrderOptionsSection.defaultProps = {
  data: {},
  campaignId: undefined,
  isLoading: false,
};

export default CardOrderOptionsSection;
