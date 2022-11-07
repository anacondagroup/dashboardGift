import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, FormProvider } from 'react-hook-form';
import { User, useTrackComplianceSettingUpdated } from '@alycecom/modules';
import { ActionButton } from '@alycecom/ui';
import { Box, Collapse } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import { lensProp, over } from 'ramda';

import { selectors, actions, schemas } from '../../../../../store/teams/generalSettings';

import ComplianceIsRequiredController from './ComplianceIsRequiredController';
import ComplianceTextField from './ComplianceTextField';
import ComplianceFormPreview from './ComplianceFormPreview';

const valuesToFormValues = over(lensProp('complianceIsRequired'), String);

interface IComplianceSettingProps {
  teamId: number;
}

const ComplianceSetting = ({ teamId }: IComplianceSettingProps): JSX.Element => {
  const dispatch = useDispatch();

  const isLoading = useSelector(selectors.getIsLoading);
  const complianceIsRequired = useSelector(selectors.getIsComplianceRequired);
  const complianceLink = useSelector(selectors.getComplianceLink);
  const compliancePromptText = useSelector(selectors.getCompliancePromptText);
  const complianceRevertText = useSelector(selectors.getComplianceRevertText);
  const user = useSelector(User.selectors.getUser);

  const trackSettingUpdated = useTrackComplianceSettingUpdated(user);
  const formMethods = useForm({
    mode: 'all',
    resolver: yupResolver(schemas.complianceSchema),
    // @ts-ignore
    defaultValues: valuesToFormValues({
      complianceLink,
      compliancePromptText,
      complianceRevertText,
      complianceIsRequired,
    }),
    shouldUnregister: true,
  });
  const {
    handleSubmit,
    watch,
    formState: { isValid, isDirty, dirtyFields },
    reset,
    trigger,
  } = formMethods;
  const watchRequired = watch('complianceIsRequired');
  // @ts-ignore
  const isFormVisible = watchRequired === 'true';
  const isSubmitButtonDisabled = isLoading || !isDirty || !isValid;
  const isSubmitButtonVisible = isFormVisible || dirtyFields.complianceIsRequired;
  const isPreviewVisible = isFormVisible && isValid;

  const onSubmit = useCallback(
    compliance => {
      trackSettingUpdated(teamId, compliance.complianceIsRequired);
      reset(valuesToFormValues(compliance));
      dispatch(actions.updateSettings({ ...compliance, teamId }));
    },
    [dispatch, reset, teamId, trackSettingUpdated],
  );

  useEffect(() => {
    if (watchRequired) {
      trigger('complianceRevertText');
      trigger('complianceLink');
    }
  }, [watchRequired, trigger]);

  return (
    <FormProvider {...formMethods}>
      <Box component="form" mt={2} onSubmit={handleSubmit(onSubmit)}>
        <ComplianceIsRequiredController />
        <Collapse unmountOnExit in={isFormVisible}>
          <Box mt={6} width={{ md: 1, lg: 8 / 12 }} display="flex" flexDirection="row" justifyContent="space-between">
            <Box width={1} mr={4}>
              <ComplianceTextField
                name="compliancePromptText"
                label="What should the prompt message be?"
                tooltipText="This will be the message that your team sees every time they send a gift confirming that they've gotten approval"
                textFieldProps={{
                  autoFocus: true,
                  fullWidth: true,
                  multiline: true,
                  rows: 2,
                  maxRows: 30,
                }}
              />
            </Box>
            <Box width={1} ml={4}>
              <ComplianceTextField
                name="complianceRevertText"
                label="What should the revert message be?"
                tooltipText="This will be the message that your team sees whenever they revert (or cancel) sending a gift after seeing the prompt"
                textFieldProps={{
                  fullWidth: true,
                  multiline: true,
                  rows: 2,
                  maxRows: 30,
                }}
              />
            </Box>
          </Box>
          <Box width={{ md: 1, lg: 8 / 12 }} mt={6}>
            <ComplianceTextField
              name="complianceLink"
              textFieldProps={{
                label: 'Add an optional link to the bottom of your messages',
                fullWidth: true,
                placeholder: 'https://example.com',
              }}
            />
          </Box>
        </Collapse>
        <Collapse in={isPreviewVisible}>
          <ComplianceFormPreview />
        </Collapse>
        <Collapse in={isSubmitButtonVisible}>
          <Box mt={2}>
            <ActionButton type="submit" width={120} disabled={isSubmitButtonDisabled}>
              Save
            </ActionButton>
          </Box>
        </Collapse>
      </Box>
    </FormProvider>
  );
};

export default ComplianceSetting;
