import React, { useCallback, useState } from 'react';
import { Control, useController } from 'react-hook-form';
import { Box, TextField, Theme } from '@mui/material';
import { HtmlTip } from '@alycecom/ui';
import { cmyk2hex } from '@alycecom/utils';

import { defaultCMYKColor } from '../../../../../store/swagCampaign/steps/codes/codes.constants';
import {
  TCardsDesignFormValues,
  TCardCmykColorFormValues,
  CardsDesignDataFields,
  CardsDesignLabels,
  CardCmykColorFields,
} from '../../../../../store/swagCampaign/steps/codes/codes.types';

const styles = {
  previewBox: {
    display: 'flex',
    justifyContent: 'space-between',
    borderRadius: 1,
    width: 47,
    height: 47,
    marginTop: ({ spacing }: Theme) => spacing(2),
  },
  inputBox: {
    width: 55,
    marginLeft: ({ spacing }: Theme) => spacing(1),
    '& input::-webkit-outer-spin-button, input::-webkit-inner-spin-button': {
      WebkitAppearance: 'none',
      margin: 0,
    },
  },
} as const;

export interface ICardColorProps {
  control: Control<TCardsDesignFormValues>;
  onChangeHexColor: (hexColor: string) => void;
}

const CardColor = ({ control, onChangeHexColor }: ICardColorProps): JSX.Element => {
  const hexColorName = CardsDesignDataFields.CardHexColor;
  const cyanColorName = `${CardsDesignDataFields.CardCmykColor}.${CardCmykColorFields.Cyan}` as const;
  const magentaColorName = `${CardsDesignDataFields.CardCmykColor}.${CardCmykColorFields.Magenta}` as const;
  const yellowColorName = `${CardsDesignDataFields.CardCmykColor}.${CardCmykColorFields.Yellow}` as const;
  const keyColorName = `${CardsDesignDataFields.CardCmykColor}.${CardCmykColorFields.Key}` as const;

  const { field: hexColorField } = useController({
    name: hexColorName,
    control,
  });
  const {
    field: cyanField,
    fieldState: { error: cyanFieldError },
  } = useController({
    name: cyanColorName,
    control,
  });
  const {
    field: magentaField,
    fieldState: { error: magentaFieldError },
  } = useController({
    name: magentaColorName,
    control,
  });
  const {
    field: yellowField,
    fieldState: { error: yellowFieldError },
  } = useController({
    name: yellowColorName,
    control,
  });
  const {
    field: keyField,
    fieldState: { error: keyFieldError },
  } = useController({
    name: keyColorName,
    control,
  });

  const [CMYK, setCMYK] = useState<TCardCmykColorFormValues>(defaultCMYKColor);

  const handleUpdateColors = useCallback(
    (cmyk: TCardCmykColorFormValues) => {
      const currentColor = cmyk2hex(cmyk.c, cmyk.m, cmyk.y, cmyk.k);
      onChangeHexColor(currentColor);
      hexColorField.onChange(currentColor);
    },
    [onChangeHexColor, hexColorField],
  );

  const handleChangeFieldColor = useCallback(
    (currentColor: number, color: string) => {
      switch (color) {
        case CardCmykColorFields.Magenta:
          return magentaField.onChange(currentColor);
        case CardCmykColorFields.Yellow:
          return yellowField.onChange(currentColor);
        case CardCmykColorFields.Key:
          return keyField.onChange(currentColor);
        default:
          return cyanField.onChange(currentColor);
      }
    },
    [cyanField, magentaField, yellowField, keyField],
  );

  const handleOnChangeCmyk = useCallback(
    (valueColor: string, color: string) => {
      const colorValue: number = parseInt(valueColor, 10);

      const validatedValue = Math.max(0, Math.min(100, Number(colorValue) || 0));

      const updatedCMYK = { ...CMYK, [color]: validatedValue };

      handleChangeFieldColor(validatedValue, color);
      setCMYK(updatedCMYK);
      handleUpdateColors(updatedCMYK);
    },
    [CMYK, handleChangeFieldColor, setCMYK, handleUpdateColors],
  );

  return (
    <>
      <Box display="flex" justifyContent="space-between">
        <Box display="flex" justifyContent="space-between">
          <Box
            sx={styles.previewBox}
            bgcolor={hexColorField.value}
            data-testid="SwagBuilder.CodesStep.CardDesign.Colors.HexColor"
          />
          <TextField
            {...cyanField}
            label={CardsDesignLabels.Cyan}
            type="number"
            variant="outlined"
            margin="normal"
            fullWidth
            required
            onChange={e => handleOnChangeCmyk(e.target.value, CardCmykColorFields.Cyan)}
            error={!!cyanFieldError?.message}
            helperText={cyanFieldError?.message}
            sx={styles.inputBox}
            inputProps={{ 'data-testid': 'SwagBuilder.CodesStep.CardDesign.Colors.Cyan' }}
          />
          <TextField
            {...magentaField}
            label={CardsDesignLabels.Magenta}
            type="number"
            variant="outlined"
            margin="normal"
            fullWidth
            required
            onChange={e => handleOnChangeCmyk(e.target.value, CardCmykColorFields.Magenta)}
            error={!!magentaFieldError?.message}
            helperText={magentaFieldError?.message}
            sx={styles.inputBox}
            inputProps={{ 'data-testid': 'SwagBuilder.CodesStep.CardDesign.Colors.Magenta' }}
          />
          <TextField
            {...yellowField}
            label={CardsDesignLabels.Yellow}
            type="number"
            variant="outlined"
            margin="normal"
            fullWidth
            required
            onChange={e => handleOnChangeCmyk(e.target.value, CardCmykColorFields.Yellow)}
            error={!!yellowFieldError?.message}
            helperText={yellowFieldError?.message}
            sx={styles.inputBox}
            inputProps={{ 'data-testid': 'SwagBuilder.CodesStep.CardDesign.Colors.Yellow' }}
          />
          <TextField
            {...keyField}
            label={CardsDesignLabels.Key}
            type="number"
            variant="outlined"
            margin="normal"
            fullWidth
            required
            onChange={e => handleOnChangeCmyk(e.target.value, CardCmykColorFields.Key)}
            error={!!keyFieldError?.message}
            helperText={keyFieldError?.message}
            sx={styles.inputBox}
            inputProps={{ 'data-testid': 'SwagBuilder.CodesStep.CardDesign.Colors.Key' }}
          />
        </Box>
      </Box>
      <Box mt={2} width="19em">
        <HtmlTip>
          <>
            We recommend using a color that
            <br />
            contrast well against white text.
          </>
        </HtmlTip>
      </Box>
    </>
  );
};

export default CardColor;
