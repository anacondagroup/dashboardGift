import { Path } from 'react-hook-form';

import { TSwagMessaging } from '../../swagCampaign.types';

export type TMessagingErrors = Partial<Record<Path<TSwagMessaging>, string[]>>;
