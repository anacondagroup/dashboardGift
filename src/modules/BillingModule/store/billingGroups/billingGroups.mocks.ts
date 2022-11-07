import { ISearchGroupResultsPayload } from '.';

export const searchGroupResultsMock: ISearchGroupResultsPayload = {
  data: [
    { groupId: '91265d1c-f036-4c62-8f4c-2e4a81c58206' },
    { groupId: '91c4f377-919e-444a-a6d6-84a478a17847' },
    { groupId: '94a3e79e-7fd6-4fea-aa48-56a997ce1213' },
    { groupId: '94a3e774-29aa-4c33-bb96-451e0f711e73' },
    { groupId: 'Ungrouped' },
  ],
  pagination: {
    currentPage: 1,
    total: 5,
    perPage: 10,
  },
};
