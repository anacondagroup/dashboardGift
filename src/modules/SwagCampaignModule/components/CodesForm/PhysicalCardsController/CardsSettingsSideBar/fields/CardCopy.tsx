import React, { useCallback } from 'react';
import { Control, useController } from 'react-hook-form';
import { Box, TextField, Theme } from '@mui/material';

import {
  CardsDesignDataFields,
  CardsDesignLabels,
  CardCopyLinesFields,
  TCardsDesignFormValues,
  TCardCopyLines,
} from '../../../../../store/swagCampaign/steps/codes/codes.types';

const styles = {
  copyField: {
    marginBottom: ({ spacing }: Theme) => spacing(1),
    width: '100%',
  },
} as const;

export interface ICardCopyProps {
  control: Control<TCardsDesignFormValues>;
  copyLines: TCardCopyLines;
  onChangeCardCopy: (cardCopyLines: TCardCopyLines) => void;
}

const CardCopy = ({ control, copyLines, onChangeCardCopy }: ICardCopyProps): JSX.Element => {
  const cardCopyFirstLine = CardsDesignDataFields.CardCopyFirstLine;
  const cardCopySecondLine = CardsDesignDataFields.CardCopySecondLine;
  const cardCopyThirdLine = CardsDesignDataFields.CardCopyThirdLine;

  const {
    field: firstLineField,
    fieldState: { error: firstLineFieldError },
  } = useController({
    name: cardCopyFirstLine,
    control,
  });
  const {
    field: secondLineField,
    fieldState: { error: secondLineFieldError },
  } = useController({
    name: cardCopySecondLine,
    control,
  });
  const {
    field: thirdLineField,
    fieldState: { error: thirdLineFieldError },
  } = useController({
    name: cardCopyThirdLine,
    control,
  });

  const handleChangeLine = useCallback(
    (currentValue: string, currentLine: string) => {
      switch (currentLine) {
        case CardCopyLinesFields.Line2:
          return secondLineField.onChange(currentValue);
        case CardCopyLinesFields.Line3:
          return thirdLineField.onChange(currentValue);
        default:
          return firstLineField.onChange(currentValue);
      }
    },
    [firstLineField, secondLineField, thirdLineField],
  );

  const handleChangeCopyLines = useCallback(
    (currentValue: string, currentLine: string) => {
      const currentCopyLines = { ...copyLines, [currentLine]: currentValue.trimLeft() };
      handleChangeLine(currentValue, currentLine);
      onChangeCardCopy(currentCopyLines);
    },
    [copyLines, onChangeCardCopy, handleChangeLine],
  );

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" maxWidth={300}>
        <Box className="Label-Table-Left-Static">{CardsDesignLabels.CardCopy}</Box>
        <Box className="Body-Small-Success">Max 24 characters per line</Box>
      </Box>
      <Box maxWidth={300}>
        <TextField
          label={CardsDesignLabels.Line1}
          variant="outlined"
          margin="normal"
          value={firstLineField.value}
          fullWidth
          required
          onChange={e => handleChangeCopyLines(e.target.value, CardCopyLinesFields.Line1)}
          error={!!firstLineFieldError?.message}
          helperText={firstLineFieldError?.message}
          sx={styles.copyField}
          inputProps={{ 'data-testid': 'SwagBuilder.CodesStep.CardDesign.CopyFirstLine' }}
        />
        <TextField
          label={CardsDesignLabels.Line2}
          variant="outlined"
          margin="normal"
          value={secondLineField.value}
          fullWidth
          required
          onChange={e => handleChangeCopyLines(e.target.value, CardCopyLinesFields.Line2)}
          error={!!secondLineFieldError?.message}
          helperText={secondLineFieldError?.message}
          sx={styles.copyField}
          inputProps={{ 'data-testid': 'SwagBuilder.CodesStep.CardDesign.CopySecondLine' }}
        />
        <TextField
          label={CardsDesignLabels.Line3}
          variant="outlined"
          margin="normal"
          value={thirdLineField.value}
          fullWidth
          required
          onChange={e => handleChangeCopyLines(e.target.value, CardCopyLinesFields.Line3)}
          error={!!thirdLineFieldError?.message}
          helperText={thirdLineFieldError?.message}
          sx={styles.copyField}
          inputProps={{ 'data-testid': 'SwagBuilder.CodesStep.CardDesign.CopyThirdLine' }}
        />
      </Box>
    </>
  );
};

export default CardCopy;
