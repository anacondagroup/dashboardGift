import { EntityId } from '@alycecom/utils';

import { IVendorItem } from '../../../../store/entities/giftVendors/giftVendors.types';

export type TRestrictedVendorsMap = Record<EntityId, IVendorItem>;
