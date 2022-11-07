import { ofType } from 'redux-observable';
import { mapTo } from 'rxjs/operators';
import { CreateGift, ContactDetails } from '@alycecom/modules';

import { BULK_IMPORT_SUCCESS } from '../../bulkCreateContacts/import/import.types';
import { SWAG_DIGITAL_GENERATION_CODES_PROGRESS_FINISH } from '../../../modules/SettingsModule/store/campaign/swagDigitalCodes/swagDigitalCodes.types';
import { SWAG_PHYSICAL_GENERATE_CODES_SUCCESS } from '../../../modules/SettingsModule/store/campaign/swagPhysicalCodes/swagPhysicalCodes.types';
import { giftTransferringProgressFinish } from '../../../modules/DashboardModule/store/breakdowns/giftTransfer/giftTransfer.actions';

import { updateStateUpdatedTime } from './stateUpdatedTime.actions';

const actionTypesToTriggerUpdate = [
  CreateGift.actionTypes.GIFT_CREATE_SUCCESS,
  CreateGift.actionTypes.GIFT_CREATE_SEND_SUCCESS,
  CreateGift.actionTypes.GIFT_DISCARD_SUCCESS,
  CreateGift.actionTypes.GIFT_EXPIRE_SUCCESS,
  ContactDetails.actionTypes.SEND_MORE_INFO_SUCCESS,
  BULK_IMPORT_SUCCESS,
  giftTransferringProgressFinish.getType(),
  SWAG_DIGITAL_GENERATION_CODES_PROGRESS_FINISH,
  SWAG_PHYSICAL_GENERATE_CODES_SUCCESS,
];

export const updateStateUpdatedTimeEpic = $action =>
  $action.pipe(ofType(...actionTypesToTriggerUpdate), mapTo(updateStateUpdatedTime()));
