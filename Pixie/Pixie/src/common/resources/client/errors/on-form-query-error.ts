import axios from 'axios';
import {UseFormReturn} from 'react-hook-form';
import {BackendErrorResponse} from './backend-error-response';
import {toast} from '../ui/toast/toast';
import {message} from '../i18n/message';

export function onFormQueryError(r: unknown, form: UseFormReturn<any>) {
  if (form && axios.isAxiosError(r) && r.response) {
    const response = r.response.data as BackendErrorResponse;
    if (!response.errors) {
      toast.danger(
        response.message ??
          message('There was an issue. Please try again later.')
      );
    } else {
      Object.entries(response.errors || {}).forEach(([key, errors], index) => {
        if (typeof errors === 'string') {
          form.setError(key, {message: errors}, {shouldFocus: index === 0});
        } else {
          errors.forEach((message, subIndex) => {
            form.setError(
              key,
              {message},
              {shouldFocus: index === 0 && subIndex === 0}
            );
          });
        }
      });
    }
  }
}
