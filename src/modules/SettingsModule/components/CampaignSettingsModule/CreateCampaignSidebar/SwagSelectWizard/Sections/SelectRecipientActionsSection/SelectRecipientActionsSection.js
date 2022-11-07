import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import classnames from 'classnames';
import { Box, Button, Divider, FormControlLabel, Checkbox, Collapse, Typography, TextField } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useDispatch } from 'react-redux';
import { DashboardIcon, BaseButton } from '@alycecom/ui';

import {
  swagSelectChangeStep,
  swagSelectSetStepData,
  swagSelectUpdateRecipientActionsRequest,
} from '../../../../../../store/campaign/swagSelect/swagSelect.actions';
import UntouchedSection from '../../../../../CampaignSettings/CreateCampaignSidebar/CampaignSidebarSection/UntouchedSection/UntouchedSection';
import CompletedSection from '../../../../../CampaignSettings/CreateCampaignSidebar/CampaignSidebarSection/CompletedSection/CompletedSection';
import SkippedSection from '../../../../../CampaignSettings/CreateCampaignSidebar/CampaignSidebarSection/SkippedSection/SkippedSection';
import CampaignSidebarSectionAvatar from '../../../../../CampaignSettings/CreateCampaignSidebar/CampaignSidebarSectionAvatar/CampaignSidebarSectionAvatar';
import {
  SS_REQUIRED_ACTIONS_STEP,
  SS_GENERATE_CODES_STEP,
  SWAG_SELECT_FLOW_STATES,
} from '../../../../../../../../constants/swagSelect.constants';

import {
  CAPTURE_AFFIDAVIT,
  CAPTURE_QUESTION,
  GIFTER_AFFIDAVIT,
  GIFTER_QUESTION,
  RECIPIENT_REQUIRED_ACTIONS,
} from './recipientActions';

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
  link: {
    cursor: 'pointer',
    color: theme.palette.link.main,
    fontWeight: 'bold',
  },
  button: {
    boxShadow: 'none',
    width: 145,
  },
  buttonIcon: {
    marginLeft: theme.spacing(1),
  },
  baseButton: {
    height: 48,
    width: 69,
  },
  buttonOn: {
    backgroundColor: theme.palette.green.dark,
    color: theme.palette.common.white,
    '&:hover': {
      color: theme.palette.common.white,
      backgroundColor: theme.palette.green.mountainMeadowLight,
    },
  },
  buttonOff: {
    color: theme.palette.link.main,
    borderColor: theme.palette.grey.regular,
    border: `1px solid ${theme.palette.grey.regular}`,
  },
}));

