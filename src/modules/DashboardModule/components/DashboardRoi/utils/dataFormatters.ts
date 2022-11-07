import { TTotalInfluencedByDeal } from '@alycecom/services';
import { REQUEST_DATE_FORMAT } from '@alycecom/ui';
import moment from 'moment';
import numeral from 'numeral';
import { uniq, flatten, mergeAll } from 'ramda';

import { TDateRangeOption } from './roiTypes';

export enum NumberFormattingOptions {
  Shortest = '0a',
  Short = '0.00a',
  Large = '0,0',
  LargeWithDecimals = '0,0.00',
}

export const toDateFromNow = (data: string): string => moment(data).fromNow();

export const toFormattedPrice = (number: number, format: string = NumberFormattingOptions.Short): string =>
  `$${numeral(number).format(format)}`;

export const toRoi = (number: number): string => `${numeral(number).format('0')}x`;

export const getRoiDatesRange = (startDate?: Date, endDate?: Date): string => {
  const start = moment(startDate);
  const end = moment(endDate);

  const canBeShortened = start.month() === end.month() && start.year() === end.year();

  return `${start.format('MMM D')}-${canBeShortened ? '' : end.format('MMM ')}${end.format('D[/]YYYY')}`;
};

export const getLegendKeys = (temporalData: TTotalInfluencedByDeal[]): string[] =>
  uniq(
    flatten(
      temporalData.map((influencedArrEntry: TTotalInfluencedByDeal) =>
        influencedArrEntry.dealTypeList.map(({ dealName }) => dealName.trim()),
      ),
    ),
  );

export const getDealTypesValues = (
  temporalData: TTotalInfluencedByDeal[],
  legendKeys: string[],
): Partial<TTotalInfluencedByDeal>[] =>
  temporalData.map((influencedArrEntry: TTotalInfluencedByDeal) => {
    const mappedKeys = legendKeys.map((legendKey: string) => ({
      [legendKey]:
        influencedArrEntry.dealTypeList.find(({ dealName }) => dealName === legendKey)?.influencedAmount || 0,
    }));
    const objectFromMappedKeys = mergeAll(mappedKeys);
    return {
      startDate: influencedArrEntry.startDate,
      endDate: influencedArrEntry.endDate,
      ...objectFromMappedKeys,
    };
  });

export const ALYCE_FOUNDATION_DATE = '2015-12-01';
export const ROI_DATA_PERIODS: TDateRangeOption[] = [
  {
    label: 'All Times',
    value: {
      from: ALYCE_FOUNDATION_DATE,
      to: moment().format(REQUEST_DATE_FORMAT),
    },
  },
  {
    label: 'Month to Date',
    value: {
      from: moment().subtract(1, 'months').format(REQUEST_DATE_FORMAT),
      to: moment().format(REQUEST_DATE_FORMAT),
    },
  },
  {
    label: 'Year to Date',
    value: {
      from: moment().subtract(1, 'years').format(REQUEST_DATE_FORMAT),
      to: moment().format(REQUEST_DATE_FORMAT),
    },
  },
  {
    label: 'Past Week',
    value: {
      from: moment().subtract(1, 'weeks').startOf('week').format(REQUEST_DATE_FORMAT),
      to: moment().subtract(1, 'weeks').endOf('week').format(REQUEST_DATE_FORMAT),
    },
  },
  {
    label: 'Past Month',
    value: {
      from: moment().subtract(1, 'months').startOf('month').format(REQUEST_DATE_FORMAT),
      to: moment().subtract(1, 'months').endOf('month').format(REQUEST_DATE_FORMAT),
    },
  },
  {
    label: 'Past Quarter',
    value: {
      from: moment().subtract(1, 'quarters').startOf('quarter').format(REQUEST_DATE_FORMAT),
      to: moment().subtract(1, 'quarters').endOf('quarter').format(REQUEST_DATE_FORMAT),
    },
  },
  {
    label: 'Past Year',
    value: {
      from: moment().subtract(1, 'years').startOf('year').format(REQUEST_DATE_FORMAT),
      to: moment().subtract(1, 'years').endOf('year').format(REQUEST_DATE_FORMAT),
    },
  },
];

export const DEFAULT_ROI_PERIOD = ROI_DATA_PERIODS[5].value;

export const getAvatarLetters = (fullName: string): string =>
  fullName
    .split(' ')
    .slice(0, 2)
    .reduce((acc, word) => `${acc}${word[0]}`, '');
