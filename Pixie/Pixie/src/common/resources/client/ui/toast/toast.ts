import {MessageDescriptor} from '../../i18n/message-descriptor';
import {ToastOptions, toastState} from './toast-store';

export function toast(
  message: MessageDescriptor | string,
  opts?: ToastOptions
) {
  toastState().add(message, opts);
}

toast.danger = (message: MessageDescriptor | string, opts?: ToastOptions) => {
  toastState().add(message, {...opts, type: 'danger'});
};

toast.positive = (message: MessageDescriptor | string, opts?: ToastOptions) => {
  toastState().add(message, {...opts, type: 'positive'});
};

toast.loading = (message: MessageDescriptor | string, opts?: ToastOptions) => {
  toastState().add(message, {...opts, type: 'loading'});
};