const SelectRecipientActionSection = ({ title, order, status, data, isLoading, campaignId }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const getActionsCount = useMemo(
    () => (data ? Object.values(data).filter(v => typeof v !== 'string' && v).length : 0),
    [data],
  );
  const [isNeedActions, setIsNeedActions] = useState(!!getActionsCount);
  const [actions, setActionData] = useState(data || {});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setIsNeedActions(!!getActionsCount);
    setActionData(data || {});
  }, [campaignId, status, data, getActionsCount]);

  const handleEdit = useCallback(() => {
    dispatch(swagSelectChangeStep({ current: undefined, next: SS_REQUIRED_ACTIONS_STEP }));
  }, [dispatch]);

  const handleNextStep = useCallback(() => {
    if (isLoading) {
      return;
    }
    const newData = { actions };
    if (R.equals(newData, data)) {
      dispatch(swagSelectChangeStep({ next: SS_GENERATE_CODES_STEP }));
      return;
    }
    dispatch(swagSelectSetStepData({ step: SS_REQUIRED_ACTIONS_STEP, data: newData }));
    dispatch(swagSelectUpdateRecipientActionsRequest(campaignId));
  }, [isLoading, actions, data, dispatch, campaignId]);

  const handleActionsStatus = value => {
    if (!value) {
      setActionData({});
    }
    setIsNeedActions(value);
  };

  const handleChangeActionData = useCallback(
    (action, value) => {
      const updatingActions = { ...actions };
      updatingActions[action.name] = value;
      if (action.name === CAPTURE_QUESTION || action.name === CAPTURE_AFFIDAVIT) {
        setErrors({ ...errors, [action.textField.name]: undefined });
        if (!value) {
          delete updatingActions[action.textField.name];
        }
      }
      setActionData(updatingActions);
    },
    [actions, errors],
  );

  const handleChangeTextFields = useCallback(
    (field, value) => {
      if (!value) {
        setErrors({ ...errors, [field]: 'Required field' });
      } else {
        setErrors({ ...errors, [field]: undefined });
      }
      setActionData({ ...actions, [field]: value });
    },
    [actions, errors],
  );

  const textFieldBlurHandle = (field, value) => handleChangeTextFields(field, value.trim());

  const isNextDisabled = useMemo(
    () =>
      isNeedActions &&
      ((actions[CAPTURE_QUESTION] && !actions[GIFTER_QUESTION]) ||
        (actions[CAPTURE_AFFIDAVIT] && !actions[GIFTER_AFFIDAVIT])),
    [isNeedActions, actions],
  );

  if (status === SWAG_SELECT_FLOW_STATES.UNTOUCHED) {
    return <UntouchedSection order={order} title={title} status={status} />;
  }

  if (status === SWAG_SELECT_FLOW_STATES.COMPLETED) {
    return (
      <CompletedSection order={order} title={title} status={status} campaignId={campaignId} handleEdit={handleEdit}>
        {getActionsCount ? `Defined ${getActionsCount} required actions` : 'No required actions'}
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
      <Box pb={2} pl="52px" className="H4-Chambray">
        {title}
        <Box mt={1} className={classes.description}>
          Feel free to customize the message to your recipients. Please note that every recipient will see the same
          message when accessing the link.
        </Box>
      </Box>
      <Box px={3} pt={2}>
        <Box>Do you want to require action from your recipient before they can accept their gift?</Box>
        <Box display="flex" mt={2}>
          <Box mr={2}>
            <BaseButton
              className={classnames(classes.baseButton, !isNeedActions ? classes.buttonOn : classes.buttonOff)}
              onClick={() => handleActionsStatus(false)}
            >
              No
            </BaseButton>
          </Box>
          <Box>
            <BaseButton
              className={classnames(classes.baseButton, isNeedActions ? classes.buttonOn : classes.buttonOff)}
              onClick={() => handleActionsStatus(true)}
            >
              Yes
            </BaseButton>
          </Box>
        </Box>
        <Collapse in={isNeedActions}>
          <Box mt={3}>
            {RECIPIENT_REQUIRED_ACTIONS.map((action, index) => (
              <Box key={action.name} mt={1} mb={1}>
                {!!index && (
                  <Box pt={1} pb={1}>
                    <Divider />
                  </Box>
                )}
                <FormControlLabel
                  disabled={isLoading}
                  control={
                    <Checkbox
                      checked={Boolean(actions[action.name])}
                      onChange={(_, value) => handleChangeActionData(action, value)}
                      value={action.name}
                      color="primary"
                      data-testid={`SelectRecipientActionsSection.${action.name}.Checkbox`}
                    />
                  }
                  label={<Typography className="Body-Regular-Left-Static-Bold">{action.title}</Typography>}
                />
                <Box pl={4}>
                  <Typography className="Body-Regular-Left-Static">{action.description}</Typography>
                </Box>
                {action.textField && (
                  <Box pt={1} pl={4}>
                    <TextField
                      rows="3"
                      variant="outlined"
                      name={action.textField.name}
                      placeholder={action.textField.placeholder}
                      value={actions[action.textField.name] || ''}
                      error={!!errors[action.textField.name]}
                      helperText={errors[action.textField.name] || ''}
                      onChange={event => handleChangeTextFields(action.textField.name, event.target.value)}
                      onBlur={event => textFieldBlurHandle(action.textField.name, event.target.value)}
                      disabled={!actions[action.name]}
                      multiline
                      fullWidth
                      inputProps={{ 'data-testid': `SelectRecipientActionsSection.${action.name}.TextField` }}
                    />
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        </Collapse>
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

SelectRecipientActionSection.propTypes = {
  title: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  order: PropTypes.number.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.any,
  isLoading: PropTypes.bool.isRequired,
  campaignId: PropTypes.number,
};

SelectRecipientActionSection.defaultProps = {
  data: {},
  campaignId: undefined,
};

export default SelectRecipientActionSection;
