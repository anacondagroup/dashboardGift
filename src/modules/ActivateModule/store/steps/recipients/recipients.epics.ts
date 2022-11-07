import { uploadRequestEpics } from './uploadRequest';
import { marketoEpics } from './marketo';
import { contactsEpics } from './contacts';
import { contactEpics } from './contact';
import giftingOnTheFlyEpics from './giftingOnTheFly/giftingOnTheFly.epics';
import { eloquaEpics } from './eloqua';
import { hubspotEpics } from './hubspot/hubspot.epics';

export const recipientsEpics = [
  ...uploadRequestEpics,
  ...marketoEpics,
  ...contactsEpics,
  ...contactEpics,
  ...giftingOnTheFlyEpics,
  ...eloquaEpics,
  ...hubspotEpics,
];
