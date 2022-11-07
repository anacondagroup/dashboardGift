import { yupResolver } from '@hookform/resolvers/yup';
import { mixed, number, object, string } from 'yup';

import { defaultCardColor, CardStandardStyle, defaultCardCopyLines } from '../codes.constants';
import { CardCmykColorFields, CardsDesignDataFields, CardsDesignLabels, TCardsDesignFormValues } from '../codes.types';

const cardLogoSchema = string().label(`${CardsDesignLabels.CardLogo}`).default('');

const cardTypeSchema = string().label(`${CardsDesignLabels.CardStyle}`).default(CardStandardStyle).required();

const cardHexColorSchema = string().label(`${CardsDesignLabels.CardHexColor}`).default(defaultCardColor).required();

const cyanSchema = number().label(`${CardsDesignLabels.Cyan}`).default(59).min(0).max(100).required();

const magentaSchema = number().label(`${CardsDesignLabels.Magenta}`).default(45).min(0).max(100).required();

const yellowSchema = number().label(`${CardsDesignLabels.Yellow}`).default(0).min(0).max(100).required();

const keySchema = number().label(`${CardsDesignLabels.Key}`).default(51).min(0).max(100).required();

const firstLineMessageSchema = string()
  .label(`${CardsDesignLabels.Line1}`)
  .default(defaultCardCopyLines.line1)
  .max(24)
  .when([CardsDesignDataFields.CardCopySecondLine, CardsDesignDataFields.CardCopyThirdLine], {
    is: (secondLine: string, thirdLine: string) => !secondLine && !thirdLine,
    then: string().min(3).required(),
  });

const secondLineMessageSchema = string()
  .label(`${CardsDesignLabels.Line2}`)
  .default(defaultCardCopyLines.line2)
  .nullable()
  .max(24);

const thirdLineMessageSchema = string()
  .label(`${CardsDesignLabels.Line3}`)
  .default(defaultCardCopyLines.line3)
  .nullable()
  .max(24);

const fileSchema = mixed().required('The logo is required');

const cardCmykColorSchema = object().shape({
  [CardCmykColorFields.Cyan]: cyanSchema,
  [CardCmykColorFields.Magenta]: magentaSchema,
  [CardCmykColorFields.Yellow]: yellowSchema,
  [CardCmykColorFields.Key]: keySchema,
});

const CardsDesignSettingsSchema = object().shape({
  [CardsDesignDataFields.CardLogo]: cardLogoSchema,
  [CardsDesignDataFields.CardType]: cardTypeSchema,
  [CardsDesignDataFields.CardHexColor]: cardHexColorSchema,
  [CardsDesignDataFields.CardCmykColor]: cardCmykColorSchema,
  [CardsDesignDataFields.CardCopyFirstLine]: firstLineMessageSchema,
  [CardsDesignDataFields.CardCopySecondLine]: secondLineMessageSchema,
  [CardsDesignDataFields.CardCopyThirdLine]: thirdLineMessageSchema,
  [CardsDesignDataFields.File]: fileSchema,
});

export const cardsDesignSettingsResolver = yupResolver(CardsDesignSettingsSchema);
export const cardsDesignSettingsDefaultValues = CardsDesignSettingsSchema.getDefault() as TCardsDesignFormValues;
