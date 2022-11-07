import React, { useCallback, useMemo, useState } from 'react';
import * as R from 'ramda';
import PropTypes from 'prop-types';
import { ActionButton, BaseButton, CustomDataEditorWrapper, DashboardIcon, palette } from '@alycecom/ui';
import { Box, Grid, TextField } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useSelector } from 'react-redux';

import { getCustomTemplateErrors } from '../../../../store/teams/customTemplates/customTemplates.selectors';

const messagePlaceholders = [
  { value: '[my-first-name]', label: 'Sender first name' },
  { value: '[my-last-name]', label: 'Sender last name' },
  { value: '[my-full-name]', label: 'Sender full name' },
  { value: '[company]', label: 'Sender company' },
  { value: '[first-name]', label: 'Contact first name' },
  { value: '[last-name]', label: 'Contact last name' },
  { value: '[full-name]', label: 'Contact full name' },
  { value: '[recipient-company]', label: 'Contact company' },
  { value: '[gl]', label: 'Gift link' },
  { value: '[gift-name]', label: 'Gift name' },
  { value: '[product-brand]', label: 'Product brand' },
];

const useStyles = makeStyles(() => ({
  spinnerIcon: {
    animationName: 'fa-spin',
    animationDuration: '1.2s',
    animationIterationCount: 'infinite',
    animationTimingFunction: 'linear',
  },
  saveIcon: {
    color: 'inherit',
  },
}));

const TeamSettingEditTemplateComponent = ({
  id,
  name,
  subject,
  message,
  isNew,
  onSave,
  onDiscard,
  onDelete,
  isUploading,
  charsLimit,
}) => {
  const [form, setForm] = useState({ name, subject, message });
  const externalErrors = useSelector(getCustomTemplateErrors);
  const [errors, setErrors] = useState({});

  const classes = useStyles();

  const handleSave = useCallback(() => {
    onSave({
      id,
      template: form,
    });
  }, [id, form, onSave]);

  const isReadyToSave = useMemo(() => form.name && form.subject && form.message && R.keys(errors).length === 0, [
    form,
    errors,
  ]);

  const validate = useCallback(
    (field, value) => {
      switch (field) {
        case 'name':
        case 'subject': {
          if (!value) {
            setErrors({ ...errors, [field]: `Field ${field} is required.` });
          } else if (value.length < 3) {
            setErrors({ ...errors, [field]: `Field ${field} should be more than 2 chars.` });
          } else {
            delete errors[field];
            setErrors({ ...errors });
          }
          break;
        }
        case 'message': {
          if (!value) {
            setErrors({ ...errors, [field]: `Field ${field} is required.` });
          } else if (value.length < 25) {
            setErrors({ ...errors, [field]: `Field ${field} should be more than 25 chars.` });
          } else if (value.length > 1000) {
            setErrors({ ...errors, [field]: `Field ${field} should be less than 1000 chars.` });
          } else {
            const updatedErrors = { ...errors };
            delete updatedErrors[field];
            setErrors(updatedErrors);
          }
          break;
        }
        default:
      }
    },
    [errors],
  );

  const handleForm = useCallback(
    (field, value) => {
      validate(field, value);
      setForm({ ...form, [field]: value });
    },
    [form, validate],
  );

  const handleOnDiscard = useCallback(() => {
    if (isNew) {
      onDiscard();
    } else {
      setForm({ name, message, subject });
    }
  }, [isNew, onDiscard, name, subject, message]);

  return (
    <>
      <Grid container direction="row">
        <Grid xl={7} lg={7} md={7} item>
          <TextField
            fullWidth
            error={!!(errors && errors.name) || !!(externalErrors && externalErrors.name)}
            helperText={(errors && errors.name) || (externalErrors && externalErrors.name)}
            label="Template name"
            variant="outlined"
            margin="normal"
            value={form.name}
            onChange={e => handleForm('name', e.target.value)}
          />
          <CustomDataEditorWrapper
            buttonText="+Insert placeholder"
            customData={messagePlaceholders}
            onChange={handleForm}
            fieldName="subject"
            renderTextField={({ onChange, editorRef }) => (
              <TextField
                fullWidth
                error={!!(errors && errors.subject)}
                helperText={errors && errors.subject}
                label="Subject line"
                variant="outlined"
                margin="normal"
                value={form.subject}
                inputRef={editorRef}
                onChange={e => onChange('subject', e.target.value)}
              />
            )}
          />
          <CustomDataEditorWrapper
            buttonText="+Insert placeholder"
            customData={messagePlaceholders}
            fieldName="message"
            charsLimit={charsLimit}
            onChange={handleForm}
            errors={errors && errors.message && [errors.message]}
            message={form.message}
            renderTextField={({ hasErrors, message: value, onChange, helperText, editorRef }) => (
              <TextField
                fullWidth
                multiline
                rows="7"
                error={hasErrors}
                helperText={helperText}
                label="Your message"
                variant="outlined"
                margin="normal"
                value={value}
                onChange={e => onChange('message', e.target.value)}
                inputRef={editorRef}
                FormHelperTextProps={{ component: 'div' }}
              />
            )}
          />
        </Grid>
        <Grid xl={5} lg={5} md={5} item />
      </Grid>
      <Box display="flex" mt={2}>
        <Box display="flex" flexGrow="1">
          <ActionButton id={`save_${name}`} width={178} onClick={() => handleSave()} disabled={!isReadyToSave}>
            <div>
              {!isUploading ? (
                <DashboardIcon icon="save" className={classes.saveIcon} />
              ) : (
                <DashboardIcon className={classes.spinnerIcon} icon="circle-notch" />
              )}
              <Box ml={1} className="" display="inline">
                Save template
              </Box>
            </div>
          </ActionButton>
          <Box ml={2}>
            <BaseButton
              id={`discard_${name}`}
              width="178"
              onClick={() => handleOnDiscard()}
              variant="outlined"
              color={palette.text.disabled}
            >
              <div>
                <Box ml={1} className="Body-Regular-Center-Link-Bold" display="inline">
                  Discard changes
                </Box>
              </div>
            </BaseButton>
          </Box>
        </Box>
        {!isNew && (
          <BaseButton
            id={`delete_${name}`}
            width="178"
            onClick={() => onDelete(id)}
            variant="outlined"
            color={palette.error.main}
          >
            <div>
              <Box ml={1} className="Body-Regular-Center-Error" display="inline">
                Delete template
              </Box>
            </div>
          </BaseButton>
        )}
      </Box>
    </>
  );
};

TeamSettingEditTemplateComponent.propTypes = {
  id: PropTypes.number,
  name: PropTypes.string,
  subject: PropTypes.string,
  message: PropTypes.string,
  isNew: PropTypes.bool,
  onSave: PropTypes.func.isRequired,
  onDiscard: PropTypes.func,
  onDelete: PropTypes.func,
  isUploading: PropTypes.bool,
  charsLimit: PropTypes.number,
};

TeamSettingEditTemplateComponent.defaultProps = {
  id: undefined,
  name: '',
  subject: '',
  message: '',
  isNew: false,
  isUploading: false,
  onDiscard: undefined,
  charsLimit: 400,
  onDelete: undefined,
};

export default TeamSettingEditTemplateComponent;
