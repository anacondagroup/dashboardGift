import React, { useCallback, useMemo, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Checkbox, FormControlLabel, TextField } from '@mui/material';
import { makeStyles } from '@mui/styles';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Divider, ActionButton, HtmlTip } from '@alycecom/ui';
import { CommonData } from '@alycecom/modules';
import { isString } from '@alycecom/utils';

import { getIsAllowEditTemplate } from '../../../../store/campaign/commonData/commonData.selectors';

import { templateShape } from './shapes/template.shape';
import { placeholderShape } from './shapes/placeholder.shape';
import { SubjectControl, MessageControl } from './controls';
import { buildValidationSchema } from './TemplateFormValidation';

const useStyles = makeStyles(({ palette }) => ({
  deleteButton: {
    height: 48,
    width: 200,
    color: palette.red.main,
    borderColor: palette.red.light,
  },
  subjectHelperText: {
    color: palette.text.primary,
    fontSize: '0.75rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 180,
  },
}));

const TemplateForm = ({ item, isLoading, customData, onSaveTemplate, onDeleteTemplate, showName, saveText, tip }) => {
  const { id, name } = item;
  const classes = useStyles();

  const charsLimit = useSelector(CommonData.selectors.getEmailCharLimit);
  const isAllowEditTemplate = useSelector(getIsAllowEditTemplate);
  const validationSchema = useMemo(() => buildValidationSchema(charsLimit), [charsLimit]);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      subject: '',
      message: '',
      allowEditTemplate: true,
    },
    resolver: yupResolver(validationSchema),
  });

  // react to template selection
  useEffect(() => {
    setValue('subject', item.subject, { shouldValidate: true });
    setValue('message', item.message, { shouldValidate: true });
    setValue('allowEditTemplate', isAllowEditTemplate, { shouldValidate: true });
  }, [item, setValue, isAllowEditTemplate]);

  const handleSaveTemplate = useCallback(
    ({ subject, message, allowEditTemplate }) =>
      onSaveTemplate({
        ...item,
        subject,
        message,
        allowEditTemplate,
      }),
    [item, onSaveTemplate],
  );
  const handleDeleteTemplate = useCallback(() => onDeleteTemplate(id), [id, onDeleteTemplate]);

  const isNew = isString(id);
  const closeButtonName = isNew ? 'Discard changes' : 'Delete template';

  return (
    <Box display="flex" flexDirection="column">
      {showName && (
        <>
          <Box width={1 / 4} mb={4} mt={isNew ? 4 : 0}>
            <TextField
              id="templates-template-name"
              variant="outlined"
              label="Template name"
              fullWidth
              value={name}
              disabled={isLoading}
              placeholder="Your Template Name"
            />
          </Box>
          <Divider mb={4} />
        </>
      )}

      <Box display="flex" maxWidth={400} mb={4}>
        <Controller
          name="subject"
          control={control}
          render={({ field }) => (
            <SubjectControl {...field} disabled={isLoading} error={errors.subject && errors.subject.message} />
          )}
        />
        <Box className={classes.subjectHelperText}>Only used in emails</Box>
      </Box>

      {tip && <HtmlTip>{tip}</HtmlTip>}

      <Box width={1} mb={2}>
        <Controller
          name="message"
          control={control}
          render={({ field }) => (
            <MessageControl
              {...field}
              disabled={isLoading}
              customData={customData}
              error={errors.message && errors.message.message}
              charsLimit={charsLimit}
            />
          )}
        />
      </Box>

      <Box width={1} display="flex" justifyContent="flex-start">
        <ActionButton
          onClick={handleSubmit(handleSaveTemplate)}
          type="submit"
          disabled={isLoading || !isValid}
          width={220}
        >
          {saveText}
        </ActionButton>
        <Box pl={2}>
          <Controller
            name="allowEditTemplate"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={<Checkbox color="primary" checked={field.value} {...field} />}
                label="Allow team members to edit message"
              />
            )}
          />
        </Box>

        {onDeleteTemplate && (
          <Button
            className={classes.deleteButton}
            variant="outlined"
            onClick={handleDeleteTemplate}
            disabled={isLoading}
          >
            {closeButtonName}
          </Button>
        )}
      </Box>
    </Box>
  );
};

TemplateForm.propTypes = {
  item: templateShape.isRequired,
  onSaveTemplate: PropTypes.func.isRequired,
  onDeleteTemplate: PropTypes.func,
  customData: PropTypes.arrayOf(placeholderShape),
  isLoading: PropTypes.bool,
  showName: PropTypes.bool,
  saveText: PropTypes.string,
  tip: PropTypes.string,
};

TemplateForm.defaultProps = {
  isLoading: false,
  customData: [],
  onDeleteTemplate: null,
  showName: true,
  saveText: 'Save',
  tip: null,
};

export default TemplateForm;
