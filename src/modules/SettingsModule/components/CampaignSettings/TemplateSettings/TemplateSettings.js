import React, { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { EDITOR_PLACEHOLDERS } from '@alycecom/ui';
import { MenuItem, FormControl, InputLabel, Select, Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useDispatch, useSelector } from 'react-redux';

import { actions, selectors } from '../../../store/campaign/template';

import TemplateForm from './TemplateForm';

const useStyles = makeStyles(() => ({
  select: {
    width: '100%',
  },
  formControl: {
    width: '100%',
  },
}));

const TemplateSettings = ({ campaignId }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const isLoading = useSelector(selectors.getIsLoading);
  const templates = useSelector(selectors.getTemplates);

  const initialTemplateId = useMemo(() => (templates.find(template => template.isDefault) || { id: 0 }).id, [
    templates,
  ]);
  const [templateId, setTemplateId] = useState(initialTemplateId);
  const selectedTemplate = useMemo(() => templates.find(template => template.id === templateId), [
    templates,
    templateId,
  ]);
  const inputLabelRef = React.useRef(null);

  const onTemplateChangeHandler = useCallback(
    ({ target: { value } }) => {
      if (!value) {
        dispatch(actions.clearTemplate(campaignId));
      }
      setTemplateId(value);
    },
    [dispatch, campaignId],
  );

  const handleSaveTemplate = useCallback(template => dispatch(actions.saveTemplate({ template, campaignId })), [
    dispatch,
    campaignId,
  ]);

  return (
    <>
      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel id="outlined-select-template" ref={inputLabelRef}>
          Selected template
        </InputLabel>
        <Select
          labelId="outlined-select-template"
          value={templateId}
          label="Selected template"
          onChange={onTemplateChangeHandler}
          className={classes.select}
        >
          <MenuItem value={0}>Any template can be used for this campaign</MenuItem>
          {templates.map(message => (
            <MenuItem key={message.id} value={message.id}>
              {message.name} {message.isDefault && '(Campaign default message)'}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {selectedTemplate && (
        <Box mt={3}>
          <TemplateForm
            onSaveTemplate={handleSaveTemplate}
            item={selectedTemplate}
            showName={false}
            customData={EDITOR_PLACEHOLDERS}
            saveText="Apply message template"
            isLoading={isLoading}
            tip="Tip: This message subject will be used in ALL EMAILS sent through Alyce. This includes the initial email (an email invitation) and all follow up emails that are sent by Alyce."
          />
        </Box>
      )}
    </>
  );
};

TemplateSettings.propTypes = {
  campaignId: PropTypes.number.isRequired,
};

export default TemplateSettings;
