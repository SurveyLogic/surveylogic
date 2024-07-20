import {useCallback, useState} from 'react';
import {toast} from '../../ui/toast/toast';
import {useDisconnectSocial} from './disconnect-social';
import {useTrans} from '../../i18n/use-trans';
import {getBootstrapData} from '../../core/bootstrap-data/use-backend-bootstrap-data';
import {useBootstrapData} from '../../core/bootstrap-data/bootstrap-data-context';

export type SocialService = 'google' | 'twitter' | 'facebook' | 'envato';

interface SocialMessageEvent {
  status?: 'SUCCESS' | 'ALREADY_LOGGED_IN' | 'REQUEST_PASSWORD' | 'ERROR';
  callbackData?: {
    bootstrapData?: string;
    errorMessage?: string;
  };
}

export function useSocialLogin() {
  const {trans} = useTrans();
  const {setBootstrapData} = useBootstrapData();
  const disconnectSocial = useDisconnectSocial();

  const [requestingPassword, setIsRequestingPassword] = useState(false);

  const handleSocialLoginCallback = useCallback(
    (e: SocialMessageEvent) => {
      const {status, callbackData} = e;
      if (!status) return;
      switch (status.toUpperCase()) {
        case 'SUCCESS':
          if (callbackData?.bootstrapData) {
            setBootstrapData(callbackData.bootstrapData);
          }
          return e;
        case 'REQUEST_PASSWORD':
          setIsRequestingPassword(true);
          return e;
        case 'ERROR':
          const message: string =
            callbackData?.errorMessage ||
            trans({
              message: 'An error occurred. Please try again later',
            });
          toast.danger(message);
          return e;
        default:
          return e;
      }
    },
    [trans, setBootstrapData]
  );

  return {
    requestingPassword,
    setIsRequestingPassword,
    loginWithSocial: async (serviceName: SocialService) => {
      const event = await openNewSocialAuthWindow(
        `secure/auth/social/${serviceName}/login`
      );
      return handleSocialLoginCallback(event);
    },
    connectSocial: async (serviceNameOrUrl: SocialService | string) => {
      const url = serviceNameOrUrl.includes('/')
        ? serviceNameOrUrl
        : `secure/auth/social/${serviceNameOrUrl}/connect`;
      const event = await openNewSocialAuthWindow(url);
      return handleSocialLoginCallback(event);
    },
    disconnectSocial,
  };
}

const windowHeight = 550;
const windowWidth = 650;
let win: Window | null;

function openNewSocialAuthWindow(url: string): Promise<SocialMessageEvent> {
  const left = window.screen.width / 2 - windowWidth / 2;
  const top = window.screen.height / 2 - windowHeight / 2;

  return new Promise(resolve => {
    win = window.open(
      url,
      'Authenticate Account',
      `menubar=0, location=0, toolbar=0, titlebar=0, status=0, scrollbars=1, width=${windowWidth}, height=${windowHeight}, left=${left}, top=${top}`
    );

    const messageListener = (e: MessageEvent) => {
      const baseUrl = getBootstrapData().settings.base_url;
      if (e.data.type === 'social-auth' && baseUrl.indexOf(e.origin) > -1) {
        resolve(e.data);
        window.removeEventListener('message', messageListener);
      }
    };

    window.addEventListener('message', messageListener);

    // if user closes social login callback without interacting with it, remove message event listener
    const timer = setInterval(() => {
      if (!win || win.closed) {
        clearInterval(timer);
        resolve({});
        window.removeEventListener('message', messageListener);
      }
    }, 1000);
  });
}
