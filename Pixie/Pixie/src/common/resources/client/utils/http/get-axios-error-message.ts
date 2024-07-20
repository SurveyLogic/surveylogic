import axios from 'axios';
import {BackendErrorResponse} from '../../errors/backend-error-response';

export function getAxiosErrorMessage(
  err: unknown,
  field?: string | null
): string | undefined {
  if (axios.isAxiosError(err) && err.response) {
    const response = err.response.data as BackendErrorResponse;

    if (field != null) {
      const fieldMessage = response.errors?.[field];
      return Array.isArray(fieldMessage) ? fieldMessage[0] : fieldMessage;
    }

    return response?.message;
  }
}
