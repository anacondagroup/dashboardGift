import React, { MutableRefObject, useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Divider, Typography, Portal } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { IWorkatoRecipe, TRecipeAction } from '../../../../../../store/organisation/integrations/workato/workato.types';
import WorkatoPicklistAutocomplete from '../../builder/controls/WorkatoPicklistAutocomplete';
import {
  Picklists,
  SlackIntegrationField,
  TSlackConfigurationForm,
} from '../../../../../../store/organisation/integrations/workato/picklists/picklists.types';
import {
  getIsCurrentIntegrationActive,
  makeGetDefaultDynamicSlackRecipesFieldValues,
  makeGetIsRecipeActionLoading,
} from '../../../../../../store/organisation/integrations/workato/recipes/recipes.selectors';
import WorkatoActionButton from '../../builder/controls/WorkatoActionButton';
import { executeWorkatoRecipeAction } from '../../../../../../store/organisation/integrations/workato/recipes/recipes.actions';
import { getIfAllConnectionsAuthorized } from '../../../../../../store/organisation/integrations/workato/connections/connections.selectors';
import { getSlackFieldCodeByFormFieldName, mapFormToSlackRecipeFields } from '../helpers';

import { slackSchema, slackSchemaDefaultValues } from './dynamicSlackRecipe.schemas';

interface IDynamicRecipeConfigurationProps {
  recipe: IWorkatoRecipe;
  isDisabled: boolean;
  buttonContainerRef: MutableRefObject<HTMLElement | null>;
}

const DynamicSlackRecipeConfiguration = ({
  recipe,
  buttonContainerRef,
  isDisabled,
}: IDynamicRecipeConfigurationProps): JSX.Element => {
  const dispatch = useDispatch();
  const { id: recipeId, running } = recipe;

  const isRecipeLoading = useSelector(useMemo(() => makeGetIsRecipeActionLoading(recipeId), [recipeId]));
  const isAllConnectionsAuthorized = useSelector(getIfAllConnectionsAuthorized);
  const isCurrentIntegrationActive = useSelector(getIsCurrentIntegrationActive);
  const isFormFieldDisabled = !isAllConnectionsAuthorized || isRecipeLoading || running;

  const defaultSlackRecipeFormValues = useSelector(
    useMemo(() => makeGetDefaultDynamicSlackRecipesFieldValues(recipeId), [recipeId]),
  );

  const {
    control,
    reset,
    handleSubmit,
    formState: { isValid },
  } = useForm<TSlackConfigurationForm>({
    mode: 'all',
    resolver: yupResolver(slackSchema),
    defaultValues: slackSchemaDefaultValues,
    shouldUnregister: true,
  });

  const handleRecipeAction = useCallback(
    (action: TRecipeAction) => {
      handleSubmit(formValues => {
        const fields = mapFormToSlackRecipeFields(formValues, formFieldName =>
          getSlackFieldCodeByFormFieldName(formFieldName),
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
    if (defaultSlackRecipeFormValues) {
      reset(defaultSlackRecipeFormValues, { keepErrors: true });
    }
  }, [reset, defaultSlackRecipeFormValues]);

  return (
    <Box m={3}>
      <Divider variant="middle" />
      <Box mt={3}>
        <Typography className="H4-Dark">Configuration</Typography>

        <WorkatoPicklistAutocomplete<TSlackConfigurationForm>
          control={control}
          disabled={isFormFieldDisabled}
          name={SlackIntegrationField.GiftStatus}
          placeholder="choose a gift status"
          description="When a gift moves into ..."
          picklistName={Picklists.GiftEvents}
        />
        <WorkatoPicklistAutocomplete<TSlackConfigurationForm>
          control={control}
          disabled={isFormFieldDisabled}
          name={SlackIntegrationField.Channel}
          placeholder="choose a Slack channel"
          description="post a message to ..."
          picklistName={Picklists.GetConversationPicklist}
        />

        <Portal container={buttonContainerRef.current}>
          <WorkatoActionButton
            recipeId={recipe.id}
            isRecipeRunning={recipe.running}
            disabled={isDisabled || !isValid}
            onSubmitWorkatoForm={handleRecipeAction}
            isIntegrationActive={isCurrentIntegrationActive}
          />
        </Portal>
      </Box>
    </Box>
  );
};
export default DynamicSlackRecipeConfiguration;
