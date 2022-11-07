import { TRoiPeriod } from '@alycecom/services';

export type TDateRangeOption = {
  label: string;
  value: TRoiPeriod;
};

export enum TActiveFilterSelection {
  Teams = 'teams',
  Campaigns = 'campaigns',
  TeamMembers = 'teamMembers',
}

export type TRoiWelcomeMessageStorage = {
  Key: 'roiWelcomeMessageShowed';
  Value: 'true';
};

export type TRoiTooltipMeta = {
  chart: {
    barWidth?: number;
    barHeight?: number;
    marginLeft?: number;
    marginRight?: number;
    barLabelWidth?: number;
  };
};

export type TGetBarLabelInChartArgs = {
  xValue: number;
};

export enum TRoiChartAxisTypes {
  Numerical = 'numerical',
  Currency = 'currency',
}

export type TAxisTicksFormat = {
  type?: TRoiChartAxisTypes;
};
