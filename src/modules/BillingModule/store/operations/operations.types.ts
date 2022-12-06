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
