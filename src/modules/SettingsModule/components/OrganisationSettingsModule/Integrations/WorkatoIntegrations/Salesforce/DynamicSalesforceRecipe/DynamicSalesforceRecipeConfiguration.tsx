import React, { MutableRefObject, useCallback, useEffect, useMemo } from 'react';
import { Box, Divider, Portal, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import WorkatoPicklistAutocomplete from '../../builder/controls/WorkatoPicklistAutocomplete';
import {
  Picklists,
  SalesforceIntegrationField,
  TSalesforceConfigurationForm,
} from '../../../../../../store/organisation/integrations/workato/picklists/picklists.types';
import WorkatoActionButton from '../../builder/controls/WorkatoActionButton';
import {
  getIsCurrentIntegrationActive,
  makeGetDefaultSalesforceRecipeFieldValues,
  makeGetIsRecipeActionLoading,
} from '../../../../../../store/organisation/integrations/workato/recipes/recipes.selectors';
import { getIfAllConnectionsAuthorized } from '../../../../../../store/organisation/integrations/workato/connections/connections.selectors';
import { IWorkatoRecipe, TRecipeAction } from '../../../../../../store/organisation/integrations/workato/workato.types';
import { executeWorkatoRecipeAction } from '../../../../../../store/organisation/integrations/workato/recipes/recipes.actions';
import { getSalesforceFieldCodeByFormFieldName, mapFormToSalesforceRecipeFields } from '../helpers';

import { salesforceSchema, salesforceSchemaDefaultValues } from './dynamicSalesforceRecipe.schemas';

interface IDynamicSalesforceRecipeConfigurationProps {
  recipe: IWorkatoRecipe;
  isDisabled: boolean;
  buttonContainerRef: MutableRefObject<HTMLElement | null>;
}

const DynamicSalesforceRecipeConfiguration = ({
  recipe,
  buttonContainerRef,
  isDisabled,
}: IDynamicSalesforceRecipeConfigurationProps): JSX.Element => {
  const dispatch = useDispatch();
  const { id: recipeId, running } = recipe;

  const isRecipeLoading = useSelector(useMemo(() => makeGetIsRecipeActionLoading(recipeId), [recipeId]));
  const isAllConnectionsAuthorized = useSelector(getIfAllConnectionsAuthorized);
  const isCurrentIntegrationActive = useSelector(getIsCurrentIntegrationActive);
  const isFormFieldDisabled = !isAllConnectionsAuthorized || isRecipeLoading || running;

  const defaultSalesforceRecipeFormValues = useSelector(
    useMemo(() => makeGetDefaultSalesforceRecipeFieldValues(recipeId), [recipeId]),
  );

  const {
    control,
    reset,
    handleSubmit,
    formState: { isValid },
  } = useForm<TSalesforceConfigurationForm>({
    mode: 'all',
    resolver: yupResolver(salesforceSchema),
    defaultValues: salesforceSchemaDefaultValues,
    shouldUnregister: true,
  });

  const handleRecipeAction = useCallback(
    (action: TRecipeAction) => {
      handleSubmit(formValues => {
        const fields = mapFormToSalesforceRecipeFields(formValues, formFieldName =>
          getSalesforceFieldCodeByFormFieldName(formFieldName),
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
    if (defaultSalesforceRecipeFormValues) {
      reset(defaultSalesforceRecipeFormValues, { keepErrors: true });
    }
  }, [reset, defaultSalesforceRecipeFormValues]);

  return (
    <Box m={3}>
      <Divider variant="middle" />
      <Box mt={3}>
        <Typography className="H4-Dark">Configuration</Typography>

        <WorkatoPicklistAutocomplete<TSalesforceConfigurationForm>
          control={control}
          disabled={isFormFieldDisabled}
          name={SalesforceIntegrationField.MemberStatus}
          placeholder="choose a Salesforce campaign member  status"
          description="When a campaign member moves into ..."
          picklistName={Picklists.CampaignMemberStatus}
        />

        <Box mt={2}>
          <Typography>add the campaign member to the connected 1:Many campaign.</Typography>
        </Box>

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

export default DynamicSalesforceRecipeConfiguration;
