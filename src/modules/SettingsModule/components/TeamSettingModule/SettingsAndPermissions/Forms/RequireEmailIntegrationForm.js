import React from 'react';
import PropTypes from 'prop-types';
import { useForm, Controller } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { ActionButton, HtmlTip } from '@alycecom/ui';
import { applyEach } from '@alycecom/utils';
import { User } from '@alycecom/modules';

import { selectors } from '../../../../store/teams/generalSettings';

export const VALUE_TO_LABEL = {
  show: 'Prompt only',
  required: 'Restrict',
  not_show: 'Never prompt',
};

const useStyles = makeStyles(({ spacing, palette }) => ({
  optionDescriptionList: {
    margin: 0,
    paddingLeft: spacing(20 / 8),
    listStyle: 'none',
  },
  optionDescriptionItem: {
    position: 'relative',
    padding: spacing(1),
    '&:before': {
      content: '',
      left: spacing(-12 / 8),
      top: spacing(2),
      position: 'absolute',
      width: 4,
      height: 4,
      backgroundColor: palette.primary.main,
      borderRadius: '50%',
    },
  },
}));

const RequireEmailIntegrationForm = ({ onSubmit }) => {
  const classes = useStyles();
  const isLoading = useSelector(selectors.getIsLoading);
  const requireEmailIntegration = useSelector(selectors.getRequireEmailIntegration);
  const isUsingDKIM = useSelector(User.selectors.getIsUsingDKIM);
  const integrationScope = isUsingDKIM ? 'calendar' : 'calendar and email';

  const {
    control,
    formState: { isDirty },
    handleSubmit,
    reset,
  } = useForm({
    mode: 'all',
    defaultValues: {
      requireEmailIntegration,
    },
  });
  const isSubmitDisabled = isLoading || !isDirty;

  return (
    <Box component="form" ml={-1} mt={2} onSubmit={handleSubmit(applyEach([onSubmit, reset]))}>
      <Box fontWeight={700} fontSize="12px" color="grey.main">
        AVAILABLE OPTIONS
      </Box>
      <ul className={classes.optionDescriptionList}>
        <li className={classes.optionDescriptionItem}>
          <Box fontWeight={700} color="primary.main" display="inline">
            {VALUE_TO_LABEL.show}
          </Box>
          &nbsp; &mdash; this is the default option. This will prompt your team member to connect their{' '}
          {integrationScope} if it is not yet integrated while giving them the option to proceed without connecting.
          Once they connect, they will no longer see the prompt.
        </li>
        <li className={classes.optionDescriptionItem}>
          <Box fontWeight={700} color="primary.main" display="inline">
            {VALUE_TO_LABEL.required}
          </Box>
          &nbsp; &mdash; this will prompt your team member to integrate their {integrationScope} within the gifting
          flow, but not allow them to proceed until they do. Once they connect, they will no longer see the prompt.
        </li>
        <li className={classes.optionDescriptionItem}>
          <Box fontWeight={700} color="primary.main" display="inline">
            {VALUE_TO_LABEL.not_show}
          </Box>
          &nbsp; &mdash; this will give you the ability to never prompt your team members to integrate their{' '}
          {integrationScope}. We only recommend this setting if your organization has specific reasons for not being
          able to integrate your emails with Alyce.
        </li>
      </ul>
      <Box my={3} width={1 / 3}>
        <FormControl fullWidth variant="outlined">
          <InputLabel id="team-setting-email-integration-label">
            What is the default setting for {integrationScope} integration?
          </InputLabel>
          <Controller
            name="requireEmailIntegration"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                labelId="team-setting-email-integration-label"
                id="team-setting-email-integration-select"
                variant="outlined"
                color="primary"
                label={`What is the default setting for ${integrationScope} integration?`}
                disabled={isLoading}
              >
                {Object.entries(VALUE_TO_LABEL).map(([option, label]) => (
                  <MenuItem key={option} value={option}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
        </FormControl>
      </Box>
      <HtmlTip>
        If you are using Send-As functionality and sending on behalf of someone else, having this setting on RESTRICT
        will not allow you to proceed until the send-as team member has integrated their {integrationScope}. If set to
        Prompt Only, you will be notified each time that they have not integrated, but be allowed to proceed.
      </HtmlTip>
      <Box mt={3}>
        <ActionButton type="submit" disabled={isSubmitDisabled}>
          Save
        </ActionButton>
      </Box>
    </Box>
  );
};

RequireEmailIntegrationForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default RequireEmailIntegrationForm;
