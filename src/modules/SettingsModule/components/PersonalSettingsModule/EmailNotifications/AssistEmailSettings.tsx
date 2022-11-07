import React from 'react';
import { Box, Checkbox, Chip, Typography, Tooltip } from '@mui/material';
import { makeStyles, withStyles } from '@mui/styles';
import { AlyceTheme } from '@alycecom/ui';

const useStyles = makeStyles<AlyceTheme>(({ palette, spacing }) => ({
  description: {
    fontSize: '14px',
    lineHeight: 1.71,
    color: palette.grey.main,
  },
  newBadge: {
    color: palette.primary.main,
    backgroundColor: palette.green.main,
    marginLeft: spacing(1.5),
  },
}));

const LightTooltip = withStyles(theme => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.text.primary,
    boxShadow: theme.shadows[2],
    fontSize: 16,
    padding: theme.spacing(2),
    width: 310,
    maxWidth: 'initial',
  },
  arrow: {
    color: theme.palette.common.white,

    '&::before': {
      boxShadow: theme.shadows[2],
    },
  },
  tooltipPlacementTop: {
    margin: 0,
  },
}))(Tooltip);

export type TOnAssistSettingsChange = (isEnabled: boolean) => void;

export interface IAssistEmailSettingsPropTypes {
  isAssistEnabled: boolean;
  onChange: TOnAssistSettingsChange;
  disabled: boolean;
}

const AssistEmailSettings = ({ isAssistEnabled, onChange, disabled }: IAssistEmailSettingsPropTypes): JSX.Element => {
  const classes = useStyles();

  return (
    <Box display="flex" flexDirection="column">
      <Box display="flex" alignItems="center">
        <Typography className="H4-Dark-Bold">Alyce Assist</Typography>
        <Chip size="small" label="New" className={classes.newBadge} />
      </Box>
      <Box display="flex" alignItems="flex-start" mt={1} ml={-1}>
        <LightTooltip
          title="You will need to connect your calendar to receive Alyce Assist emails"
          arrow
          placement="top"
          disableFocusListener={!disabled}
          disableHoverListener={!disabled}
          disableTouchListener={!disabled}
        >
          <Box data-testid="AssistEmail.Checkbox.Wrapper">
            <Checkbox
              data-testid="AssistEmail.Checkbox"
              checked={isAssistEnabled}
              onChange={(event, value) => onChange(value)}
              color="primary"
              disabled={disabled}
            />
          </Box>
        </LightTooltip>

        <Box mt={1}>
          <Typography className="Body-Regular-Left-Static">Send me an Alyce Assist email</Typography>
          <Typography className={classes.description}>
            A preparation email with user profile, meeting, company, and gift history details.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default AssistEmailSettings;
