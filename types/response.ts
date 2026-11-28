export interface APIResponse<TData = unknown> {
  message: string;
  data: TData;
}

export interface APIErrorBody {
  message?: string;
  code?: string;
  errors?: { field: string; message: string; step?: string }[];
}

export interface PaginatedResponse<TData> {
  message: string;
  data: TData[];
  total: number;
  page: number;
  totalPages: number;
}
