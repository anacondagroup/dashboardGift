import React, { useCallback, useState } from 'react';
import { Box, Theme } from '@mui/material';

import {
  CardMooStyle,
  CardSquareStyle,
  CardStandardStyle,
  CardFrontSide,
  CardBackSide,
} from '../../../../store/swagCampaign/steps/codes/codes.constants';

import CardFrontTemplate from './CardFrontTemplate';
import CardBackTemplate from './CardBackTemplate';

const styles = {
  containerBox: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '450px',
    height: '450px',
    border: '1px solid',
    borderColor: ({ palette }: Theme) => palette.grey.dusty,
  },
  cardBox: {
    border: '0.5px solid',
    borderColor: ({ palette }: Theme) => palette.grey.dusty,
    borderRadius: ({ spacing }: Theme) => spacing(0.1),
    boxSizing: 'border-box',
  },
  sideLink: {
    fontWeight: 'bold',
    color: ({ palette }: Theme) => palette.link.main,
    cursor: 'pointer',
  },
  activeSideLink: {
    color: ({ palette }: Theme) => palette.primary.main,
  },
  [CardStandardStyle]: {
    width: '100%',
    height: '58%',
  },
  [CardMooStyle]: {
    width: '91%',
    height: '65%',
  },
  [CardSquareStyle]: {
    width: '73%',
    height: '73%',
  },
} as const;

export interface IPreviewCardProps {
  cardStyle: string;
  cardColor: string;
  cardLogo?: string;
  cardCopyLines: {
    line1: string;
    line2: string;
    line3: string;
  };
  expirationDate?: string;
}

const PreviewCard = ({
  cardStyle,
  cardColor,
  cardLogo,
  cardCopyLines,
  expirationDate,
}: IPreviewCardProps): JSX.Element => {
  const [activeCardSide, setCardSide] = useState(CardFrontSide);

  const getCardStyles = useCallback((cardType: string) => {
    switch (cardType) {
      case CardMooStyle:
        return styles[CardMooStyle];
      case CardSquareStyle:
        return styles[CardSquareStyle];
      default:
        return styles[CardStandardStyle];
    }
  }, []);

  return (
    <>
      <Box sx={styles.containerBox}>
        <Box sx={[styles.cardBox, getCardStyles(cardStyle)]} display="flex" height={1} alignItems="center">
          {activeCardSide === CardFrontSide ? (
            <CardFrontTemplate
              cardStyle={cardStyle}
              cardColor={cardColor}
              cardLogo={cardLogo}
              cardCopyLines={cardCopyLines}
            />
          ) : (
            <CardBackTemplate cardColor={cardColor} cardStyle={cardStyle} expirationDate={expirationDate} />
          )}
        </Box>
      </Box>
      <Box mt={1} display="flex" width="100px" justifyContent="space-between">
        <Box
          sx={[styles.sideLink, activeCardSide === CardFrontSide ? styles.activeSideLink : {}]}
          onClick={() => setCardSide(CardFrontSide)}
        >
          {CardFrontSide}
        </Box>
        <Box width="1px" borderRight="1px solid var(--Tundora-20)" />
        <Box
          sx={[styles.sideLink, activeCardSide === CardBackSide ? styles.activeSideLink : {}]}
          onClick={() => setCardSide(CardBackSide)}
        >
          {CardBackSide}
        </Box>
      </Box>
    </>
  );
};

export default PreviewCard;
