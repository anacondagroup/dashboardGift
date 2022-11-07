import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { SearchField, DashboardIcon } from '@alycecom/ui';
import { makeStyles } from '@mui/styles';
import { Box, Grid, Typography, Button } from '@mui/material';

import { getGiftsCountFromTransferSelection } from '../../../../store/breakdowns/giftTransfer/giftTransfer.selectors';
import { openGiftTransferSidebar } from '../../../../store/breakdowns/giftTransfer/giftTransfer.actions';

const useStyles = makeStyles(({ palette, spacing }) => ({
  giftCounter: {
    whiteSpace: 'nowrap',
  },
  filtersButton: {
    width: '100%',
    height: '48px',
    boxShadow: 'none',
    padding: spacing(1, 3),
    color: palette.link.main,
    backgroundColor: 'transparent',
    border: `1px solid #c4c4c4`,
    '&:hover': {
      backgroundColor: palette.grey.A200,
    },
  },
  filtersIcon: {
    marginRight: spacing(1),
  },
}));

const GiftBreakdownToolbar = ({ placeholder, search, onSearch }) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const selectedGiftsCount = useSelector(getGiftsCountFromTransferSelection);

  return (
    <Grid container direction="row" wrap="nowrap">
      <SearchField placeholder={placeholder} value={search} onChange={onSearch} />
      {selectedGiftsCount > 0 && (
        <Box ml={10} display="flex" justify="flex-end" alignItems="center">
          <Typography className={classes.giftCounter}>
            {selectedGiftsCount} gift{selectedGiftsCount === 1 ? '' : 's'} selected
          </Typography>
          <Box ml={2} minWidth="230px" onClick={() => {}}>
            <Button
              data-testid="Dashboard-GiftBreakdownToolbar-MoveGiftsButton"
              variant="contained"
              className={classes.filtersButton}
              onClick={() => dispatch(openGiftTransferSidebar())}
            >
              <DashboardIcon color="inherit" icon="calendar" className={classes.filtersIcon} />
              Move gifts
            </Button>
          </Box>
        </Box>
      )}
    </Grid>
  );
};

GiftBreakdownToolbar.propTypes = {
  placeholder: PropTypes.string,
  search: PropTypes.string,
  onSearch: PropTypes.func.isRequired,
};

GiftBreakdownToolbar.defaultProps = {
  placeholder: '',
  search: '',
};

export default GiftBreakdownToolbar;
