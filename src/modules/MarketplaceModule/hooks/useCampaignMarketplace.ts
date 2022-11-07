import { useParams } from 'react-router-dom';
import { useMemo } from 'react';

export const useCampaignMarketplace = (): { campaignId: number | null } => {
  const { campaignId = '' } = useParams<{ campaignId?: string }>();

  return useMemo(() => ({ campaignId: Number(campaignId) || null }), [campaignId]);
};
