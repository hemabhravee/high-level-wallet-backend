export type PaginatedData<T> = {
  data: T[];
  totalCount: number;
  skip: number;
  limit: number;
};
