export type ApiResult<T> = {
  result: {
    data: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
};

export type ApiListResult<T> = {
  data: T[]
}