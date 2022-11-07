import React, { MutableRefObject, ReactNode, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import { AlyceTheme, Icon } from '@alycecom/ui';
import { Box, Grid, Paper, Typography } from '@mui/material';
import moment from 'moment';

import { makeGetIsTiedConnectionActive } from '../../../../../../store/organisation/integrations/workato/connections/connections.selectors';
import {
  IWorkatoRecipe,
  TIntegrationUrlParams,
  TRecipeAction,
  WorkatoProviders,
} from '../../../../../../store/organisation/integrations/workato/workato.types';
import WorkatoActionButton from '../controls/WorkatoActionButton';
import { getIsRecipeRunnable } from '../../../../../../store/organisation/integrations/workato/subscription/subscription.selectors';
import {
  getIsCurrentIntegrationActive,
  makeGetRecipeById,
} from '../../../../../../store/organisation/integrations/workato/recipes/recipes.selectors';
import LogosSection from '../blocks/LogosSection';

const useStyles = makeStyles<AlyceTheme>(({ spacing }) => ({
  paper: {
    padding: spacing(2, 0),
  },
  autocomplete: {
    width: '35%',
  },
  viewLogs: {
    display: 'inline-flex',
  },
}));

interface IConfigurableContentProps {
  recipe: IWorkatoRecipe;
  actionButtonContainerRef: MutableRefObject<HTMLElement | null>;
  disabled: boolean;
}

export interface IRecipeProps {
  title: string;
  description: string;
  appToAlyce?: boolean;
  recipeId: string;
  integratedAppLogoSrc: string;
  tiedConnector: WorkatoProviders;
  onRecipeAction?: (action: TRecipeAction) => void;
  children?: (configurableContent: IConfigurableContentProps) => ReactNode;
}

const Recipe = ({
  title,
  description,
  appToAlyce,
  recipeId,
  integratedAppLogoSrc,
  tiedConnector,
  onRecipeAction,
  children,
}: IRecipeProps): JSX.Element => {
  const classes = useStyles();
  const { integrationId } = useParams<TIntegrationUrlParams>();
  const actionButtonContainerRef = useRef(null);

  const recipe = useSelector(useMemo(() => makeGetRecipeById(recipeId), [recipeId]));

  const isAllTiedConnectionsConfigured = useSelector(
    useMemo(() => makeGetIsTiedConnectionActive(tiedConnector), [tiedConnector]),
  );
  const isRecipeRunnable = useSelector(getIsRecipeRunnable);
  const isCurrentIntegrationActive = useSelector(getIsCurrentIntegrationActive);

  const isStartButtonDisabled = !isAllTiedConnectionsConfigured || !isRecipeRunnable;

  if (!recipe) {
    return <></>;
  }

  const viewLogsLink = (
    <Link
      target="_blank"
      to={`/settings/organization/integrations/${integrationId}/logs/recipes/${recipe.workatoRecipeId}-${recipeId}#jobs`}
      className={classes.viewLogs}
    >
      View logs
      <Box display="inline-flex" alignItems="center" ml={1}>
        <Icon icon="external-link" fontSize={1} />
      </Box>
    </Link>
  );
  return (
    <Box mt={3} pb={3}>
      <Paper elevation={1} className={classes.paper}>
        <Grid container alignItems="flex-start" justifyContent="space-between">
          <Grid item xs>
            <Box ml={3}>
              <Typography className="H4-Dark">{title}</Typography>
              <Box mt={1} mb={1}>
                <Typography className="Body-Regular-Left-Static">{description}</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item zeroMinWidth>
            <Box p={1} mr={2} ref={actionButtonContainerRef}>
              {!children && onRecipeAction && (
                <WorkatoActionButton
                  recipeId={recipe.id}
                  isRecipeRunning={recipe.running}
                  disabled={isStartButtonDisabled}
                  isIntegrationActive={isCurrentIntegrationActive}
                  onSubmitWorkatoForm={onRecipeAction}
                />
              )}
            </Box>
          </Grid>
        </Grid>
        <Box ml={3} mb={3}>
          <LogosSection integratedAppLogoSrc={integratedAppLogoSrc} appToAlyce={appToAlyce} />
          <Box pt={1}>
            <Typography className="Body-Regular-Left-Inactive">
              {isAllTiedConnectionsConfigured && recipe.running ? 'Active' : 'Inactive'}
              {recipe.lastRunAt && ` |  Last started: ${moment(recipe.lastRunAt).format('MMM DD, YYYY')}`}
            </Typography>
          </Box>
        </Box>
        {children &&
          children({
            recipe,
            actionButtonContainerRef,
            disabled: isStartButtonDisabled,
          })}
        <Box display="flex" alignItems="center" justifyContent="flex-end" mr={2} p={1} height={0}>
          {viewLogsLink}
        </Box>
      </Paper>
    </Box>
  );
};

export default Recipe;
