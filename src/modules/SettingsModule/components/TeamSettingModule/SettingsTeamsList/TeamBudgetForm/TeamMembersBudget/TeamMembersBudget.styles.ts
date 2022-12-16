import { Theme } from '@mui/material';
import { palette } from '@alycecom/ui';

export const styles = {
  headContainer: {
    display: 'flex',
    margin: ({ spacing }: Theme) => spacing(3.75, 0, 1.25, 0),
    alignItems: 'center',
  },
  header: {
    fontSize: '20px',
    color: ({ palette: themePalette }: Theme) => themePalette.primary.main,
  },
  tableContainer: {
    border: ({ palette: themePalette }: Theme) => `1px solid ${themePalette.primary.superLight}`,
    borderRadius: 2,
  },
  tableScroll: {
    maxHeight: '35vh',
    overflow: 'scroll',
  },
  icon: {
    marginLeft: 0.5,
    color: palette.primary.superLight,
  },
  searchContainer: {
    width: '65%',
    margin: ({ spacing }: Theme) => spacing(1.25, 0),
  },
} as const;
