import { Theme } from '@mui/material';

export const styles = {
  cardContainer: {
    width: 1,
    height: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: ({ palette }: Theme) => palette.text.primary,
  },
  code: {
    fontWeight: 'bold',
    fontSize: 22,
    color: 'black',
    whiteSpace: 'nowrap',
  },
  listItem: {
    lineHeight: 1.5,
    fontWeight: 'bold',
    fontFamily: 'Arial',
  },
  standardAndMooCardTitle: {
    textAlign: 'inherit',
    fontSize: 24,
  },
  squareCardTitle: {
    textAlign: 'center',
    fontSize: 26,
  },
  standardAndMooCardFont: {
    fontSize: 16,
  },
  squareCardFont: {
    fontSize: 14,
  },
  standardCardHeight: {
    height: 65,
  },
  squareAndMooCardHeight: {
    height: 70,
  },
  bottomBox: {
    width: '100%',
    color: 'white',
    fontSize: 9,
    textAlign: 'center',
    verticalAlign: 'center',
  },
  footerCard: {
    mt: 1.5,
    fontWeight: 'bold',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'end',
  },
  standardAndMooBodyCard: {
    width: '81%',
  },
  squareBodyCard: {
    width: '71%',
  },
  standardAndMooStepsCard: {
    paddingLeft: '18px',
  },
  squareStepsCard: {
    paddingLeft: '28px',
  },
  standardCodeMock: {
    lineHeight: 0,
  },
  squareAndMooCodeMock: {
    lineHeight: 1.5,
  },
  standardAndMooInstructive: {
    mt: 2,
  },
  squareInstructive: {
    mt: 2,
  },
} as const;
