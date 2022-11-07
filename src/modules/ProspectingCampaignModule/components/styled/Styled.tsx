import { Box, FormControl, FormLabel, Typography } from '@mui/material';
import { styled } from '@mui/styles';
import { AlyceTheme } from '@alycecom/ui';

export const SFormLabel = styled(FormLabel)<AlyceTheme>(({ theme: { palette } }) => ({
  color: palette.text.primary,
  fontWeight: 700,
  lineHeight: '1.5rem',
}));

export const LabelNote = styled(Box)<AlyceTheme>(({ theme: { palette } }) => ({
  fontSize: '0.875rem',
  color: palette.grey.main,
}));

export const SFormControl = styled(FormControl)({
  background: 'transparent',
});

export const SectionTitle = styled(Typography)<AlyceTheme>(({ theme: { palette } }) => ({
  color: palette.grey.main,
  fontSize: '1.25rem',
  lineHeight: '2rem',
  fontWeight: 700,
  borderBottom: `1px solid ${palette.grey.timberWolf}`,
}));

export const StepTitle = styled(Typography)<AlyceTheme>(({ theme: { palette, spacing } }) => ({
  fontSize: '1.375rem',
  lineHeight: '1.65rem',
  fontWeight: 700,
  color: palette.primary.main,
  padding: spacing(4, 0),
  textAlign: 'center',
}));
