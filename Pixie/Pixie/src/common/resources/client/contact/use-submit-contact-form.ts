import {useMutation} from '@tanstack/react-query';
import {apiClient} from '../http/query-client';
import {useTrans} from '../i18n/use-trans';
import {BackendResponse} from '../http/backend-response/backend-response';
import {toast} from '../ui/toast/toast';
import {message} from '../i18n/message';
import {UseFormReturn} from 'react-hook-form';
import {onFormQueryError} from '../errors/on-form-query-error';
import {useNavigate} from '../utils/hooks/use-navigate';

interface Response extends BackendResponse {}

export interface ContactPagePayload {
  name: string;
  email: string;
  message: string;
}

export function useSubmitContactForm(form: UseFormReturn<ContactPagePayload>) {
  const {trans} = useTrans();
  const navigate = useNavigate();

  return useMutation((props: ContactPagePayload) => submitContactForm(props), {
    onSuccess: () => {
      toast(trans(message('Your message can be submitted.')));
      navigate('/');
    },
    onError: err => onFormQueryError(err, form),
  });
}

function submitContactForm(payload: ContactPagePayload): Promise<Response> {
  return apiClient.post('contact-page', payload).then(r => r.data);
}
