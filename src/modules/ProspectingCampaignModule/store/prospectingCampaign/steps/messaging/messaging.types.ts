import { Path } from 'react-hook-form';

import { TProspectingMessaging } from '../../prospectingCampaign.types';

export type TMessagingErrors = Partial<Record<Path<TProspectingMessaging>, string[]>>;
