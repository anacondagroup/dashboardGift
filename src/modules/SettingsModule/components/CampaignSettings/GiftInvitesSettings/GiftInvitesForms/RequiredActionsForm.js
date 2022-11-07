import React, { useState, useCallback, useEffect } from 'react';
import { includes, flip, split, pipe, last, concat } from 'ramda';
import PropTypes from 'prop-types';
import { Box, Checkbox, FormControlLabel, Typography, Collapse } from '@mui/material';
import { ActionButton, TextAreaField, Divider } from '@alycecom/ui';

import {
  REQUIRED_ACTIONS,
  CAPTURE_QUESTION,
  CAPTURE_AFFIDAVIT,
} from '../../../../../../constants/campaignSettings.constants';
import { requiredActionsShape } from '../../shapes/requiredActions.shape';

const ACTIONS_WITH_TEXTFIELD = [CAPTURE_QUESTION, CAPTURE_AFFIDAVIT];

const RequiredActionsForm = ({ isLoading, actions, canOverrideActions, onSave, errors, showCanOverrideActions }) => {
  const [localActions, setLocalActions] = useState(actions);
  const [localCanOverrideActions, setCanOverrideActions] = useState(canOverrideActions);

  const hasTextField = flip(includes)(ACTIONS_WITH_TEXTFIELD);
  const getTextFieldName = pipe(split('_'), last, concat('gifter_'));

  const handleSave = useCallback(() => {
    onSave(localCanOverrideActions, localActions);
  }, [onSave, localActions, localCanOverrideActions]);

  const handleChangeField = useCallback(
    (id, value) => {
      setLocalActions({
        ...localActions,
        [id]: value,
      });
    },
    [localActions, setLocalActions],
  );

  const validateField = useCallback(
    (id, value) => {
      setLocalActions({
        ...localActions,
        [id]: value.trim(),
      });
    },
    [localActions, setLocalActions],
  );

  const handleChangeCanOverrideAction = useCallback(value => setCanOverrideActions(value), [setCanOverrideActions]);

  useEffect(
    () => {
      if (isLoading) {
        return;
      }
      if (!localActions[CAPTURE_QUESTION]) {
        setLocalActions({
          ...localActions,
          gifter_question: '',
        });
      }
      if (!localActions[CAPTURE_AFFIDAVIT]) {
        setLocalActions({
          ...localActions,
          gifter_affidavit: '',
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isLoading],
  );
  return (
    <Box display="flex" flexDirection="column">
      {REQUIRED_ACTIONS.map(action => {
        const hasAreaField = hasTextField(action.id);
        const textFieldName = hasAreaField ? getTextFieldName(action.id) : '';
        const textFieldValue = hasAreaField ? localActions[textFieldName] : '';
        const showTextArea = hasAreaField && localActions[action.id];

        return (
          <Box key={action.id} ml={3} mt={1} mb={1}>
            <FormControlLabel
              className="Body-Regular-Left-Inactive"
              disabled={isLoading}
              control={
                <Checkbox
                  checked={localActions[action.id]}
                  onChange={(event, value) => handleChangeField(action.id, value)}
                  value={action.id}
                  color="primary"
                />
              }
              label={action.title}
            />
            <Box pl={4}>
              <Typography className="Body-Regular-Left-Static">{action.description}</Typography>
            </Box>
            {hasAreaField && (
              <Collapse in={showTextArea}>
                <Box width={1 / 2} pt={1} pl={4}>
                  <TextAreaField
                    name={`required_actions.${textFieldName}`}
                    fullWidth
                    value={textFieldValue}
                    onChange={event => handleChangeField(textFieldName, event.target.value)}
                    onBlur={event => validateField(textFieldName, event.target.value)}
                    errors={errors}
                    disabled={isLoading}
                    inputProps={{ 'data-testid': `RequiredActions.${textFieldName}` }}
                  />
                </Box>
              </Collapse>
            )}
          </Box>
        );
      })}
      {showCanOverrideActions && (
        <>
          <Divider mt={4} mb={4} />

          <Box width={1} ml={3} mb={3}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={localCanOverrideActions}
                  onChange={(event, value) => handleChangeCanOverrideAction(value)}
                  color="primary"
                />
              }
              label="Allow team members to change required actions on a per gift basis"
            />
          </Box>
        </>
      )}

      <Box width={1} display="flex" justifyContent="space-between" mt={1}>
        <ActionButton width={100} onClick={handleSave} disabled={isLoading}>
          Save
        </ActionButton>
      </Box>
    </Box>
  );
};

RequiredActionsForm.propTypes = {
  onSave: PropTypes.func.isRequired,
  actions: requiredActionsShape,
  canOverrideActions: PropTypes.bool,
  showCanOverrideActions: PropTypes.bool,
  isLoading: PropTypes.bool,
  // eslint-disable-next-line react/forbid-prop-types
  errors: PropTypes.object,
};

RequiredActionsForm.defaultProps = {
  actions: {
    capture_date: false,
    capture_email: false,
    capture_phone: false,
    capture_affidavit: false,
    gifter_affidavit: '',
    capture_question: false,
    gifter_question: '',
  },
  canOverrideActions: false,
  showCanOverrideActions: true,
  isLoading: false,
  errors: {},
};

export default RequiredActionsForm;
