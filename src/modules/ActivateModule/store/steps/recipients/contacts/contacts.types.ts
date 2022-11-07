import { SortDirectionType } from 'react-virtualized';

export interface IContactsResponse {
  data: IContact[];
  meta: IContactsMeta;
}

export interface IContact {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
}

export interface IContactsMeta {
  total: number;
}

// TODO New filters will be added soon
export interface IContactsFilters {
  search: string;
  sortDirection: SortDirectionType;
  sortField: keyof IContact;
}

export interface IContactsPagination {
  limit: number;
  offset: number;
}
