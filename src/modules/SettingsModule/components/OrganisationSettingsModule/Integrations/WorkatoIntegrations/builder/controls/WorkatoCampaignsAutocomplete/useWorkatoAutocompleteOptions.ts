import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import {
  getIsLoadingWorkatoAutocompleteOptionsByIdentifier,
  getWorkatoAutocompleteOptionsByIdentifier,
} from '../../../../../../../store/organisation/integrations/workato/activeOneToManyCampaigns/activeOneToManyCampaigns.selectors';
import { ICampaignListItem } from '../../../../../../../store/campaigns/campaigns.types';

import { TWorkatoAutocompleteOption, TWorkatoAutocompleteValue } from './types';

type TWorkatoAutocompleteOptions = {
  options: TWorkatoAutocompleteOption[];
  selectedValue: TWorkatoAutocompleteValue;
  setSelectedValue: (value: TWorkatoAutocompleteValue) => void;
  isLoadingOptions: boolean;
};

const formOption = (campaign: ICampaignListItem) => ({
  name: campaign.name,
  id: campaign.id,
});

export const useWorkatoAutocompleteOptions = (
  value: string,
  autocompleteIdentifier: string,
): TWorkatoAutocompleteOptions => {
  const [selectedValue, setSelectedValue] = useState<TWorkatoAutocompleteValue>(null);

  const campaigns = useSelector(
    useMemo(() => getWorkatoAutocompleteOptionsByIdentifier(autocompleteIdentifier), [autocompleteIdentifier]),
  );
  const isLoadingCampaigns = useSelector(
    useMemo(() => getIsLoadingWorkatoAutocompleteOptionsByIdentifier(autocompleteIdentifier), [autocompleteIdentifier]),
  );

  useEffect(() => {
    const getDefaultOption = () => campaigns.find(c => c.id.toString() === value) ?? null;
    const targetCampaign = getDefaultOption();
    if (value && targetCampaign) {
      const selectedOption = formOption(targetCampaign);
      setSelectedValue(selectedOption);
    }
  }, [value, campaigns]);

  const options = useMemo(() => campaigns.map(campaign => formOption(campaign)), [campaigns]);

  return { options, selectedValue, setSelectedValue, isLoadingOptions: isLoadingCampaigns };
};
