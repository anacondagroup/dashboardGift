import React from 'react';
import { Box } from '@mui/material';
import moment from 'moment';

import alyceLogoWhite from '../../../../../../assets/images/symbols_logo_white.png';
import { CardSquareStyle, CardStandardStyle } from '../../../../store/swagCampaign/steps/codes/codes.constants';

import { styles } from './CardBackTemplateStyles';

export interface ICardBackTemplateProps {
  cardColor: string;
  cardStyle: string;
  expirationDate?: string;
}

const CardBackTemplate = ({ cardColor, cardStyle, expirationDate }: ICardBackTemplateProps): JSX.Element => (
  <Box sx={styles.cardContainer}>
    <Box mt={4} sx={[cardStyle === CardSquareStyle ? styles.squareBodyCard : styles.standardAndMooBodyCard]}>
      <Box sx={[styles.title, cardStyle === CardSquareStyle ? styles.squareCardTitle : styles.standardAndMooCardTitle]}>
        HOW TO ACCEPT YOUR GIFT
      </Box>
      <Box sx={[cardStyle === CardSquareStyle ? styles.squareInstructive : styles.standardAndMooInstructive]}>
        <ol style={cardStyle === CardSquareStyle ? styles.squareStepsCard : styles.standardAndMooStepsCard}>
          <Box
            sx={[
              styles.listItem,
              cardStyle === CardSquareStyle ? styles.squareCardFont : styles.standardAndMooCardFont,
            ]}
          >
            <li>visit alyce.com/card</li>
            <li>
              enter this single use code &nbsp;
              <span
                style={
                  cardStyle === CardStandardStyle
                    ? { ...styles.standardCodeMock, ...styles.code }
                    : { ...styles.squareAndMooCodeMock, ...styles.code }
                }
              >
                XXXX-XXXX
              </span>
            </li>
            <li>choose to accept, exchange or donate your gift</li>
          </Box>
        </ol>
      </Box>
    </Box>
    <Box
      sx={[
        styles.bottomBox,
        cardStyle !== CardStandardStyle ? styles.squareAndMooCardHeight : styles.standardCardHeight,
      ]}
      bgcolor={cardColor}
    >
      <Box sx={styles.footerCard}>
        GIFT EXPERIENCE POWERED BY{' '}
        <Box ml={0.5}>
          <img src={alyceLogoWhite} alt="alyce logo white" height="10" />
        </Box>
      </Box>
      <Box mt={0.25}>Gift code valid through:</Box>
      <Box mt={0.25}>
        {expirationDate ? moment(expirationDate).format('MMM D, YYYY') : moment().format('MMM D, YYYY')}
      </Box>
    </Box>
  </Box>
);

export default CardBackTemplate;
