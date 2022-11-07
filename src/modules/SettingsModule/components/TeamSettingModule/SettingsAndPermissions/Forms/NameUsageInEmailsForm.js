import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Box, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { ActionButton, HtmlTip } from '@alycecom/ui';
import { useForm, Controller } from 'react-hook-form';
import { applyEach } from '@alycecom/utils';
import { User } from '@alycecom/modules';

import { selectors } from '../../../../store/teams/generalSettings';

const NameUsageInEmailsForm = ({ onSubmit }) => {
  const isLoading = useSelector(selectors.getIsLoading);
  const nameUsageInEmails = useSelector(selectors.getNameUsageInEmails);
  const fullName = useSelector(User.selectors.getUserFullName);
  const orgName = useSelector(User.selectors.getOrgName);

  const {
    control,
    formState: { isDirty },
    handleSubmit,
    watch,
    reset,
  } = useForm({
    mode: 'all',
    defaultValues: {
      nameUsageInEmails,
    },
  });
  const isSubmitDisabled = isLoading || !isDirty;
  const watchNameUsageInEmails = watch('nameUsageInEmails');
  const example =
    {
      name: fullName,
      name_and_company: `${fullName} from ${orgName}`,
    }[watchNameUsageInEmails] || '';

  return (
    <Box component="form" mt={2} pl={1} onSubmit={handleSubmit(applyEach([onSubmit, reset]))}>
      <Box display="flex" flexDirection="column">
        <Box display="flex" pt={3} pb={3}>
          <HtmlTip>
            This will apply to the initial email invitation sent by Alyce as well as any reminder emails to the
            recipient. This setting will only apply to the recipient reminder emails if the emails are turned on for
            your team in the&nbsp;
            <Box display="inline" fontWeight={700}>
              Follow up preference
            </Box>
            &nbsp; setting.
            <Box mt={2}>
              You can choose to only include the name of the sender or to include both the name and company name in the
              From field. If the gift has a send-as person assigned, the send-as name will be applied in the name field.
            </Box>
          </HtmlTip>
        </Box>
        <Box display="flex" pt={3} pb={3}>
          <Controller
            name="nameUsageInEmails"
            control={control}
            render={({ field }) => (
              <RadioGroup row {...field}>
                <FormControlLabel value="disabled" control={<Radio color="primary" />} label="Disabled" />
                <FormControlLabel value="name" control={<Radio color="primary" />} label="Sender Name" />
                <FormControlLabel
                  value="name_and_company"
                  control={<Radio color="primary" />}
                  label="Sender Name and Company"
                />
              </RadioGroup>
            )}
          />
        </Box>
      </Box>
      <Box>
        <Box display="inline" fontWeight={700}>
          Example:{' '}
        </Box>
        {example}
      </Box>
      <Box mt={3}>
        <ActionButton disabled={isSubmitDisabled} type="submit">
          Save
        </ActionButton>
      </Box>
    </Box>
  );
};

NameUsageInEmailsForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default NameUsageInEmailsForm;
