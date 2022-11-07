import { detailsEpics } from './details';
import { giftingEpics } from './gifting';
import { messagingEpics } from './messaging';
import { giftLimitsEpics } from './giftLimits';
import { finalizeEpics } from './finalize';

export default [...detailsEpics, ...giftingEpics, ...messagingEpics, ...giftLimitsEpics, ...finalizeEpics];
