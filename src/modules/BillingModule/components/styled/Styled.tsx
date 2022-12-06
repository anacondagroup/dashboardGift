import { TableCell, TableHead } from '@mui/material';
import { styled } from '@mui/styles';
import { AlyceTheme } from '@alycecom/ui';

export const StyledCell = styled(TableCell)<AlyceTheme>(({ theme: { palette } }) => ({
  color: palette.text.primary,
  fontSize: 14,
  lineHeight: '18px',
  fontWeight: 700,
}));

export const StyledHeaderCell = styled(TableCell)<AlyceTheme>(({ theme: { palette } }) => ({
  color: palette.primary.main,
  fontSize: 12,
  lineHeight: '16px',
  fontWeight: 'bold',
}));

export const StyledTableHeader = styled(TableHead)<AlyceTheme>(({ theme: { palette } }) => ({
  backgroundColor: palette.grey.lighten,
}));
