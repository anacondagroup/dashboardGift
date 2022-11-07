import React, { ReactNodeArray, useRef } from 'react';
import { Popper, Grow, Paper, ClickAwayListener, MenuList } from '@mui/material';
import { Button, Icon, IButtonProps } from '@alycecom/ui';
import { useModalState } from '@alycecom/hooks';

export interface IBulkActionsButtonProps extends IButtonProps {
  label: string;
  children: ReactNodeArray;
}

const styles = {
  dropdownButton: {
    justifyContent: 'space-between',
    px: 2,
  },
} as const;

const BulkActionsButton = ({
  disabled,
  label,
  children,
  sx = [],
  ...buttonProps
}: IBulkActionsButtonProps): JSX.Element => {
  const { handleClose, handleToggle, isOpen } = useModalState();
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  return (
    <>
      <ClickAwayListener onClickAway={handleClose}>
        <Button
          ref={buttonRef}
          sx={[styles.dropdownButton, ...(Array.isArray(sx) ? sx : [sx])]}
          {...buttonProps}
          onClick={handleToggle}
          borderColor="divider"
          size="small"
          endIcon={<Icon icon={isOpen ? 'angle-up' : 'angle-down'} />}
          disabled={disabled}
        >
          {label}
        </Button>
      </ClickAwayListener>
      <Popper open={isOpen} anchorEl={buttonRef.current} role={undefined} transition>
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <MenuList autoFocusItem>{children}</MenuList>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
};

export default BulkActionsButton;
