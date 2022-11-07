import React, { memo, useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Button } from '@alycecom/ui';

const useStyles = makeStyles({
  copy: {
    textTransform: 'none',
  },
  amount: {
    fontWeight: 'bold',
  },
});

export interface ISelectAllProps {
  isAllSelected: boolean;
  selectedAmount: number;
  totalAmount: number;
  itemsName?: string;
  onToggleSelection: (isAllSelected: boolean) => void;
}

const SelectAllSection = ({
  isAllSelected,
  selectedAmount,
  totalAmount,
  itemsName = 'items',
  onToggleSelection,
}: ISelectAllProps): JSX.Element => {
  const classes = useStyles();

  const isAllSelectedValue = isAllSelected || selectedAmount === totalAmount;
  const buttonText = isAllSelectedValue ? 'Clear selection' : `Select all ${totalAmount} ${itemsName}`;

  const handleToggleSelection = useCallback(() => {
    onToggleSelection(!isAllSelectedValue);
  }, [onToggleSelection, isAllSelectedValue]);

  return (
    <Box
      bgcolor="grey.dark"
      height={40}
      width={1}
      borderRadius="5px"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Typography className={classes.copy}>
        <span className={classes.amount}>{isAllSelectedValue ? totalAmount : selectedAmount}</span> {itemsName}
        &nbsp;have been selected.
      </Typography>
      <Button size="small" onClick={handleToggleSelection} variant="text">
        {buttonText}
      </Button>
    </Box>
  );
};

export default memo<typeof SelectAllSection>(SelectAllSection);
