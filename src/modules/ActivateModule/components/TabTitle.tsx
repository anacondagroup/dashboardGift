import React, { FC } from 'react';
import { Box, BoxProps } from '@mui/material';
import { AlyceTheme } from '@alycecom/ui';
import { createStyles, makeStyles } from '@mui/styles';

interface IBoxProps extends BoxProps {}

const useStyles = makeStyles(({ spacing, palette }: AlyceTheme) =>
  createStyles({
    root: {
      fontSize: 18,
      fontWeight: 'bold',
      color: palette.grey.main,
      paddingBottom: spacing(1),
      borderBottom: `1px solid ${palette.grey.timberWolf}`,
    },
  }),
);
const TabTitle: FC<IBoxProps> = ({ children, ...props }: IBoxProps): JSX.Element => {
  const classes = useStyles();
  return (
    <Box className={classes.root} {...props}>
      {children}
    </Box>
  );
};

export default TabTitle;
