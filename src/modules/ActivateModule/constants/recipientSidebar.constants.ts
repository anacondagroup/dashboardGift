export enum ContactsUploadingStates {
  ChooseSource = 'chooseSource',
  XLSX = 'xlsx',
  Integration = 'integration',
  Error = 'ERROR',
  Processing = 'PROCESSING',
  Completed = 'completed',
}

export enum SourceTypes {
  File = 'file',
  Marketo = 'marketo',
  Eloqua = 'eloqua',
  HubSpot = 'hubspot',
}
