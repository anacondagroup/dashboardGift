import { TErrors } from '@alycecom/services';

export interface IGiftDeposits {
  giftDepositAmount: number;
  confirmDepositAmount: number;
  billingGroup: string;
  PurchaseOrderNumber: number;
  memoNote: string;
}

export interface IGiftDepositBody {
  accountId: string;
  money: IMoney;
}

export interface IGiftResponse {
  success: boolean;
  message: string;
}

export interface IMoney {
  amount: number;
  currency: string;
}

export enum GiftDepositsFormFields {
  GiftDepositAmount = 'giftDepositAmount',
  ConfirmDepositAmount = 'confirmDepositAmount',
  BillingGroup = 'billingGroup',
  PurchaseOrderNumber = 'purchaseOrderNumber',
  MemoNote = 'memoNote',
  AccountId = 'accountId',
  Money = 'money',
}

export interface IGiftDepositsFormValues {
  [GiftDepositsFormFields.GiftDepositAmount]: number;
  [GiftDepositsFormFields.ConfirmDepositAmount]: number;
  [GiftDepositsFormFields.BillingGroup]?: string;
  [GiftDepositsFormFields.PurchaseOrderNumber]?: number;
  [GiftDepositsFormFields.MemoNote]?: string;
}

export type TGiftDepositsForm = {
  [GiftDepositsFormFields.GiftDepositAmount]: number;
  [GiftDepositsFormFields.ConfirmDepositAmount]: number;
  [GiftDepositsFormFields.BillingGroup]?: string;
  [GiftDepositsFormFields.PurchaseOrderNumber]?: number;
  [GiftDepositsFormFields.MemoNote]?: string;
};

export type TGiftDepositsCreatePayload = {
  [GiftDepositsFormFields.BillingGroup]?: string | null;
  [GiftDepositsFormFields.PurchaseOrderNumber]?: number | null;
  [GiftDepositsFormFields.MemoNote]?: string | null;
  [GiftDepositsFormFields.AccountId]?: string | null;
  [GiftDepositsFormFields.Money]: IMoney;
};

export type TGiftDepositsErrors = TErrors<TGiftDepositsCreatePayload>;
