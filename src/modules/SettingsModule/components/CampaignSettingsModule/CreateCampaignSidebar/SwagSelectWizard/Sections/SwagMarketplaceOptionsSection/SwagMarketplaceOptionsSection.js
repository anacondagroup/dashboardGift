import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Collapse } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useDispatch, useSelector } from 'react-redux';
import { DashboardIcon, Button as AlyceButton, Icon } from '@alycecom/ui';
import { useModalState } from '@alycecom/hooks';
import { CampaignSettings } from '@alycecom/modules';
import MuiAlert from '@mui/material/Alert';

import { SS_MARKETPLACE_STEP, SWAG_SELECT_FLOW_STATES } from '../../../../../../../../constants/swagSelect.constants';
import CompletedSection from '../../../../../CampaignSettings/CreateCampaignSidebar/CampaignSidebarSection/CompletedSection/CompletedSection';
import UntouchedSection from '../../../../../CampaignSettings/CreateCampaignSidebar/CampaignSidebarSection/UntouchedSection/UntouchedSection';
import CampaignSidebarSectionAvatar from '../../../../../CampaignSettings/CreateCampaignSidebar/CampaignSidebarSectionAvatar/CampaignSidebarSectionAvatar';
import {
  swagSelectChangeStep,
  swagSelectSetStepData,
  swagSelectUpdateRestrictedProductsRequest,
} from '../../../../../../store/campaign/swagSelect/swagSelect.actions';
import { getSwagSelectCampaignId } from '../../../../../../store/campaign/swagSelect/swagSelect.selectors';

import SwagSelectDefaultProductSidebar from './SwagSelectDefaultProductSidebar/SwagSelectDefaultProductSidebar';

const useStyles = makeStyles(theme => ({
  tableContainer: {
    maxHeight: 390,
    overflow: 'scroll',
  },
  description: {
    color: theme.palette.grey.main,
    fontSize: 14,
  },
  tableHeaderCell: {
    backgroundColor: 'white',
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
    width: 155,
  },
  buttonIcon: {
    marginLeft: theme.spacing(1),
  },
  defaultProductId: {
    backgroundColor: theme.palette.green.fruitSaladLight,
  },
  textButton: {
    cursor: 'pointer',
    fontSize: 12,
    color: theme.palette.grey.main,
    whiteSpace: 'normal',
    textOverflow: 'unset',
    marginRight: -16,
  },
  tip: {
    backgroundColor: theme.palette.orange.main,
    fontSize: 16,
  },
}));

const SwagMarketplaceOptionsSection = ({ title, order, status, data, isLoading }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [defaultProduct, setDefaultProduct] = useState({
    productId: data?.defaultProductId,
    denomination: data?.defaultProductDenomination,
  });
  const { isOpen, handleOpen, handleClose } = useModalState();

  const campaignId = useSelector(getSwagSelectCampaignId);

  const handleEdit = () => {
    dispatch(swagSelectChangeStep({ next: SS_MARKETPLACE_STEP }));
  };

  const handleNextStep = useCallback(() => {
    if (isLoading) {
      return;
    }
    dispatch(
      swagSelectSetStepData({
        step: SS_MARKETPLACE_STEP,
        data: {
          defaultProductId: defaultProduct?.productId,
          defaultProductDenomination: defaultProduct?.denomination,
          isDefaultProductInBudget: data?.isDefaultProductInBudget || false,
        },
      }),
    );
    if (campaignId) {
      dispatch(swagSelectUpdateRestrictedProductsRequest(campaignId));
    }
  }, [isLoading, dispatch, defaultProduct, campaignId, data]);

  const handleSelectDefaultGift = useCallback(
    ({ id, denomination }) => {
      setDefaultProduct({ productId: id, denomination: denomination?.price });
      handleClose();
    },
    [handleClose],
  );

  if (status === SWAG_SELECT_FLOW_STATES.COMPLETED) {
    return (
      <CompletedSection order={order} title={title} status={status} campaignId={campaignId} handleEdit={handleEdit}>
        <Box>Default Product:</Box>
        <Box mr={3}>
          <CampaignSettings.DefaultGift
            productId={defaultProduct?.productId}
            denomination={defaultProduct?.denomination}
            variant="text"
            component="span"
          />
        </Box>
        {data.isDefaultProductInBudget === false && (
          <Box mt={2} mr={3}>
            <MuiAlert
              icon={<Icon fontSize="inherit" icon="exclamation-circle" />}
              variant="filled"
              severity="warning"
              className={classes.tip}
            >
              Leading Gift is outside of your selected budget range. Please select another gift.
            </MuiAlert>
          </Box>
        )}
      </CompletedSection>
    );
  }

  if (status === SWAG_SELECT_FLOW_STATES.UNTOUCHED) {
    return <UntouchedSection order={order} title={title} status={status} />;
  }

  return (
    <Box width={648}>
      <CampaignSidebarSectionAvatar status={status} avatar={order} />
      <Box pl="52px" className="H4-Chambray">
        {title}
      </Box>
      <Box pl={6.5} pt={3.5} pr={3} pb={2}>
        <Collapse in={!!defaultProduct?.productId} unmountOnExit mountOnEnter>
          {data.isDefaultProductInBudget === false && (
            <Box mt={2}>
              <MuiAlert
                icon={<Icon fontSize="inherit" icon="exclamation-circle" />}
                variant="filled"
                severity="warning"
                className={classes.tip}
              >
                Leading Gift is outside of your selected budget range. Please select another gift.
              </MuiAlert>
            </Box>
          )}
          <Box mt={3} mb={2}>
            <CampaignSettings.DefaultGift
              productId={defaultProduct?.productId}
              denomination={defaultProduct?.denomination}
            />
          </Box>
        </Collapse>
        <AlyceButton variant="outlined" endIcon={<Icon icon="gift" />} onClick={() => handleOpen()}>
          {defaultProduct?.productId ? 'Change Gift' : 'Select Gift'}
        </AlyceButton>
        <SwagSelectDefaultProductSidebar
          campaignId={campaignId}
          onChange={handleSelectDefaultGift}
          onClose={handleClose}
          open={isOpen}
        />
        <Box width="100%" mt={3} display="flex" justifyContent="flex-end">
          <Button
            disabled={!defaultProduct?.productId}
            className={classes.button}
            variant="contained"
            color="secondary"
            onClick={handleNextStep}
            fullWidth
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

SwagMarketplaceOptionsSection.propTypes = {
  title: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  order: PropTypes.number.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.any,
  isLoading: PropTypes.bool,
};

SwagMarketplaceOptionsSection.defaultProps = {
  data: {},
  isLoading: false,
};

export default SwagMarketplaceOptionsSection;
