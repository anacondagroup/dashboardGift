import { createAction } from '@reduxjs/toolkit';

export const resetBillingUi = createAction<void>('RESET_BILLING_UI');
export const downloadGiftDepositForm = createAction<void>('DOWNLOAD_GIFT_DEPOSIT_FORM');
