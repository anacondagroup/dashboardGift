import React, { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { equals } from 'ramda';
import { makeStyles } from '@mui/styles';
import { Box, Button, TextField, Divider } from '@mui/material';
import { useDispatch } from 'react-redux';
import { DashboardIcon, HtmlTip } from '@alycecom/ui';
import { cmyk2hex, hex2cmyk, fileToBase64 } from '@alycecom/utils';

import {
  CARD_STANDARD_STYLE,
  SS_CARD_CONFIGURATOR_STEP,
  SS_CARD_ORDER_OPTIONS_STEP,
  SWAG_SELECT_FLOW_STATES,
} from '../../../../../../../../constants/swagSelect.constants';
import UntouchedSection from '../../../../../CampaignSettings/CreateCampaignSidebar/CampaignSidebarSection/UntouchedSection/UntouchedSection';
import CompletedSection from '../../../../../CampaignSettings/CreateCampaignSidebar/CampaignSidebarSection/CompletedSection/CompletedSection';
import SkippedSection from '../../../../../CampaignSettings/CreateCampaignSidebar/CampaignSidebarSection/SkippedSection/SkippedSection';
import CampaignSidebarSectionAvatar from '../../../../../CampaignSettings/CreateCampaignSidebar/CampaignSidebarSectionAvatar/CampaignSidebarSectionAvatar';
import UploadPicture from '../../../../../../../../components/Dashboard/Shared/UploadPicture';
import {
  swagSelectChangeStep,
  swagSelectSavePhysicalCardRequest,
  swagSelectSetStepData,
} from '../../../../../../store/campaign/swagSelect/swagSelect.actions';

import MooCardsStyle from './MooCardsStyle/MooCardsStyle';
import PreviewCard from './PreviewCardTemplate/PreviewCard';
import CmykColorInput from './CmykColorInput/CmykColorInput';
import {
  CARD_BACK_SIDE,
  CARD_FRONT_SIDE,
  defaultColor,
  defaultCopyLines,
  FIRST_LINE,
  SECOND_LINE,
  THIRD_LINE,
} from './configurator.constants';

const useStyles = makeStyles(theme => ({
  description: {
    color: theme.palette.grey.main,
    fontSize: 14,
    lineHeight: 1.29,
  },
  ul: {
    marginBlockStart: 0,
    marginBlockEnd: 0,
  },
  li: {
    fontSize: 14,
  },
  button: {
    boxShadow: 'none',
    width: 195,
  },
  buttonIcon: {
    marginLeft: theme.spacing(1),
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
  gridRoot: {
    flexGrow: 1,
  },
  copyField: {
    marginBottom: theme.spacing(1),
    width: '100%',
  },
  sideLink: {
    fontWeight: 'bold',
    color: theme.palette.link.main,
    cursor: 'pointer',
  },
  activeSideLink: {
    color: theme.palette.primary.main,
  },
}));

const initCopyObject = data =>
  !data[FIRST_LINE] && !data[SECOND_LINE] && !data[THIRD_LINE]
    ? defaultCopyLines
    : {
        [FIRST_LINE]: data[FIRST_LINE],
        [SECOND_LINE]: data[SECOND_LINE],
        [THIRD_LINE]: data[THIRD_LINE],
      };

const mapCMYK = dataArr => ({
  c: parseInt(dataArr[0], 10),
  m: parseInt(dataArr[1], 10),
  y: parseInt(dataArr[2], 10),
  k: parseInt(dataArr[3], 10),
});

const GiftCardConfiguratorSection = ({ title, order, status, data, campaignId, isLoading }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [cardLogo, setCardLogo] = useState(data.cardLogo || undefined);
  const [cardLogoName, setCardLogoName] = useState('');
  const [cardType, setCardType] = useState(data.cardType || CARD_STANDARD_STYLE);
  const [cardHexColor, setCardHEXColor] = useState(data.cardHexColor || defaultColor);
  const [cardCmykColor, setCardCMYK] = useState(
    (data.cardCmykColor && mapCMYK(data.cardCmykColor)) || hex2cmyk(defaultColor),
  );
  const [cardCopyLines, setCardCopyLines] = useState(initCopyObject(data));
  const [activeCardSide, setActiveCardSide] = useState(CARD_FRONT_SIDE);

  const handleNext = useCallback(() => {
    const componentData = {
      cardLogo,
      cardType,
      cardHexColor,
      cardCmykColor: Object.values(cardCmykColor).map(String),
      ...cardCopyLines,
    };
    if (equals(componentData, data)) {
      dispatch(swagSelectChangeStep({ next: SS_CARD_ORDER_OPTIONS_STEP }));
      return;
    }
    dispatch(
      swagSelectSetStepData({
        step: SS_CARD_CONFIGURATOR_STEP,
        data: {
          cardLogo,
          cardType,
          cardHexColor,
          cardCmykColor,
          ...cardCopyLines,
        },
      }),
    );
    fetch(cardLogo)
      .then(res => res.blob())
      .then(blob => {
        dispatch(
          swagSelectSavePhysicalCardRequest({
            campaignId,
            file: blob,
            filename: cardLogoName,
          }),
        );
      });
  }, [cardLogo, cardType, cardHexColor, cardCmykColor, cardCopyLines, data, dispatch, campaignId, cardLogoName]);

  const handleEdit = useCallback(() => {
    dispatch(swagSelectChangeStep({ next: SS_CARD_CONFIGURATOR_STEP }));
  }, [dispatch]);

  const handleLoadLogo = useCallback(
    logo => {
      fileToBase64(logo).then(b64file => {
        setCardLogo(b64file);
        setCardLogoName(logo.name);
      });
    },
    [setCardLogo, setCardLogoName],
  );

  const handleRemoveLogo = useCallback(() => {
    setCardLogo(undefined);
    setCardLogoName(undefined);
  }, [setCardLogo, setCardLogoName]);

  const handleUpdateColors = useCallback(
    cmyk => {
      setCardHEXColor(cmyk2hex(cmyk.c, cmyk.m, cmyk.y, cmyk.k));
      setCardCMYK(cmyk);
    },
    [setCardHEXColor, setCardCMYK],
  );

  const isNextDisabled = useMemo(() => !(cardLogo && Object.values(cardCopyLines).filter(Boolean).length), [
    cardLogo,
    cardCopyLines,
  ]);

  const handleEditLine = (value, line) => {
    const newLines = { ...cardCopyLines, [line]: value.trimLeft() };
    setCardCopyLines(newLines);
  };

  if (status === SWAG_SELECT_FLOW_STATES.UNTOUCHED) {
    return <UntouchedSection order={order} title={title} status={status} />;
  }

  if (status === SWAG_SELECT_FLOW_STATES.COMPLETED) {
    return (
      <CompletedSection order={order} title={title} status={status} campaignId={campaignId} handleEdit={handleEdit}>
        Card configured
      </CompletedSection>
    );
  }

  if (status === SWAG_SELECT_FLOW_STATES.SKIPPED) {
    return (
      <SkippedSection order={order} title={title} status={status} campaignId={campaignId}>
        {data.campaignType}
      </SkippedSection>
    );
  }

  return (
    <>
      <CampaignSidebarSectionAvatar status={status} avatar={order} />
      <Box pb={2} pl="52px" className="H4-Chambray">
        {title}
        <Box pt={1} pr={1} className={classes.description}>
          Now the fun part! Using our builder, feel free to customize the look, feel, and copy on your cards to be more
          on your company’s brand.
        </Box>
      </Box>
      <Box px={3}>
        <Box display="flex">
          <Box width="328px" pr={2} borderRight="1px solid #eceae7">
            <Box className="Label-Table-Left-Static">CARD LOGO</Box>
            <UploadPicture
              alt="logo"
              accepted="image/png"
              image={cardLogo}
              onChange={handleLoadLogo}
              onRemove={handleRemoveLogo}
              variant="square"
              maxSizeMb={5}
            />
            <Box mt={1} className="Body-Small-Static">
              PNG file only, minimum image height: 600px <br />
              Maximum file size -5MB
            </Box>
            <Box mt={3} mb={2}>
              <Divider />
            </Box>
            <Box className="Label-Table-Left-Static">CARD STYLE</Box>
            <Box pr={3}>
              <MooCardsStyle style={cardType} onChange={setCardType} />
            </Box>
            <Box mt={3} mb={2}>
              <Divider />
            </Box>
            <Box className="Label-Table-Left-Static">CARD COLOR</Box>
            <Box>
              <CmykColorInput cmyk={cardCmykColor} hex={cardHexColor} onChange={handleUpdateColors} />
              <Box mt={2}>
                <HtmlTip>We recommend using a color that contrasts well against white text.</HtmlTip>
              </Box>
            </Box>
            <Box mt={3} mb={2}>
              <Divider />
            </Box>
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box className="Label-Table-Left-Static">CARD COPY</Box>
                <Box className="Body-Small-Success">Max 24 characters per line</Box>
              </Box>
              <Box>
                <TextField
                  className={classes.copyField}
                  label="Line 1"
                  value={cardCopyLines[FIRST_LINE]}
                  variant="outlined"
                  onChange={e => handleEditLine(e.target.value, FIRST_LINE)}
                />
                <TextField
                  className={classes.copyField}
                  label="Line 2"
                  value={cardCopyLines[SECOND_LINE]}
                  variant="outlined"
                  onChange={e => handleEditLine(e.target.value, SECOND_LINE)}
                />
                <TextField
                  className={classes.copyField}
                  label="Line 3"
                  value={cardCopyLines[THIRD_LINE]}
                  variant="outlined"
                  onChange={e => handleEditLine(e.target.value, THIRD_LINE)}
                />
              </Box>
            </Box>
          </Box>
          <Box pl={2} display="flex" flexDirection="column" justifyContent="space-between">
            <Box display="flex" flexDirection="column" alignItems="center">
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                width="450px"
                height="450px"
                border="1px solid #979797"
              >
                <PreviewCard
                  side={activeCardSide}
                  cardLogo={cardLogo}
                  cardStyle={cardType}
                  cardColor={cardHexColor}
                  cardCopyLines={cardCopyLines}
                />
              </Box>
              <Box mt={1} display="flex" width="100px" justifyContent="space-between">
                <Box
                  className={`${classes.sideLink} ${activeCardSide === CARD_FRONT_SIDE ? classes.activeSideLink : ''}`}
                  onClick={() => setActiveCardSide(CARD_FRONT_SIDE)}
                >
                  {CARD_FRONT_SIDE}
                </Box>
                <Box width="1px" borderRight="1px solid var(--Tundora-20)" />
                <Box
                  className={`${classes.sideLink} ${activeCardSide === CARD_BACK_SIDE ? classes.activeSideLink : ''}`}
                  onClick={() => setActiveCardSide(CARD_BACK_SIDE)}
                >
                  {CARD_BACK_SIDE}
                </Box>
              </Box>
            </Box>
            <Box width="100%" mt={2} display="flex" justifyContent="flex-end">
              <Button
                className={classes.button}
                variant="contained"
                color="secondary"
                onClick={handleNext}
                fullWidth
                disabled={isNextDisabled}
              >
                Review card
                {!isLoading ? (
                  <DashboardIcon className={classes.buttonIcon} color="inherit" icon="arrow-right" />
                ) : (
                  <DashboardIcon className={classes.buttonIcon} spin color="inherit" icon="spinner" />
                )}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

GiftCardConfiguratorSection.propTypes = {
  title: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  order: PropTypes.number.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.any,
  // eslint-disable-next-line react/forbid-prop-types
  campaignId: PropTypes.any,
  isLoading: PropTypes.bool,
};

GiftCardConfiguratorSection.defaultProps = {
  data: {},
  campaignId: undefined,
  isLoading: false,
};

export default GiftCardConfiguratorSection;
