import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Box, Divider, Grid, Theme, Typography } from '@mui/material';
import { useApplyManualFormErrorsEffect } from '@alycecom/hooks';
import { Button, ProductSidebar, ProductSidebarHeader } from '@alycecom/ui';
import { fileToBase64, makeBlobFromString } from '@alycecom/utils';

import {
  setOpenCloseCardsSettingsBar,
  updateDraftCardDesign,
} from '../../../../store/swagCampaign/steps/codes/codes.actions';
import {
  CardStandardStyle,
  CustomizePhysicalCardSectionTitle,
  defaultCardColor,
  defaultCardCopyLines,
} from '../../../../store/swagCampaign/steps/codes/codes.constants';
import {
  CardsDesignLabels,
  TCardCopyLines,
  TCardsDesignFormValues,
} from '../../../../store/swagCampaign/steps/codes/codes.types';
import {
  cardsDesignSettingsResolver,
  cardsDesignSettingsDefaultValues,
} from '../../../../store/swagCampaign/steps/codes/codes.schemas';
import {
  getCardDesign,
  getCardsOrder,
  getErrors,
  getIsOpenCardsSettingBar,
} from '../../../../store/swagCampaign/steps/codes/codes.selectors';

import UploadLogo from './fields/UploadLogo';
import CardStyle from './fields/CardStyle';
import CardColor from './fields/CardColor';
import CardCopy from './fields/CardCopy';
import PreviewCard from './CardPreview';

const styles = {
  formContainer: {
    borderRight: 1,
    borderColor: ({ palette }: Theme) => palette.grey.superLight,
    paddingRight: ({ spacing }: Theme) => spacing(2),
    height: '100%',
  },
  headerTitle: {
    color: ({ palette }: Theme) => palette.common.white,
    fontWeight: 'bolder',
    marginLeft: '1.5em',
  },
  sectionTitle: {
    textTransform: 'uppercase',
    color: ({ palette }: Theme) => palette.grey.superLight,
  },
  footer: {
    width: 850,
    height: 75,
    position: 'fixed',
    bottom: 0,
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: ({ palette }: Theme) => palette.primary.light,
    padding: ({ spacing }: Theme) => spacing(2),
    zIndex: ({ zIndex }: Theme) => zIndex.appBar,
  },
} as const;

