import React, { memo } from 'react';
import { GiftEmailPreview, TEmailProviderName } from '@alycecom/modules';

export interface IEmailPreviewModuleProps {
  giftId: string;
  provider?: TEmailProviderName;
}

const GiftEmailPreviewModule = ({ giftId, provider = 'default' }: IEmailPreviewModuleProps): JSX.Element => (
  <GiftEmailPreview.Module giftId={parseInt(giftId, 10)} provider={provider} />
);

export default memo(GiftEmailPreviewModule);
