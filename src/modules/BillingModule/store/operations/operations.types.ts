import { IMoney } from '../giftDeposits/giftDeposits.types';

export interface IDateRange {
  from: string;
  to: string;
}

export interface IOperationType {
  id: string;
  name: string;
  children?: IOperationType[];
}

export interface IPagination {
  perPage: number;
  currentPage: number;
  total: number;
  totalPages: number;
}

export type TGiftWithdrawalDetail = {
  accountId: string;
  money: IMoney;
};

export type TGiftWithdrawalTotal = {
  giftingWithdrawalTotal: TGiftWithdrawalDetail[];
};
