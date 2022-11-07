import { Button } from '@mui/material';
import { AlyceTheme } from '@alycecom/ui';
import { withStyles, createStyles } from '@mui/styles';

const ActionButton = withStyles(({ palette, spacing }: AlyceTheme) =>
  createStyles({
    root: {
      color: palette.link.main,
      height: 48,
      paddingLeft: spacing(3),
      paddingRight: spacing(3),
    },
    endIcon: {
      '& svg': {
        width: 16,
        height: 16,
      },
    },
  }),
)(Button);

export default ActionButton;
