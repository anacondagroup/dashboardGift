export const offsetToPage = (total: number, limit: number, offset: number): number => {
  if (offset >= total) {
    return 0;
  }
  return Math.round(offset / limit + 1);
};

export const pageToOffset = (page: number, limit: number): number => page * limit;
