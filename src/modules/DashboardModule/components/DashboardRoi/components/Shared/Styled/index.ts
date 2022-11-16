import { Box, styled } from '@mui/material';

export const StyledRoiSectionTitle = styled(Box)(
  ({ theme }) => `
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: ${theme.palette.text.primary};
  font-size: 24px;
  line-height: 32px;
`,
);
