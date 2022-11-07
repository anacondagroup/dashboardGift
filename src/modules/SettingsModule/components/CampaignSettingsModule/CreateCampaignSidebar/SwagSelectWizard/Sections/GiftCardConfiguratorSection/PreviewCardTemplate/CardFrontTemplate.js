import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { DashboardIcon } from '@alycecom/ui';

import {
  CARD_MOO_STYLE,
  CARD_SQUARE_STYLE,
  CARD_STANDARD_STYLE,
} from '../../../../../../../../../constants/swagSelect.constants';

const useStyles = makeStyles(() => ({
  contentBox: {
    width: '87.3%',
    border: '1px dotted #979797',
    borderRadius: 2,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoBox: {
    height: ({ cardStyle }) => (cardStyle === CARD_SQUARE_STYLE ? 56 : 66),
  },
  contentContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '66%',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    boxSizing: 'border-box',
  },
  copyBox: {
    height: 110,
    color: 'white',
    font: 'Arial',
    fontWeight: 'bold',
    fontSize: ({ cardStyle }) => {
      switch (cardStyle) {
        case CARD_STANDARD_STYLE:
          return 30;
        case CARD_MOO_STYLE:
          return 28;
        case CARD_SQUARE_STYLE:
          return 22;
        default:
          return 30;
      }
    },
  },
  logoImg: {
    maxWidth: ({ cardStyle }) => {
      switch (cardStyle) {
        case CARD_STANDARD_STYLE:
          return '22.5em';
        case CARD_MOO_STYLE:
          return '21.5em';
        case CARD_SQUARE_STYLE:
          return '17.5em';
        default:
          return '22.5em';
      }
    },
    height: '100%',
  },
}));

const CardFrontTemplate = ({ cardStyle, cardColor, cardLogo, cardCopyLines }) => {
  const classes = useStyles({ cardStyle });
  const linesArray = useMemo(() => Object.values(cardCopyLines).filter(Boolean), [cardCopyLines]);
  return (
    <Box width={1} height={1} borderRadius="10px">
      <Box display="flex" justifyContent="center" alignItems="center" height="34%">
        <Box className={`${classes.contentBox} ${classes.logoBox}`}>
          {cardLogo ? (
            <img src={cardLogo} alt="cardLogo" className={classes.logoImg} />
          ) : (
            <Box display="flex" alignItems="center">
              <DashboardIcon icon="image" color="grey" />
              <Box className="Body-Regular-Left-Inactive-Bold" ml={1}>
                No logo uploaded
              </Box>
            </Box>
          )}
        </Box>
      </Box>
      <Box className={classes.contentContainer} bgcolor={cardColor}>
        <Box className={`${classes.contentBox} ${classes.copyBox}`}>
          {linesArray.map((line, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <Box key={line + i}>{line}</Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

CardFrontTemplate.propTypes = {
  cardStyle: PropTypes.string.isRequired,
  cardColor: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  cardLogo: PropTypes.any,
  // eslint-disable-next-line react/forbid-prop-types
  cardCopyLines: PropTypes.object.isRequired,
};

CardFrontTemplate.defaultProps = {
  cardLogo: undefined,
};

export default CardFrontTemplate;
