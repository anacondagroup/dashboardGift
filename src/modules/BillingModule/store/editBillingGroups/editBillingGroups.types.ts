import { IBillingContact } from '../billingGroupsContacts/billingGroupsContacts.types';

export enum CreateBillingGroupResponseFields {
  Id = 'id',
  OrganisationId = 'organisation_id',
  AccountId = 'account_id',
  Name = 'name',
  Note = 'note',
  CreatedAt = 'created_at',
  UpdatedAt = 'updated_at',
}

export type TCreateBillingGroupResponse = {
  [CreateBillingGroupResponseFields.Id]: string;
  [CreateBillingGroupResponseFields.OrganisationId]: number;
  [CreateBillingGroupResponseFields.AccountId]: string;
  [CreateBillingGroupResponseFields.Name]: string;
  [CreateBillingGroupResponseFields.Note]: string;
  [CreateBillingGroupResponseFields.CreatedAt]: string;
  [CreateBillingGroupResponseFields.UpdatedAt]: string;
};

export enum CreateBillingGroupField {
  GroupId = 'groupId',
  Name = 'name',
  PrimaryBillingContact = 'primaryBillingContact',
  SendInvoicesTo = 'sendInvoicesTo',
  PurchaseOrderNumber = 'poNumber',
}

export type TCreateBillingGroupForm = {
  [CreateBillingGroupField.GroupId]?: string;
  [CreateBillingGroupField.Name]: string;
  [CreateBillingGroupField.PrimaryBillingContact]: IBillingContact | null;
  [CreateBillingGroupField.SendInvoicesTo]?: IBillingContact[] | null;
  [CreateBillingGroupField.PurchaseOrderNumber]?: string | null;
};

export type TBillingGroupCreatePayload = {
  [CreateBillingGroupField.Name]: string;
  [CreateBillingGroupField.PrimaryBillingContact]: IBillingContact;
  [CreateBillingGroupField.SendInvoicesTo]?: IBillingContact[] | null;
  [CreateBillingGroupField.PurchaseOrderNumber]?: string | null;
};

export type TBillingGroupUpdatePayload = {
  [CreateBillingGroupField.GroupId]: string;
  [CreateBillingGroupField.Name]?: string;
  [CreateBillingGroupField.PrimaryBillingContact]?: IBillingContact;
  [CreateBillingGroupField.SendInvoicesTo]?: IBillingContact[] | null;
  [CreateBillingGroupField.PurchaseOrderNumber]?: string | null;
};

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
export interface IBillingGroupCardsInfo {
  expandAll: boolean;
  groupIds: string[];
}

export interface IGroupsIdsList {
  groupId: string | null;
  teamsLoaded: boolean;
}
