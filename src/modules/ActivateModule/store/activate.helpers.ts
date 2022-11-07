import { isEmpty } from 'ramda';

import { ActivateBuilderStep } from '../routePaths';

import { IFullActivateDraft } from './activate.types';
import { isRecipientsStepCompleted } from './steps/recipients/recipients.helpers';

export const calculateInitialStep = (activateDraft: IFullActivateDraft): ActivateBuilderStep => {
  if (!activateDraft) {
    return ActivateBuilderStep.Details;
  }

  const {
    details,
    giftExchangeOption,
    exchangeMarketplaceSettings,
    customMarketplace,
    recipientActions,
    defaultGift,
    recipients,
    messaging,
  } = activateDraft;

  if (recipients.attributes && isRecipientsStepCompleted(recipients.attributes)) {
    return ActivateBuilderStep.Finalize;
  }

  if (messaging && !isEmpty(messaging)) {
    return ActivateBuilderStep.Recipients;
  }

  if (giftExchangeOption && (exchangeMarketplaceSettings || customMarketplace) && defaultGift && recipientActions) {
    return ActivateBuilderStep.Messaging;
  }

  if (details) {
    return ActivateBuilderStep.Gift;
  }

  return ActivateBuilderStep.Details;
};
