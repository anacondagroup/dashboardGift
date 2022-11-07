import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import { makeStyles } from '@mui/styles';

import {
  CARD_MOO_STYLE,
  CARD_SQUARE_STYLE,
  CARD_STANDARD_STYLE,
} from '../../../../../../../../../constants/swagSelect.constants';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: theme.palette.link.main,
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
    color: theme.palette.green.fruitSalad,
  },
  activeBox: {
    border: `2px solid currentcolor`,
  },
  [CARD_STANDARD_STYLE]: {
    width: 34,
    height: 17,
    border: `1px solid currentcolor`,
    borderRadius: 2,
  },
  [CARD_MOO_STYLE]: {
    width: 34,
    height: 23,
    border: `1px solid currentcolor`,
    borderRadius: 2,
  },
  [CARD_SQUARE_STYLE]: {
    width: 34,
    height: 34,
    border: `1px solid currentcolor`,
    borderRadius: 2,
  },
  title: {
    fontSize: 14,
    color: 'currentcolor',
  },
  dimensions: {
    fontSize: 12,
    color: 'currentcolor',
  },
}));

const cardStyles = currentStyle => ({
  [CARD_STANDARD_STYLE]: {
    title: 'Standard',
    dimensions: '3.5x2.0',
    active: currentStyle === CARD_STANDARD_STYLE,
  },
  [CARD_MOO_STYLE]: {
    title: 'MOO Size',
    dimensions: '3.3x2.16',
    active: currentStyle === CARD_MOO_STYLE,
  },
  [CARD_SQUARE_STYLE]: {
    title: 'Square',
    dimensions: '2.56x2.56',
    active: currentStyle === CARD_SQUARE_STYLE,
  },
});

const MooCardsStyle = ({ style, onChange }) => {
  const classes = useStyles();
  const cards = useMemo(() => cardStyles(style), [style]);
  return (
    <Box display="flex" justifyContent="space-between">
      {Object.entries(cards).map(([styleName, card]) => (
        <Box key={styleName} className={`${classes.container} ${card.active ? classes.active : ''}`}>
          <Box
            className={`${classes.commonBox} ${card.active ? classes.activeBox : ''}`}
            onClick={() => onChange(styleName)}
          >
            <Box className={classes[styleName]} />
          </Box>
          <Box mt={1} display="flex" flexDirection="column">
            <Box className={classes.title}>{card.title}</Box>
            <Box className={classes.dimensions}>{card.dimensions}</Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

MooCardsStyle.propTypes = {
  style: PropTypes.oneOf([CARD_STANDARD_STYLE, CARD_MOO_STYLE, CARD_SQUARE_STYLE]).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default MooCardsStyle;
