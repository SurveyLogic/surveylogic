import {useMutation} from '@tanstack/react-query';
import {UseFormReturn} from 'react-hook-form';
import {diff} from 'deep-object-diff';
import dot from 'dot-object';
import {BackendResponse} from '@common/http/backend-response/backend-response';
import {toast} from '@common/ui/toast/toast';
import {apiClient, queryClient} from '@common/http/query-client';
import {AdminSettings} from '@common/admin/settings/admin-settings';
import {onFormQueryError} from '@common/errors/on-form-query-error';
import {useAdminSettings} from '@common/admin/settings/requests/use-admin-settings';
import {message} from '@common/i18n/message';

interface Response extends BackendResponse {}

export interface AdminSettingsWithFiles {
  files?: Record<string, File>;
  client?: Partial<AdminSettings['client']>;
  server?: Partial<AdminSettings['server']>;
}

export function useUpdateAdminSettings(
  form: UseFormReturn<AdminSettingsWithFiles>
) {
  const {data: original} = useAdminSettings();

  return useMutation(
    (props: AdminSettingsWithFiles) => {
      // need to convert these to json, otherwise only single key from object would be sent due to diffing
      if (props.client?.cookie_notice?.button) {
        props.client.cookie_notice.button = JSON.stringify(
          props.client.cookie_notice.button
        ) as any;
      }
      if (props.client?.registration?.policies) {
        props.client.registration.policies = JSON.stringify(
          props.client.registration.policies
        ) as any;
      }
      if ((props.client as any)?.artistPage?.tabs) {
        (props.client as any).artistPage.tabs = JSON.stringify(
          (props.client as any).artistPage.tabs
        ) as any;
      }

      const client = props.client ? diff(original!.client, props.client) : null;
      const server = props.server ? diff(original!.server, props.server) : null;
      return updateAdminSettings({
        client,
        server,
        files: props.files,
      } as AdminSettings);
    },
    {
      onSuccess: () => {
        toast(message('Settings updated'), {
          position: 'bottom-right',
        });
        queryClient.invalidateQueries(['fetchAdminSettings']);
      },
      onError: r => onFormQueryError(r, form),
    }
  );
}

function updateAdminSettings({
  client,
  server,
  files,
}: AdminSettingsWithFiles): Promise<Response> {
  const formData = new FormData();
  if (client) {
    formData.set('client', JSON.stringify(dot.dot(client)));
  }
  if (server) {
    formData.set('server', JSON.stringify(dot.dot(server)));
  }
  Object.entries(files || {}).forEach(([key, file]) => {
    formData.set(key, file);
  });
  return apiClient
    .post('settings', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(r => r.data);
}
