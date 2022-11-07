import React, { memo, ReactNode } from 'react';
import { Box, BoxProps, Theme } from '@mui/material';

const styles = {
  container: {
    width: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 3,
    padding: 3,
    borderTop: ({ palette }: Theme) => `1px solid ${palette.primary.superLight}`,
    boxShadow: ({ palette }: Theme) => `0px -2px 4px 0px ${palette.grey.dark}`,
  },
  primaryButtonsContainer: {
    width: '220px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
} as const;

export interface IStepSectionFooterProps extends BoxProps {
  backButton?: ReactNode;
  cancelButton?: ReactNode;
  nextButton?: ReactNode;
}

const StepSectionFooter = ({
  backButton,
  nextButton,
  cancelButton,
  ...wrapperProps
}: IStepSectionFooterProps): JSX.Element => (
  <Box sx={styles.container} {...wrapperProps}>
    {backButton || <Box width={130}>&nbsp;</Box>}
    <Box sx={styles.primaryButtonsContainer}>
      {cancelButton || <Box width={130}>&nbsp;</Box>}
      {nextButton || <Box width={130}>&nbsp;</Box>}
    </Box>
  </Box>
);

export default memo(StepSectionFooter);
