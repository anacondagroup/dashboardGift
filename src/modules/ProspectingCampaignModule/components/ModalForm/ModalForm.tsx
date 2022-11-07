import React, { BaseSyntheticEvent, Fragment, ReactNode } from 'react';
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, Theme } from '@mui/material';
import { Icon } from '@alycecom/ui';

const styles = {
  dialogTitle: {
    borderTop: ({ spacing, palette }: Theme) => `${spacing(0.5)} solid ${palette.green.dark}`,
  },
  dialogContent: {
    width: 558,
  },
} as const;

export interface IModalFormProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  actions: ReactNode;
  children: ReactNode;
  onSubmit?: (event: BaseSyntheticEvent) => void;
}

const ModalForm = ({ open, onClose, title, actions, children, onSubmit }: IModalFormProps): JSX.Element => {
  const Wrapper = onSubmit ? 'form' : Fragment;
  return (
    <Dialog open={open} onClose={onClose}>
      <Wrapper onSubmit={onSubmit}>
        <DialogTitle sx={styles.dialogTitle}>
          <Icon color="grey.main" icon="pencil" />
          <Box display="inline-block" fontWeight={400} ml={3}>
            {title}
          </Box>
        </DialogTitle>
        <DialogContent sx={styles.dialogContent}>
          <Box my={3}>{children}</Box>
        </DialogContent>
        <DialogActions>{actions}</DialogActions>
      </Wrapper>
    </Dialog>
  );
};

export default ModalForm;
