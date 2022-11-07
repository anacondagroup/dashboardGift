import { detailsEpics } from './details';
import { giftEpics } from './gift';
import messagingStepEpics from './messaging/messaging.epics';
import { recipientsEpics } from './recipients';
import { finalizeEpics } from './finalize';

export const stepsEpics = [...detailsEpics, ...giftEpics, ...messagingStepEpics, ...recipientsEpics, ...finalizeEpics];
