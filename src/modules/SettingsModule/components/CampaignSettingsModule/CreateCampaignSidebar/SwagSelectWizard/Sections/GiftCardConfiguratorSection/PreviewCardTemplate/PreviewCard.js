import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import { makeStyles } from '@mui/styles';

import {
  CARD_MOO_STYLE,
  CARD_SQUARE_STYLE,
  CARD_STANDARD_STYLE,
} from '../../../../../../../../../constants/swagSelect.constants';
import { CARD_FRONT_SIDE, FIRST_LINE, SECOND_LINE, THIRD_LINE } from '../configurator.constants';

import CardFrontTemplate from './CardFrontTemplate';
import CardBackTemplate from './CardBackTemplate';

const useStyle = makeStyles(() => ({
  common: {
    border: '0.5px solid #979797',
    borderRadius: 10,
    boxSizing: 'border-box',
  },
  [CARD_STANDARD_STYLE]: {
    width: '100%',
    height: '58%',
  },
  [CARD_MOO_STYLE]: {
    width: '91%',
    height: '65%',
  },
  [CARD_SQUARE_STYLE]: {
    width: '73%',
    height: '73%',
  },
}));

const PreviewCard = ({ side, cardStyle, cardColor, cardLogo, cardCopyLines }) => {
  const classes = useStyle();

  return (
    <Box className={`${classes.common} ${classes[cardStyle]}`} display="flex" height={1} alignItems="center">
      {side === CARD_FRONT_SIDE ? (
        <CardFrontTemplate
          cardStyle={cardStyle}
          cardColor={cardColor}
          cardLogo={cardLogo}
          cardCopyLines={cardCopyLines}
        />
      ) : (
        <CardBackTemplate cardColor={cardColor} cardStyle={cardStyle} />
      )}
    </Box>
  );
};

PreviewCard.propTypes = {
  side: PropTypes.string,
  cardStyle: PropTypes.string.isRequired,
  cardColor: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  cardLogo: PropTypes.any,
  cardCopyLines: PropTypes.shape({
    [FIRST_LINE]: PropTypes.string,
    [SECOND_LINE]: PropTypes.string,
    [THIRD_LINE]: PropTypes.string,
  }).isRequired,
};

PreviewCard.defaultProps = {
  side: 'front',
  cardLogo: undefined,
};

export default PreviewCard;
