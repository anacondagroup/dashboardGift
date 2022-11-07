import React, { useCallback, useMemo } from 'react';
import { Box, Theme } from '@mui/material';
import { DashboardIcon } from '@alycecom/ui';

import { CardMooStyle, CardSquareStyle } from '../../../../store/swagCampaign/steps/codes/codes.constants';

const styles = {
  contentBox: {
    width: '87.3%',
    border: '1px dotted',
    borderColor: ({ palette }: Theme) => palette.grey.dusty,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '66%',
    boxSizing: 'border-box',
  },
  logoImg: {
    height: '100%',
  },
  copyBox: {
    height: 110,
    color: 'white',
    font: 'Arial',
    fontWeight: 'bold',
  },
} as const;

export interface ICardBackTemplateProps {
  cardStyle: string;
  cardColor: string;
  cardLogo?: string;
  cardCopyLines: {
    line1: string;
    line2: string;
    line3: string;
  };
}

const CardFrontTemplate = ({ cardStyle, cardColor, cardLogo, cardCopyLines }: ICardBackTemplateProps): JSX.Element => {
  const linesArray = useMemo(() => Object.values(cardCopyLines).filter(Boolean), [cardCopyLines]);

  const getLogoImageStyle = useCallback((cardSizeStyle: string) => {
    switch (cardSizeStyle) {
      case CardMooStyle:
        return '21.5em';
      case CardSquareStyle:
        return '17.5em';
      default:
        return '22.5em';
    }
  }, []);

  const getCopyBoxFontSizeStyle = useCallback((cardSizeStyle: string) => {
    switch (cardSizeStyle) {
      case CardMooStyle:
        return 28;
      case CardSquareStyle:
        return 22;
      default:
        return 30;
    }
  }, []);

  return (
    <Box width={1} height={1} borderRadius="10px">
      <Box display="flex" justifyContent="center" alignItems="center" height="34%">
        <Box sx={{ ...styles.contentBox, height: cardStyle === CardSquareStyle ? 56 : 66 }}>
          {cardLogo ? (
            <img src={cardLogo} alt="cardLogo" style={{ ...styles.logoImg, maxWidth: getLogoImageStyle(cardStyle) }} />
          ) : (
            <Box display="flex" alignItems="center">
              <DashboardIcon icon="image" color="grey" />
              <Box className="Body-Regular-Left-Inactive-Bold" ml={1}>
                No logo uploaded
              </Box>
            </Box>
          )}
        </Box>
      </Box>
      <Box sx={styles.contentContainer} bgcolor={cardColor}>
        <Box sx={{ ...styles.contentBox, ...styles.copyBox, fontSize: getCopyBoxFontSizeStyle(cardStyle) }}>
          {linesArray.map(line => (
            <Box key={`${line}`}>{line}</Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default CardFrontTemplate;
