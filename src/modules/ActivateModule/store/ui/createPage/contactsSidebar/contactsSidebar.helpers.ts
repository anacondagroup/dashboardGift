import { SourceTypes, ContactsUploadingStates } from '../../../../constants/recipientSidebar.constants';
import { isUploadRequestFaultless } from '../../../steps/recipients';
import {
  UploadRequestSourceTypes,
  IUploadRequestAttributes,
  UploadRequestStatuses,
} from '../../../steps/recipients/uploadRequest/uploadRequest.types';

export const calculateContactsUploadingSectionState = (
  attributes: IUploadRequestAttributes,
): ContactsUploadingStates => {
  const { status } = attributes;

  switch (status) {
    case UploadRequestStatuses.Complete:
      return isUploadRequestFaultless(attributes) ? ContactsUploadingStates.Completed : ContactsUploadingStates.Error;
    case UploadRequestStatuses.Process:
      return ContactsUploadingStates.Processing;
    case UploadRequestStatuses.Error:
      return ContactsUploadingStates.Error;
    default:
      return ContactsUploadingStates.ChooseSource;
  }
};

export const calculateContactsUploadingSectionStateForEditorMode = (
  attributes: IUploadRequestAttributes,
): ContactsUploadingStates => {
  const { status } = attributes;

  switch (status) {
    case UploadRequestStatuses.Complete:
      return isUploadRequestFaultless(attributes) ? ContactsUploadingStates.XLSX : ContactsUploadingStates.Error;
    case UploadRequestStatuses.Process:
      return ContactsUploadingStates.Processing;
    case UploadRequestStatuses.Error:
      return ContactsUploadingStates.Error;
    default:
      return ContactsUploadingStates.ChooseSource;
  }
};

export const defineContactsSourceType = (attributes: IUploadRequestAttributes): SourceTypes | null => {
  const { source } = attributes;
  if (source === UploadRequestSourceTypes.File) {
    return SourceTypes.File;
  }
  if (source === UploadRequestSourceTypes.MarketoStatic || source === UploadRequestSourceTypes.MarketoDynamic) {
    return SourceTypes.Marketo;
  }
  return null;
};
