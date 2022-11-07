import React, { forwardRef, memo, Ref } from 'react';
import { Box } from '@mui/material';

const sizes = {
  small: '100px',
  medium: '175px',
  large: '426px',
  auto: 'auto',
} as const;

export interface IFilterItemProps {
  size: keyof typeof sizes;
  children: JSX.Element;
}

const FilterItem = forwardRef(({ children, size, ...props }: IFilterItemProps, ref: Ref<HTMLDivElement>) => (
  <Box ref={ref} px={[0.25, 1]} flex={`1 1 ${sizes[size]}`} {...props}>
    {children}
  </Box>
));

export default memo(FilterItem);
