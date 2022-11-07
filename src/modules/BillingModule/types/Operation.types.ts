import { OperationType } from '../constants/operations.constants';

export interface IOperation {
  id: string;
  typeId: OperationType;
  operatedAt: string;
  amount: {
    amount: number;
  };
  accountRemaining: {
    amount: number;
  };
  references: {
    giftId?: number;
    invoiceId?: string;
    statusId?: number;
    contactId?: number;
  };
  comment?: string;
}
