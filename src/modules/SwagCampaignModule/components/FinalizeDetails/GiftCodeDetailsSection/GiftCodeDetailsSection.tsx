import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { SectionTitleStyled } from '@alycecom/modules';
import { Icon, Tooltip } from '@alycecom/ui';

import { CodesType } from '../../../store/swagCampaign/steps/codes/codes.constants';
import {
  getGiftCodeFormat,
  getCardDesign,
  getCardsOrder,
} from '../../../store/swagCampaign/steps/codes/codes.selectors';
import CardDesignPreview from '../../CodesForm/PhysicalCardsController/CardDesignPreview';
import CardOrderPreview from '../../CodesForm/PhysicalCardsController/CardOrderPreview';

const styles = {
  labelWithTooltip: {
    display: 'flex',
  },
  labelTooltip: {
    ml: 1,
  },
} as const;

const GiftCodeDetailsSection = (): JSX.Element => {
  const giftCodeFormat = useSelector(getGiftCodeFormat);
  const cardDesignData = useSelector(getCardDesign);
  const cardOrderData = useSelector(getCardsOrder);
  const giftCodesContent = !!cardOrderData;

  const isPhysicalCard = useMemo(() => giftCodeFormat === CodesType.Physical, [giftCodeFormat]);

  const tooltipMessage = isPhysicalCard
    ? 'You may order more batches after this campaign has been created.'
    : 'You will be able to download more codes after campaign creation.';

  return (
    <>
      <SectionTitleStyled my={3} mt={5} style={styles.labelWithTooltip}>
        Initial Gift Code Batch Details
        {giftCodesContent && (
          <Tooltip
            placement="top"
            title={tooltipMessage}
            component="span"
            data-testid="SwagBuilder.FinalizeStep.GiftCode.Tooltip"
          >
            <Icon sx={styles.labelTooltip} icon="exclamation-circle" fontSize={1} />
          </Tooltip>
        )}
      </SectionTitleStyled>
      {giftCodesContent && (
        <>
          <CardOrderPreview cardOrder={cardOrderData} />
          {isPhysicalCard && (
            <CardDesignPreview cardDesign={cardDesignData} expirationDate={cardOrderData?.codesExpirationDate} />
          )}
        </>
      )}
    </>
  );
};

export default GiftCodeDetailsSection;
