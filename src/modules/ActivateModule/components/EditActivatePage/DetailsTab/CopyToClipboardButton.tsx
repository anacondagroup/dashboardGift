import React, { memo, useCallback, useState } from 'react';
import { ButtonProps, Tooltip } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useCopyToClipboard } from 'react-use';
import { AlyceTheme, Button, Icon } from '@alycecom/ui';

const useStyles = makeStyles<AlyceTheme>(() => ({
  icon: {
    transform: 'scaleX(-1)',
  },
}));

interface ICopyToClipboardButtonProps extends ButtonProps {
  value: string;
  onCopy?: () => void;
}

const CopyToClipboardButton = ({ value, onCopy, children, ...buttonProps }: ICopyToClipboardButtonProps) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const copyToClipboard = useCopyToClipboard()[1];

  const copyValue = useCallback(() => {
    setOpen(true);
    copyToClipboard(value);
    setTimeout(() => setOpen(false), 800);

    if (onCopy) {
      onCopy();
    }
  }, [copyToClipboard, value, onCopy]);

  return (
    <Tooltip
      PopperProps={{
        disablePortal: true,
      }}
      title="Copied!"
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      disableFocusListener
      disableHoverListener
      disableTouchListener
    >
      <span>
        <Button
          {...buttonProps}
          variant="contained"
          color="secondary"
          onClick={copyValue}
          endIcon={<Icon icon="copy" />}
          classes={{
            endIcon: classes.icon,
            ...buttonProps.classes,
          }}
        >
          {children}
        </Button>
      </span>
    </Tooltip>
  );
};

export default memo(CopyToClipboardButton);
