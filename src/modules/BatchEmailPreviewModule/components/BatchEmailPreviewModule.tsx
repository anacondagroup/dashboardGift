import React, { memo } from 'react';
import { GiftingFlow } from '@alycecom/modules';

export interface IBatchEmailPreviewModuleProps {
  batchId: string;
}

const BatchEmailPreviewModule = ({ batchId }: IBatchEmailPreviewModuleProps): JSX.Element => (
  <GiftingFlow.BatchEmailPreview batchId={parseInt(batchId, 10)} />
);

export default memo(BatchEmailPreviewModule);
