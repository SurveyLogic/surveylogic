export interface BackendErrorMessages {
  [key: string]: string | string[];
}

export interface BackendErrorResponse<T = BackendErrorMessages> {
  errors?: T;
  message?: string;
  exception?: string;
  action?: {label: string; action: string};
  status: number;
  type?: string;
}
