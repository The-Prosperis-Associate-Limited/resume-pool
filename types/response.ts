export interface APIResponse<TData = unknown> {
  message: string;
  data: TData;
}

export interface APIErrorBody {
  message?: string;
  code?: string;
  errors?: { field: string; message: string }[];
}
