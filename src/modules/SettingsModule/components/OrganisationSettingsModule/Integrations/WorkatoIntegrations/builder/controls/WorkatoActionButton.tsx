import { LoadingButton, LoadingButtonProps } from '@mui/lab';
import React, { useMemo } from 'react';
import { makeStyles } from '@mui/styles';
import { AlyceTheme, Tooltip } from '@alycecom/ui';
import { useSelector } from 'react-redux';

import { TRecipeAction } from '../../../../../../store/organisation/integrations/workato/workato.types';
import { useWorkatoTrackRecipeAction } from '../../hooks/useWorkatoTrackRecipeAction';
import { makeGetIsRecipeActionLoading } from '../../../../../../store/organisation/integrations/workato/recipes/recipes.selectors';
import { getIsActiveIntegrationsLimitExceeded } from '../../../../../../store/organisation/integrations/workato/subscription/subscription.selectors';

interface IWorkatoActionButton extends LoadingButtonProps {
  recipeId: string;
  isRecipeRunning: boolean;
  disabled: boolean;
  isIntegrationActive: boolean;
  onSubmitWorkatoForm: (action: TRecipeAction) => void;
}

const useStyles = makeStyles<AlyceTheme>(({ palette }) => ({
  startButton: {
    width: 100,
    height: 48,
    backgroundColor: palette.green.mountainMeadowDark,
    color: palette.common.white,
    '&:hover': {
      backgroundColor: palette.green.superDark,
    },
  },
  stopButton: {
    width: 100,
    height: 48,
    backgroundColor: palette.common.white,
    color: palette.link.main,
    outline: `1px solid ${palette.link.main}`,
    '&.Mui-disabled': {
      outline: 'none',
    },
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  tooltip: {
    width: 180,
    '& .MuiTooltip-tooltip': {
      fontSize: '16px',
    },
  },
}));

const WorkatoActionButton = ({
  recipeId,
  disabled,
  isRecipeRunning,
  onSubmitWorkatoForm,
  isIntegrationActive,
  ...loadingButtonProps
}: IWorkatoActionButton): JSX.Element => {
  const classes = useStyles();

  const trackRecipeAction = useWorkatoTrackRecipeAction();

  const isRunningAction = useSelector(useMemo(() => makeGetIsRecipeActionLoading(recipeId), [recipeId]));
  const isActiveIntegrationsLimitExceeded = useSelector(getIsActiveIntegrationsLimitExceeded);
  const isRecipeRunnable = isActiveIntegrationsLimitExceeded ? isIntegrationActive : true;

  const action = isRecipeRunning ? 'stop' : 'start';

  return (
    <Tooltip
      title="Please reach out to your CSM to unlock more recipes."
      disableHoverListener={isRecipeRunnable}
      placement="top"
      arrow
      className={classes.tooltip}
    >
      <LoadingButton
        className={isRecipeRunning ? classes.stopButton : classes.startButton}
        loading={isRunningAction}
        disabled={disabled}
        variant="contained"
        onClick={() => {
          onSubmitWorkatoForm(action);
          trackRecipeAction(recipeId, action);
        }}
        {...loadingButtonProps}
      >
        {isRecipeRunning ? 'Stop' : 'Start'}
      </LoadingButton>
    </Tooltip>
  );
};
export default WorkatoActionButton;
