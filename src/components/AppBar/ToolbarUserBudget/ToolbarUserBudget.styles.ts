import { AlyceTheme, GlobalFonts } from '@alycecom/ui';

export const styles = {
  container: {
    display: 'flex',
    margin: ({ spacing }: AlyceTheme) => spacing(-0.5, 2, 3, 1),
  },
  noBudgetContainer: {
    marginRight: 2,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  budgetsContainer: {
    alignSelf: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    gap: ({ spacing }: AlyceTheme) => spacing(1),
    marginRight: ({ spacing }: AlyceTheme) => spacing(1),
  },
  budgetLine: {
    display: 'flex',
    maxWidth: 600,
    justifyContent: 'space-between',
    gap: ({ spacing }: AlyceTheme) => spacing(2),
  },
  text: GlobalFonts['.Body-Regular-Center-White'],
  emphasizedText: GlobalFonts['.Body-Regular-Center-White-Bold'],
  warningDot: {
    width: 10,
    height: 10,
    borderRadius: '50%',
    backgroundColor: ({ palette }: AlyceTheme) => palette.additional.red80,
    marginTop: ({ spacing }: AlyceTheme) => spacing(0.75),
    marginLeft: ({ spacing }: AlyceTheme) => spacing(0.75),
  },
  tooltip: {
    paddingTop: ({ spacing }: AlyceTheme) => spacing(0.5),
    '& .MuiTooltip-tooltip': {
      maxWidth: 400,
    },
  },
  teamNameWrapper: {
    display: 'inline-block',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    width: 120,
  },
  teamName: {
    display: 'inline-block',
    fontSize: 12,
    fontWeight: 400,
    lineHeight: '16px',
    color: ({ palette }: AlyceTheme) => palette.additional.chambray20,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    width: 120,
  },
  icon: {
    fontSize: 16,
    color: ({ palette }: AlyceTheme) => palette.additional.chambray20,
  },
} as const;
