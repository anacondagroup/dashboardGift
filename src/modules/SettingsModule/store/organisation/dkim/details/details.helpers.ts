import { pipe, map, propOr, all, equals } from 'ramda';

import { IDomainRecord } from './details.types';

const isAllRecordsPassed = all(equals(true));

// @ts-ignore
export const getDomainStatusFromDetails: (domainRecords: IDomainRecord[]) => boolean = pipe(
  // @ts-ignore
  map(propOr(false, 'status')),
  isAllRecordsPassed,
);
