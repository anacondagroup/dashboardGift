import React, { MutableRefObject, useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Divider, Portal, Typography } from '@mui/material';

import {
  IWorkatoRecipe,
  TRecipeAction,
  WorkatoProviders,
} from '../../../../../../store/organisation/integrations/workato/workato.types';
import {
  getIsCurrentIntegrationActive,
  makeGetDefaultRollworksRecipeFieldValues,
  makeGetIsRecipeActionLoading,
} from '../../../../../../store/organisation/integrations/workato/recipes/recipes.selectors';
import { makeGetIsTiedConnectionActive } from '../../../../../../store/organisation/integrations/workato/connections/connections.selectors';
import {
  RollworksIntegrationField,
  TRollworksConfigurationForm,
} from '../../../../../../store/organisation/integrations/workato/picklists/picklists.types';
import WorkatoTextField from '../../builder/controls/WorkatoTextfield';
import WorkatoInfoTooltip from '../../builder/controls/WorkatoInfoTooltip';
import { WorkatoCampaignsAutocomplete } from '../../builder/controls/WorkatoCampaignsAutocomplete/WorkatoCampaignsAutocomplete';
import { executeWorkatoRecipeAction } from '../../../../../../store/organisation/integrations/workato/recipes/recipes.actions';
import WorkatoActionButton from '../../builder/controls/WorkatoActionButton';
import { getRollworksFieldCodeByFormFieldName, mapFormToRollworksRecipeFields } from '../helpers';

import { rollworksSchema, rollworksSchemaDefaultValues } from './recipe.schemas';
import { rollworksViaSalesforceRecipe } from './RollworksConstants';

interface IRollworksRecipeConfigurationProps {
  recipe: IWorkatoRecipe;
  isDisabled: boolean;
  buttonContainerRef: MutableRefObject<HTMLElement | null>;
  tiedConnector: WorkatoProviders;
}

export const RollworksRecipeConfiguration = ({
  recipe,
  isDisabled,
  buttonContainerRef,
  tiedConnector,
}: IRollworksRecipeConfigurationProps): JSX.Element => {
  const dispatch = useDispatch();
  const { id: recipeId, running } = recipe;

  const isRecipeLoading = useSelector(useMemo(() => makeGetIsRecipeActionLoading(recipeId), [recipeId]));
  const isCurrentIntegrationActive = useSelector(getIsCurrentIntegrationActive);
  const isTiedConnectorActive = useSelector(
    useMemo(() => makeGetIsTiedConnectionActive(tiedConnector), [tiedConnector]),
  );

  const isFormFieldDisabled = isRecipeLoading || running || !isTiedConnectorActive;

  const defaultRollworksFormFieldValues = useSelector(
    useMemo(() => makeGetDefaultRollworksRecipeFieldValues(recipeId), [recipeId]),
  );

  const {
    control,
    reset,
    formState: { isValid },
    handleSubmit,
  } = useForm<TRollworksConfigurationForm>({
    mode: 'all',
    resolver: yupResolver(rollworksSchema),
    defaultValues: rollworksSchemaDefaultValues,
    shouldUnregister: true,
  });

  const handleRecipeAction = useCallback(
    (action: TRecipeAction) => {
      handleSubmit(formValues => {
        const isSFRecipe = recipeId === rollworksViaSalesforceRecipe.id;
        const fields = mapFormToRollworksRecipeFields(formValues, formFieldName =>
          getRollworksFieldCodeByFormFieldName(formFieldName, isSFRecipe),
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
    if (defaultRollworksFormFieldValues) {
      reset(defaultRollworksFormFieldValues, { keepErrors: true });
    }
  }, [reset, defaultRollworksFormFieldValues]);

  return (
    <Box m={3}>
      <Divider variant="middle" />
      <Box mt={3}>
        <Typography className="H4-Dark">Configuration</Typography>

        <WorkatoTextField<TRollworksConfigurationForm>
          name={RollworksIntegrationField.Account}
          control={control}
          disabled={isFormFieldDisabled}
          description="When an account that is part of ..."
          placeholder="type a RollWorks account list"
          tooltip={
            <WorkatoInfoTooltip
              title={
                <Typography fontSize={16}>
                  This must be an exact match with the name of your account list in RollWorks.
                </Typography>
              }
            />
          }
        />
        <WorkatoTextField<TRollworksConfigurationForm>
          name={RollworksIntegrationField.JourneyStage}
          control={control}
          disabled={isFormFieldDisabled}
          description="and moves into ..."
          placeholder="type a RollWorks journey stage name"
          tooltip={
            <WorkatoInfoTooltip
              title={
                <Typography fontSize={16}>
                  You may enter multiple stages as a comma-separated list. <br /> Example: &ldquo;Stage 1, Stage
                  2&ldquo; would trigger when accounts move into Stage 1 or Stage 2.
                </Typography>
              }
            />
          }
        />
        <WorkatoTextField<TRollworksConfigurationForm>
          name={RollworksIntegrationField.JobTitle}
          control={control}
          disabled={isFormFieldDisabled}
          description="find all contacts that contain ..."
          placeholder="type recipient job title "
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
        <WorkatoCampaignsAutocomplete<TRollworksConfigurationForm>
          description="from that account, and add those contacts to ..."
          disabled={isFormFieldDisabled}
          name={RollworksIntegrationField.Campaign}
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
