import axios from 'axios';

export function errorStatusIs(err: unknown, status: number): boolean {
  return axios.isAxiosError(err) && err.response?.status == status;
}
