import { detailsEpics } from './details';
import { giftingEpics } from './gifting';
import { messagingEpics } from './messaging';
import { codesEpics } from './codes';
import { finalizeEpics } from './finalize';

export default [...detailsEpics, ...giftingEpics, ...messagingEpics, ...codesEpics, ...finalizeEpics];
