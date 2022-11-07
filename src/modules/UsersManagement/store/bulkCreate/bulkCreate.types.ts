export enum CreateUsersStatus {
  failed = 'failed',
  finished = 'finished',
  processing = 'processing',
}

export interface IBulkCreateStatus {
  status: CreateUsersStatus;
  imported: number;
  total: number;
}
