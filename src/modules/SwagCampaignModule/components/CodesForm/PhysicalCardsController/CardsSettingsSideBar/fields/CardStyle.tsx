import React, { useCallback, useMemo } from 'react';
import { Control, useController } from 'react-hook-form';
import { Box, FormHelperText, Theme } from '@mui/material';

import {
  CardMooStyle,
  CardSquareStyle,
  CardStandardStyle,
} from '../../../../../store/swagCampaign/steps/codes/codes.constants';
import {
  TCardsDesignFormValues,
  CardsDesignDataFields,
} from '../../../../../store/swagCampaign/steps/codes/codes.types';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: ({ palette }: Theme) => palette.link.main,
    minWidth: 65,
    textAlign: 'center',
  },
  commonBox: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
    borderRadius: 3,
    boxSizing: 'border-box',
    cursor: 'pointer',
  },
  active: {
    color: ({ palette }: Theme) => palette.green.fruitSalad,
  },
  activeBox: {
    border: `2px solid`,
    borderRadius: ({ spacing }: Theme) => spacing(0.25),
  },
  [CardStandardStyle]: {
    width: 34,
    height: 17,
    border: `1px solid`,
    borderRadius: ({ spacing }: Theme) => spacing(0.25),
  },
  [CardMooStyle]: {
    width: 34,
    height: 23,
    border: `1px solid`,
    borderRadius: ({ spacing }: Theme) => spacing(0.25),
  },
  [CardSquareStyle]: {
    width: 34,
    height: 34,
    border: `1px solid`,
    borderRadius: ({ spacing }: Theme) => spacing(0.25),
  },
  title: {
    fontSize: 14,
  },
  dimensions: {
    fontSize: 12,
  },
} as const;

export interface ICardStyleProps {
  control: Control<TCardsDesignFormValues>;
  onChangeCardStyle: (currentCardStyle: string) => void;
}

const CardStyle = ({ control, onChangeCardStyle }: ICardStyleProps): JSX.Element => {
  const name = CardsDesignDataFields.CardType;

  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  const cardStyles = (currentStyle: string) => ({
    [CardStandardStyle]: {
      title: 'Standard',
      dimensions: '3.5x2.0',
      active: currentStyle === CardStandardStyle,
    },
    [CardMooStyle]: {
      title: 'MOO Size',
      dimensions: '3.3x2.16',
      active: currentStyle === CardMooStyle,
    },
    [CardSquareStyle]: {
      title: 'Square',
      dimensions: '2.56x2.56',
      active: currentStyle === CardSquareStyle,
    },
  });

  const getCardClassType = useCallback((cardType: string) => {
    switch (cardType) {
      case CardMooStyle:
        return styles[CardMooStyle];
      case CardSquareStyle:
        return styles[CardSquareStyle];
      default:
        return styles[CardStandardStyle];
    }
  }, []);

  const cardsTypesList = useMemo(() => cardStyles(value), [value]);

  const handleChangeCardStyle = useCallback(
    (currentCardStyle: string) => {
      onChangeCardStyle(currentCardStyle);
      onChange(currentCardStyle);
    },
    [onChangeCardStyle, onChange],
  );

  return (
    <>
      <Box display="flex" justifyContent="space-between">
        {Object.entries(cardsTypesList).map(([styleName, card]) => (
          <Box key={styleName} sx={{ ...styles.container, ...(card.active && { ...styles.active }) }}>
            <Box
              sx={{ ...styles.commonBox, ...(card.active && { ...styles.activeBox }) }}
              onClick={() => handleChangeCardStyle(styleName)}
            >
              <Box
                sx={getCardClassType(styleName)}
                data-testid={`SwagBuilder.CodesStep.CardDesign.CardStyle.${styleName}`}
              />
            </Box>
            <Box mt={1} display="flex" flexDirection="column">
              <Box sx={styles.title}>{card.title}</Box>
              <Box sx={styles.dimensions}>{card.dimensions}</Box>
            </Box>
          </Box>
        ))}
      </Box>
      {error?.message && <FormHelperText>{error?.message}</FormHelperText>}
    </>
  );
};

export default CardStyle;
