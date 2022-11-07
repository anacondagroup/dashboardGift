import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import moment from 'moment';

import alyceLogoWhite from '../../../../../../../../../assets/images/symbols_logo_white.png';
import { CARD_SQUARE_STYLE, CARD_STANDARD_STYLE } from '../../../../../../../../../constants/swagSelect.constants';

const useStyles = makeStyles(({ palette }) => ({
  contentBox: {
    width: ({ cardStyle }) => (cardStyle === CARD_SQUARE_STYLE ? '71%' : '81%'),
  },
  title: {
    fontWeight: 'bold',
    textAlign: ({ cardStyle }) => (cardStyle === CARD_SQUARE_STYLE ? 'center' : 'inherit'),
    textTransform: 'uppercase',
    fontSize: ({ cardStyle }) => (cardStyle === CARD_SQUARE_STYLE ? 26 : 24),
    color: palette.text.main,
  },
  code: {
    fontWeight: 'bold',
    fontSize: 22,
    color: 'black',
    whiteSpace: 'nowrap',
    lineHeight: ({ cardStyle }) => (cardStyle === CARD_STANDARD_STYLE ? 0 : 1.5),
  },
  listItem: {
    lineHeight: 1.5,
    fontWeight: 'bold',
    fontFamily: 'Arial',
    fontSize: ({ cardStyle }) => (cardStyle === CARD_SQUARE_STYLE ? 14 : 16),
  },
  bottomBox: {
    width: '100%',
    height: ({ cardStyle }) => (cardStyle !== CARD_STANDARD_STYLE ? 70 : 65),
    color: 'white',
    fontSize: 9,
    textAlign: 'center',
    verticalAlign: 'center',
  },
}));

const CardBackTemplate = ({ cardColor, cardStyle }) => {
  const classes = useStyles({ cardStyle });
  return (
    <Box width={1} height={1} display="flex" flexDirection="column" justifyContent="space-between" alignItems="center">
      <Box mt={4} className={classes.contentBox}>
        <Box className={classes.title}>HOW TO ACCEPT YOUR GIFT</Box>
        <Box mt={cardStyle === CARD_SQUARE_STYLE ? 2 : 4}>
          <ol style={{ paddingLeft: cardStyle === CARD_SQUARE_STYLE ? '28px' : '18px' }}>
            <li className={classes.listItem}>visit alyce.com/card</li>
            <li className={classes.listItem}>
              enter this single use code <span className={classes.code}>XXXX-XXXX</span>
            </li>
            <li className={classes.listItem}>choose to accept or exchange your gift</li>
          </ol>
        </Box>
      </Box>
      <Box className={classes.bottomBox} bgcolor={cardColor}>
        <Box mt={1.5} fontWeight="bold" display="flex" justifyContent="center" alignItems="end">
          GIFT EXPERIENCE POWERED BY{' '}
          <Box ml={0.5}>
            <img src={alyceLogoWhite} alt="alyce logo white" height="10" />
          </Box>
        </Box>
        <Box mt={0.25}>Gift code valid through:</Box>
        <Box mt={0.25}>{moment().add(90, 'd').format('MMM D, YYYY')}</Box>
      </Box>
    </Box>
  );
};
CardBackTemplate.propTypes = {
  cardStyle: PropTypes.string.isRequired,
  cardColor: PropTypes.string.isRequired,
};

export default CardBackTemplate;
