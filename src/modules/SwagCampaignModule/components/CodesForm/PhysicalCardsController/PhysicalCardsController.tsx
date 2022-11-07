import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Collapse, Theme } from '@mui/material';
import { SFormLabel } from '@alycecom/modules';
import { Button } from '@alycecom/ui';

import {
  setOpenCloseCodesSettingsBar,
  setOpenCloseCardsSettingsBar,
} from '../../../store/swagCampaign/steps/codes/codes.actions';
import { getCardDesign, getCardsOrder } from '../../../store/swagCampaign/steps/codes/codes.selectors';

import CodesSettingsSideBar from './CodesSettingsSideBar/CodesSettingsSideBar';
import CardsSettingsSideBar from './CardsSettingsSideBar/CardsSettingsSideBar';
import CardDesignPreview from './CardDesignPreview';
import CardOrderPreview from './CardOrderPreview';

const styles = {
  previewCardBox: {
    border: '1px solid',
    borderColor: ({ palette }: Theme) => palette.grey.dusty,
  },
} as const;

const PhysicalCardsController = (): JSX.Element => {
  const dispatch = useDispatch();

  const cardOrderData = useSelector(getCardsOrder);
  const isCardOrderPreview = !!cardOrderData;

  const cardDesignData = useSelector(getCardDesign);
  const isCardDesignPreview = !!cardDesignData;

  const handleOpenCreateOder = useCallback(() => {
    dispatch(setOpenCloseCodesSettingsBar(true));
  }, [dispatch]);

  const handleOpenCreateCardDesign = useCallback(() => {
    dispatch(setOpenCloseCardsSettingsBar(true));
  }, [dispatch]);

  return (
    <Box>
      <Box mb={3}>
        <Box mb={1}>
          <SFormLabel>Card Order*</SFormLabel>
        </Box>
        <Collapse in={isCardOrderPreview} mountOnEnter unmountOnExit>
          <Box mb={2} sx={styles.previewCardBox}>
            <CardOrderPreview cardOrder={cardOrderData} />
          </Box>
        </Collapse>
        <Button
          borderColor="divider"
          onClick={handleOpenCreateOder}
          data-testid="SwagBuilder.CodesStep.CreateOrderButton"
        >
          Create Order
        </Button>
        <CodesSettingsSideBar />
      </Box>
      <Box mb={2}>
        <Box mb={1}>
          <SFormLabel>Card Design*</SFormLabel>
        </Box>
        <Collapse in={isCardDesignPreview} mountOnEnter unmountOnExit>
          <CardDesignPreview cardDesign={cardDesignData} expirationDate={cardOrderData?.codesExpirationDate} />
        </Collapse>
        <Button
          borderColor="divider"
          onClick={handleOpenCreateCardDesign}
          data-testid="SwagBuilder.CodesStep.CardDesignButton"
        >
          Customize Card
        </Button>
        <CardsSettingsSideBar />
      </Box>
    </Box>
  );
};

export default PhysicalCardsController;
