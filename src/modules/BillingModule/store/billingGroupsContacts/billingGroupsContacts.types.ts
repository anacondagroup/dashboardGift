export interface IBillingContact {
  orgId?: number;
  firstName: string;
  lastName: string;
  email: string;
}

export enum CreateBillingGroupAddContactField {
  FirstName = 'firstName',
  LastName = 'lastName',
  Email = 'email',
}

export type TBillingGroupAddContactForm = {
  [CreateBillingGroupAddContactField.FirstName]: string;
  [CreateBillingGroupAddContactField.LastName]: string;
  [CreateBillingGroupAddContactField.Email]: string;
};

export interface IBillingContactListPayload {
  orgId: string | number | null;
}
