import React, { useCallback } from 'react';
import { Box, Grid, Theme } from '@mui/material';

import {
  CardMooStyle,
  CardSquareStyle,
  CardStandardStyle,
} from '../../../store/swagCampaign/steps/codes/codes.constants';
import { TSwagCardDesign } from '../../../store/swagCampaign/swagCampaign.types';

import CardBackTemplate from './CardsSettingsSideBar/CardBackTemplate';
import CardFrontTemplate from './CardsSettingsSideBar/CardFrontTemplate';

const styles = {
  cardBox: {
    border: '0.5px solid',
    borderColor: ({ palette }: Theme) => palette.grey.main,
    borderRadius: ({ spacing }: Theme) => spacing(0.1),
    margin: ({ spacing }: Theme) => spacing(1),
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

export interface ICardOrderPreviewProps {
  cardDesign: TSwagCardDesign | null;
  expirationDate?: string;
}

const CardOrderPreview = ({ cardDesign, expirationDate }: ICardOrderPreviewProps): JSX.Element => {
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
    <Grid
      container
      xs={12}
      component={Box}
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      width="450px"
      height="450px"
    >
      <Grid component={Box} item sx={{ ...styles.cardBox, ...getCardStyles(cardDesign?.cardType ?? '') }}>
        <CardFrontTemplate
          cardStyle={cardDesign?.cardType ?? ''}
          cardColor={cardDesign?.cardHexColor ?? ''}
          cardLogo={cardDesign?.file ?? ''}
          cardCopyLines={{
            line1: cardDesign?.cardCopyFirstLine ?? '',
            line2: cardDesign?.cardCopySecondLine ?? '',
            line3: cardDesign?.cardCopyThirdLine ?? '',
          }}
        />
      </Grid>
      <Grid component={Box} item sx={[styles.cardBox, getCardStyles(cardDesign?.cardType ?? '')]}>
        <CardBackTemplate
          cardColor={cardDesign?.cardHexColor ?? ''}
          cardStyle={cardDesign?.cardType ?? ''}
          expirationDate={expirationDate}
        />
      </Grid>
    </Grid>
  );
};

export default CardOrderPreview;
