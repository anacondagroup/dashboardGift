import React, { MutableRefObject, useCallback, useEffect, useMemo } from 'react';
import { Box, Divider, Portal, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';

import WorkatoTextField from '../../builder/controls/WorkatoTextfield';
import {
  SixthSenseIntegrationField,
  TSixthSenseConfigurationForm,
} from '../../../../../../store/organisation/integrations/workato/picklists/picklists.types';
import { IWorkatoRecipe, TRecipeAction } from '../../../../../../store/organisation/integrations/workato/workato.types';
import WorkatoActionButton from '../../builder/controls/WorkatoActionButton';
import { WorkatoCampaignsAutocomplete } from '../../builder/controls/WorkatoCampaignsAutocomplete/WorkatoCampaignsAutocomplete';
import { getIfAllConnectionsAuthorized } from '../../../../../../store/organisation/integrations/workato/connections/connections.selectors';
import {
  getIsCurrentIntegrationActive,
  makeGetDefaultSixthSenseRecipeFieldValues,
  makeGetIsRecipeActionLoading,
} from '../../../../../../store/organisation/integrations/workato/recipes/recipes.selectors';
import { executeWorkatoRecipeAction } from '../../../../../../store/organisation/integrations/workato/recipes/recipes.actions';
import { getSixthSenseFieldCodeByFormFieldName, mapFormToSixthSenseRecipeFields } from '../helpers';
import WorkatoInfoTooltip from '../../builder/controls/WorkatoInfoTooltip';

import { sixthSenseSchema, sixthSenseSchemaDefaultValues } from './objectRecipe.schemas';
import { customObjectRecipe } from './SixthSenseConstants';

interface ISixthSenseObjectRecipeConfigurationProps {
  recipe: IWorkatoRecipe;
  isDisabled: boolean;
  buttonContainerRef: MutableRefObject<HTMLElement | null>;
}

export const SixthSenseObjectRecipeConfiguration = ({
  recipe,
  isDisabled,
  buttonContainerRef,
}: ISixthSenseObjectRecipeConfigurationProps): JSX.Element => {
  const dispatch = useDispatch();
  const { id: recipeId, running } = recipe;

  const isRecipeLoading = useSelector(useMemo(() => makeGetIsRecipeActionLoading(recipeId), [recipeId]));
  const isAllConnectionsAuthorized = useSelector(getIfAllConnectionsAuthorized);
  const isCurrentIntegrationActive = useSelector(getIsCurrentIntegrationActive);
  const isFormFieldDisabled = !isAllConnectionsAuthorized || isRecipeLoading || running;

  const defaultSixthSenseFormFieldValues = useSelector(
    useMemo(() => makeGetDefaultSixthSenseRecipeFieldValues(recipeId), [recipeId]),
  );

  const {
    control,
    reset,
    formState: { isValid },
    handleSubmit,
  } = useForm<TSixthSenseConfigurationForm>({
    mode: 'all',
    resolver: yupResolver(sixthSenseSchema),
    defaultValues: sixthSenseSchemaDefaultValues,
    shouldUnregister: true,
  });

  const handleRecipeAction = useCallback(
    (action: TRecipeAction) => {
      handleSubmit(formValues => {
        const isCustomObjRecipe = recipeId === customObjectRecipe.id;
        const fields = mapFormToSixthSenseRecipeFields(formValues, formFieldName =>
          getSixthSenseFieldCodeByFormFieldName(formFieldName, isCustomObjRecipe),
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
    if (defaultSixthSenseFormFieldValues) {
      reset(defaultSixthSenseFormFieldValues, { keepErrors: true });
    }
  }, [reset, defaultSixthSenseFormFieldValues]);

  return (
    <Box m={3}>
      <Divider variant="middle" />
      <Box mt={3}>
        <Typography className="H4-Dark">Configuration</Typography>

        <WorkatoTextField<TSixthSenseConfigurationForm>
          name={SixthSenseIntegrationField.Segment}
          control={control}
          disabled={isFormFieldDisabled}
          description="When an account that is part of ..."
          placeholder="type a 6Sense segment name"
          tooltip={
            <WorkatoInfoTooltip
              title={
                <Typography fontSize={16}>
                  This must be an exact match with the name of your segment in 6Sense.
                </Typography>
              }
            />
          }
        />
        <WorkatoTextField<TSixthSenseConfigurationForm>
          name={SixthSenseIntegrationField.Stage}
          control={control}
          disabled={isFormFieldDisabled}
          description="and moves into ..."
          placeholder="type a 6Sense stage name"
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
        <WorkatoTextField<TSixthSenseConfigurationForm>
          name={SixthSenseIntegrationField.JobTitles}
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
        <WorkatoCampaignsAutocomplete<TSixthSenseConfigurationForm>
          description="from that account, and add those contacts to ..."
          disabled={isFormFieldDisabled}
          autocompleteIdentifier={recipeId}
          name={SixthSenseIntegrationField.Campaign}
          control={control}
          placeholder="choose an Alyce 1:Many campaign"
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