const CardsSettingsSideBar = (): JSX.Element => {
  const dispatch = useDispatch();

  const isOpen = useSelector(getIsOpenCardsSettingBar);
  const cardDesignData = useSelector(getCardDesign);
  const cardOrderData = useSelector(getCardsOrder);
  const errors = useSelector(getErrors);

  const [cardLogo, setCardLogo] = useState<string | undefined>(undefined);

  const [cardLogoName, setCardLogoName] = useState<string>('');
  const [cardStyles, setCardStyle] = useState<string>(CardStandardStyle);
  const [cardHexColor, setCardHexColor] = useState<string>(defaultCardColor);
  const [cardCopyLines, setCardCopyLines] = useState<TCardCopyLines>(defaultCardCopyLines);

  const {
    control,
    formState: { isDirty },
    handleSubmit,
    reset,
    setError,
  } = useForm<TCardsDesignFormValues>({
    mode: 'all',
    resolver: cardsDesignSettingsResolver,
    defaultValues: cardsDesignSettingsDefaultValues,
  });

  const closeSideBar = useCallback(() => {
    dispatch(setOpenCloseCardsSettingsBar(false));
    if (!cardDesignData) {
      reset();
    }
  }, [cardDesignData, dispatch, reset]);

  const onSubmit = useCallback(
    (values: TCardsDesignFormValues) => {
      if (cardLogo && !isDirty) {
        dispatch(setOpenCloseCardsSettingsBar(false));
        return;
      }

      if (cardLogo && isDirty) {
        const cardLogoBlob = cardLogoName ? makeBlobFromString(cardLogo) : undefined;
        const formData = {
          ...values,
          cardLogo: cardLogoBlob,
          fileName: cardLogoName || undefined,
          file: cardLogo,
        };
        dispatch(updateDraftCardDesign(formData));
        dispatch(setOpenCloseCardsSettingsBar(false));
      }
    },
    [isDirty, cardLogo, cardLogoName, dispatch],
  );

  const handleLoadImage = useCallback(
    (image: File) => {
      fileToBase64(image).then(b64file => {
        setCardLogo(b64file);
        setCardLogoName(image.name);
      });
    },
    [setCardLogo, setCardLogoName],
  );

  const handleRemoveImage = useCallback(() => {
    setCardLogo(undefined);
  }, [setCardLogo]);

  useEffect(() => {
    if (cardDesignData) {
      const cardDesignForm = {
        ...cardDesignData,
        cardLogo: `${cardDesignData.cardLogo}`,
      };
      setCardLogo(`${cardDesignData.cardLogo}`);
      reset(cardDesignForm, { keepDefaultValues: false });
    }
  }, [cardDesignData, reset]);

  useEffect(() => {
    if (cardDesignData?.cardHexColor) {
      setCardHexColor(cardDesignData?.cardHexColor);
    }
  }, [cardDesignData, setCardHexColor]);

  useEffect(() => {
    if (cardDesignData?.cardCopyFirstLine || cardDesignData?.cardCopySecondLine || cardDesignData?.cardCopyThirdLine) {
      const cardLines = {
        line1: cardDesignData.cardCopyFirstLine,
        line2: cardDesignData.cardCopySecondLine,
        line3: cardDesignData.cardCopyThirdLine,
      };
      setCardCopyLines(cardLines);
    }
  }, [cardDesignData, setCardCopyLines]);

  useEffect(() => {
    if (cardDesignData?.cardType) {
      setCardStyle(cardDesignData.cardType);
    }
  }, [cardDesignData, setCardStyle]);

  useApplyManualFormErrorsEffect<TCardsDesignFormValues>(setError, errors);

  return (
    <ProductSidebar isOpen={isOpen} onClose={closeSideBar} width={850}>
      <ProductSidebarHeader onClose={closeSideBar} height={84}>
        <Typography sx={styles.headerTitle}>{CustomizePhysicalCardSectionTitle}</Typography>
      </ProductSidebarHeader>

      <Grid component={Box} m={3} maxWidth={480} height="70em" direction="column" container spacing={1.5}>
        <Grid sx={styles.formContainer} item xs={5}>
          <Grid item>
            <Box className="Label-Table-Left-Static" sx={styles.sectionTitle}>
              {CardsDesignLabels.CardLogo}
            </Box>
            <UploadLogo
              alt="logo"
              accepted="image/png"
              image={cardLogo}
              onChangeLogo={handleLoadImage}
              onRemoveLogo={handleRemoveImage}
              maxSizeMb={5}
              control={control}
            />
          </Grid>
          <Box mt={3} mb={2}>
            <Divider />
          </Box>
          <Grid item>
            <Box className="Label-Table-Left-Static" sx={styles.sectionTitle}>
              {CardsDesignLabels.CardStyle}
            </Box>
            <CardStyle control={control} onChangeCardStyle={setCardStyle} />
          </Grid>
          <Box mt={3} mb={2}>
            <Divider />
          </Box>
          <Grid item>
            <Box className="Label-Table-Left-Static" sx={styles.sectionTitle}>
              {CardsDesignLabels.CardColor}
            </Box>
            <CardColor control={control} onChangeHexColor={setCardHexColor} />
          </Grid>
          <Box mt={3} mb={2}>
            <Divider />
          </Box>
          <Grid item>
            <CardCopy control={control} copyLines={cardCopyLines} onChangeCardCopy={setCardCopyLines} />
          </Grid>
        </Grid>
        <Grid item xs={7}>
          <Box display="flex" flexDirection="column" alignItems="center">
            <PreviewCard
              cardStyle={cardStyles}
              cardColor={cardHexColor}
              cardLogo={cardLogo}
              cardCopyLines={cardCopyLines}
              expirationDate={cardOrderData?.codesExpirationDate}
            />
          </Box>
        </Grid>
      </Grid>
      <Box flex="0 0 94px" position="relative">
        <Box sx={styles.footer}>
          <Box ml={3}>
            <Button type="button" borderColor="divider" color="default" onClick={closeSideBar}>
              Cancel
            </Button>
          </Box>
          <Box mr={2}>
            <Button type="button" color="primary" onClick={handleSubmit(onSubmit)}>
              Save
            </Button>
          </Box>
        </Box>
      </Box>
    </ProductSidebar>
  );
};

export default CardsSettingsSideBar;
