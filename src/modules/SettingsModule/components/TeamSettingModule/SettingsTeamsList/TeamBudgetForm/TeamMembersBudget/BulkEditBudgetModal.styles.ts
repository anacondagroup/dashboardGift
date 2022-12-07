import { GlobalFonts } from '@alycecom/ui';
import { Theme } from '@mui/material';

export const styles = {
  budgetAllocationModal: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: ({ palette }: Theme) => palette.common.white,
    width: 600,
    borderTop: ({ palette }: Theme) => `4px solid ${palette.green.mountainMeadowLight}`,
    borderRadius: '4px',
    padding: ({ spacing }: Theme) => spacing(2),
    color: ({ palette }: Theme) => palette.primary.main,
  },
  content: {
    maxHeight: 600,
    overflow: 'auto',
    padding: ({ spacing }: Theme) => spacing(1.5),
  },
  modalHeaderContainer: {
    marginBottom: ({ spacing }: Theme) => spacing(2),
    color: ({ palette }: Theme) => palette.primary.main,
  },
  modalHeader: GlobalFonts['.H3-Chambray'],
  modalButtonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: ({ spacing }: Theme) => spacing(2),
  },
  closeIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
  okButton: {
    color: ({ palette }: Theme) => palette.common.white,
    backgroundColor: ({ palette }: Theme) => palette.green.dark,
    '&:hover': {
      backgroundColor: ({ palette }: Theme) => palette.green.mountainMeadowLight,
    },
    marginLeft: ({ spacing }: Theme) => spacing(2),
  },
  cancelButton: {
    color: ({ palette }: Theme) => palette.text.secondary,
  },
  warning: {
    backgroundColor: ({ palette }: Theme) => palette.yellow.sunflowerSuperLight,
    borderRadius: ({ spacing }: Theme) => spacing(1),
    padding: ({ spacing }: Theme) => spacing(2),
    marginBottom: ({ spacing }: Theme) => spacing(2),
  },
  paragraph: {
    marginBottom: ({ spacing }: Theme) => spacing(2),
  },
} as const;
