import React, { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { Box, Button, TextField } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { DashboardIcon } from '@alycecom/ui';

import UntouchedSection from '../../../../../CampaignSettings/CreateCampaignSidebar/CampaignSidebarSection/UntouchedSection/UntouchedSection';
import CompletedSection from '../../../../../CampaignSettings/CreateCampaignSidebar/CampaignSidebarSection/CompletedSection/CompletedSection';
import SkippedSection from '../../../../../CampaignSettings/CreateCampaignSidebar/CampaignSidebarSection/SkippedSection/SkippedSection';
import CampaignSidebarSectionAvatar from '../../../../../CampaignSettings/CreateCampaignSidebar/CampaignSidebarSectionAvatar/CampaignSidebarSectionAvatar';
import {
  swagSelectChangeStep,
  swagSelectSetStepData,
  swagSelectUpdateCampaignLandingRequest,
} from '../../../../../../store/campaign/swagSelect/swagSelect.actions';
import {
  SS_LANDING_PAGE_STEP,
  SS_REQUIRED_ACTIONS_STEP,
  SWAG_SELECT_FLOW_STATES,
} from '../../../../../../../../constants/swagSelect.constants';

const useStyles = makeStyles(theme => ({
  description: {
    color: theme.palette.grey.main,
    fontSize: 14,
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
  link: {
    cursor: 'pointer',
    color: theme.palette.link.main,
    fontWeight: 'bold',
  },
  errorHelperText: {
    color: theme.palette.red.main,
  },
  successHelperText: {
    color: theme.palette.green.fruitSalad,
  },
}));

const getHelperText = ({ value, limit }) => {
  const letterCount = value ? value.length : 0;
  return (
    <Box
      component="span"
      width={1}
      textAlign="right"
      className={limit > letterCount ? 'Body-Small-Success' : 'Body-Small-Error'}
    >
      {`You have ${limit - letterCount} characters left (${letterCount} out of ${limit})`}
    </Box>
  );
};

const LandingPageMessageSection = ({ title, order, status, data, isLoading, campaignId }) => {
  const dispatch = useDispatch();
  const [headerField, setHeaderField] = useState({ value: data.header, limit: 70 });
  const [messageField, setMessageField] = useState({ value: data.message, limit: 560 });
  const classes = useStyles();

  const handleEdit = useCallback(() => {
    dispatch(swagSelectChangeStep({ current: undefined, next: SS_LANDING_PAGE_STEP }));
  }, [dispatch]);

  const isNextDisabled = useMemo(() => {
    const { value: headerValue, limit: headerLimit } = headerField;
    const { value: messageValue, limit: messageLimit } = messageField;
    if (!headerValue || !messageValue) {
      return true;
    }
    return headerLimit < headerValue.length || messageLimit < messageValue.length;
  }, [headerField, messageField]);

  const handleNextStep = useCallback(() => {
    if (isLoading) {
      return;
    }
    if (data.header === headerField.value && data.message === messageField.value) {
      dispatch(swagSelectChangeStep({ next: SS_REQUIRED_ACTIONS_STEP }));
      return;
    }
    dispatch(
      swagSelectSetStepData({
        step: SS_LANDING_PAGE_STEP,
        data: { header: headerField.value, message: messageField.value },
      }),
    );
    dispatch(swagSelectUpdateCampaignLandingRequest(campaignId));
  }, [isLoading, data, headerField, messageField, dispatch, campaignId]);

  if (status === SWAG_SELECT_FLOW_STATES.UNTOUCHED) {
    return <UntouchedSection order={order} title={title} status={status} />;
  }

  if (status === SWAG_SELECT_FLOW_STATES.COMPLETED) {
    return (
      <CompletedSection
        order={order}
        title={title}
        status={status}
        campaignId={campaignId}
        handleEdit={handleEdit}
        multiline
      >
        {data.message}
      </CompletedSection>
    );
  }

  if (status === SWAG_SELECT_FLOW_STATES.SKIPPED) {
    return (
      <SkippedSection order={order} title={title} status={status} campaignId={campaignId} handleEdit={handleEdit} />
    );
  }

  return (
    <Box width={648}>
      <CampaignSidebarSectionAvatar status={status} avatar={order} />
      <Box pb={2} pl="52px" pr={2} className="H4-Chambray">
        {title}
        <Box mt={1} className={classes.description}>
          Feel free to customize the message to your recipients. Please note that every recipient will see the same
          message when accessing the link, so be mindful of any personalized messaging.
        </Box>
      </Box>
      <Box pl={6.5} px={3} pt={2}>
        <Box>
          <Box mb={-1} className="Label-Table-Left-Active">
            YOUR LANDING PAGE HEADER
          </Box>
          <TextField
            fullWidth
            helperText={getHelperText(headerField)}
            variant="outlined"
            placeholder="Landing page header"
            margin="normal"
            value={headerField.value || ''}
            onChange={({ target }) => setHeaderField({ ...headerField, value: target.value.trimLeft() })}
          />
        </Box>
        <Box mt={4}>
          <Box mb={-1} className="Label-Table-Left-Active">
            YOUR LANDING PAGE MESSAGE
          </Box>
          <TextField
            rows="7"
            helperText={getHelperText(messageField)}
            placeholder="Landing page message"
            variant="outlined"
            margin="normal"
            value={messageField.value || ''}
            onChange={({ target }) => setMessageField({ ...messageField, value: target.value.trimLeft() })}
            multiline
            fullWidth
          />
        </Box>
        <Box width="100%" mt={2} display="flex" justifyContent="flex-end" alignItems="center">
          <Button
            className={classes.button}
            variant="contained"
            color="secondary"
            onClick={handleNextStep}
            disabled={isNextDisabled}
            fullWidth
          >
            Next step
            {isLoading ? (
              <DashboardIcon className={classes.buttonIcon} spin color="inherit" icon="spinner" />
            ) : (
              <DashboardIcon className={classes.buttonIcon} color="inherit" icon="arrow-right" />
            )}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

LandingPageMessageSection.propTypes = {
  title: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  order: PropTypes.number.isRequired,
  isLoading: PropTypes.bool.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.any,
  campaignId: PropTypes.number,
};

LandingPageMessageSection.defaultProps = {
  data: {},
  campaignId: undefined,
};

export default LandingPageMessageSection;
