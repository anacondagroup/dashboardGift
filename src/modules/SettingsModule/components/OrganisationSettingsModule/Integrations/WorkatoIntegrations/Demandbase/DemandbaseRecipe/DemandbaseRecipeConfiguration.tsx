import React, { MutableRefObject, useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Divider, Portal, Typography } from '@mui/material';

import { IWorkatoRecipe, TRecipeAction } from '../../../../../../store/organisation/integrations/workato/workato.types';
import {
  getIsCurrentIntegrationActive,
  makeGetDefaultDemandbaseRecipeFieldValues,
  makeGetIsRecipeActionLoading,
} from '../../../../../../store/organisation/integrations/workato/recipes/recipes.selectors';
import { getIfAllConnectionsAuthorized } from '../../../../../../store/organisation/integrations/workato/connections/connections.selectors';
import {
  DemandbaseIntegrationField,
  TDemandbaseConfigurationForm,
} from '../../../../../../store/organisation/integrations/workato/picklists/picklists.types';
import WorkatoTextField from '../../builder/controls/WorkatoTextfield';
import WorkatoInfoTooltip from '../../builder/controls/WorkatoInfoTooltip';
import { WorkatoCampaignsAutocomplete } from '../../builder/controls/WorkatoCampaignsAutocomplete/WorkatoCampaignsAutocomplete';
import WorkatoActionButton from '../../builder/controls/WorkatoActionButton';
import { executeWorkatoRecipeAction } from '../../../../../../store/organisation/integrations/workato/recipes/recipes.actions';
import { getDemandbaseFieldCodeByFormFieldName, mapFormToDemandbaseRecipeFields } from '../helpers';

import { demandbaseSchema, demandbaseSchemaDefaultValues } from './recipe.schemas';

interface IDemandbaseRecipeConfigurationProps {
  recipe: IWorkatoRecipe;
  isDisabled: boolean;
  buttonContainerRef: MutableRefObject<HTMLElement | null>;
}

export const DemandbaseRecipeConfiguration = ({
  recipe,
  isDisabled,
  buttonContainerRef,
}: IDemandbaseRecipeConfigurationProps): JSX.Element => {
  const dispatch = useDispatch();
  const { id: recipeId, running } = recipe;

  const isRecipeLoading = useSelector(useMemo(() => makeGetIsRecipeActionLoading(recipeId), [recipeId]));
  const isAllConnectionsAuthorized = useSelector(getIfAllConnectionsAuthorized);
  const isCurrentIntegrationActive = useSelector(getIsCurrentIntegrationActive);
  const isFormFieldDisabled = !isAllConnectionsAuthorized || isRecipeLoading || running;

  const defaultDemandbaseFormFieldValues = useSelector(
    useMemo(() => makeGetDefaultDemandbaseRecipeFieldValues(recipeId), [recipeId]),
  );

  const {
    control,
    reset,
    formState: { isValid },
    handleSubmit,
  } = useForm<TDemandbaseConfigurationForm>({
    mode: 'all',
    resolver: yupResolver(demandbaseSchema),
    defaultValues: demandbaseSchemaDefaultValues,
    shouldUnregister: true,
  });

  const handleRecipeAction = useCallback(
    (action: TRecipeAction) => {
      handleSubmit(formValues => {
        const fields = mapFormToDemandbaseRecipeFields(formValues, formFieldName =>
          getDemandbaseFieldCodeByFormFieldName(formFieldName),
        );

        dispatch(
          executeWorkatoRecipeAction({
            recipeId,
            action,
            fields: action === 'start' ? fields : undefined,
          }),
        );
      })();
    },
    [dispatch, handleSubmit, recipeId],
  );

  useEffect(() => {
    if (defaultDemandbaseFormFieldValues) {
      reset(
        {
          [DemandbaseIntegrationField.Stage]: defaultDemandbaseFormFieldValues.stage as TDemandbaseConfigurationForm[DemandbaseIntegrationField.Stage],
          [DemandbaseIntegrationField.Minutes]: defaultDemandbaseFormFieldValues.minutes as TDemandbaseConfigurationForm[DemandbaseIntegrationField.Minutes],
          [DemandbaseIntegrationField.JobTitles]: defaultDemandbaseFormFieldValues.jobTitles as TDemandbaseConfigurationForm[DemandbaseIntegrationField.JobTitles],
          [DemandbaseIntegrationField.Campaign]: defaultDemandbaseFormFieldValues.campaign as TDemandbaseConfigurationForm[DemandbaseIntegrationField.Campaign],
        },
        { keepErrors: true },
      );
    }
  }, [reset, defaultDemandbaseFormFieldValues]);

  return (
    <Box m={3}>
      <Divider variant="middle" />
      <Box mt={3}>
        <Typography className="H4-Dark">Configuration</Typography>

        <WorkatoTextField<TDemandbaseConfigurationForm>
          name={DemandbaseIntegrationField.Stage}
          control={control}
          disabled={isFormFieldDisabled}
          description="When an account that is in ..."
          placeholder="type a Demandbase stage"
          tooltip={
            <WorkatoInfoTooltip
              title={
                <Typography fontSize={16}>
                  You may enter multiple stages as a comma-separated list. Example: &ldquo;Stage 1, Stage 2&ldquo; would
                  include accounts that are currently in Stage 1 or Stage 2.
                </Typography>
              }
            />
          }
        />
        <WorkatoTextField<TDemandbaseConfigurationForm>
          name={DemandbaseIntegrationField.Minutes}
          control={control}
          disabled={isFormFieldDisabled}
          description="and whose engagement increases to greater than ..."
          placeholder="type Engagement minutes"
          tooltip={
            <WorkatoInfoTooltip
              title={<Typography fontSize={16}>Enter a whole number for this threshold.</Typography>}
            />
          }
        />
        <WorkatoTextField<TDemandbaseConfigurationForm>
          name={DemandbaseIntegrationField.JobTitles}
          control={control}
          disabled={isFormFieldDisabled}
          description="find all contacts that contain ..."
          placeholder="type recipient job title"
          tooltip={
            <WorkatoInfoTooltip
              title={
                <Typography fontSize={16}>
                  You may enter one value. Any contacts from your Salesforce system whose job titles contain this value
                  will be added.
                  <br /> Example: &ldquo;Marketing&ldquo; adds &ldquo;VP Marketing&ldquo; and &ldquo;Director of
                  Marketing&ldquo;
                </Typography>
              }
            />
          }
        />
        <WorkatoCampaignsAutocomplete<TDemandbaseConfigurationForm>
          description="from that account, and add those contacts to ..."
          disabled={isFormFieldDisabled}
          name={DemandbaseIntegrationField.Campaign}
          control={control}
          placeholder="choose an Alyce 1:Many campaign"
          autocompleteIdentifier={recipeId}
          tooltip={
            <WorkatoInfoTooltip
              title={
                <Typography fontSize={16}>
                  Contacts will only be added to the specified 1:Many campaign once.
                </Typography>
              }
            />
          }
        />
        <Portal container={buttonContainerRef.current}>
          <WorkatoActionButton
            recipeId={recipeId}
            isRecipeRunning={running}
            disabled={isDisabled || !isValid}
            onSubmitWorkatoForm={handleRecipeAction}
            isIntegrationActive={isCurrentIntegrationActive}
          />
        </Portal>
      </Box>
    </Box>
  );
};
