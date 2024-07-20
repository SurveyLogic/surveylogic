import lazyLoader from '../utils/http/lazy-loader';
import {useCallback, useEffect, useState} from 'react';
import {apiClient} from '../http/query-client';
import {RecaptchaAction} from '../core/settings/settings';
import {toast} from '../ui/toast/toast';
import {message} from '../i18n/message';
import {useSettings} from '../core/settings/use-settings';

export function useRecaptcha(action: RecaptchaAction) {
  const {recaptcha: {site_key, enable} = {}} = useSettings();
  const enabled = site_key && enable?.[action];

  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (enabled) {
      load(site_key);
    }
  }, [enabled, site_key]);

  const verify = useCallback(async () => {
    if (!enabled) return true;
    setIsVerifying(true);
    const isValid = await execute(site_key, action);
    if (!isValid) {
      toast.danger(message('Could not verify you are human.'));
    }
    setIsVerifying(false);
    return isValid;
  }, [enabled, site_key, action]);

  return {verify, isVerifying};
}

async function execute(siteKey: string, action: string): Promise<boolean> {
  await load(siteKey);
  return new Promise(resolve => {
    window.grecaptcha?.ready(async () => {
      const token = await window.grecaptcha?.execute(siteKey, {action});
      const result = apiClient
        .post('recaptcha/verify', {token})
        .then(r => r.data.success)
        .catch(() => false);
      resolve(result ?? false);
    });
  });
}

function load(siteKey: string) {
  return lazyLoader.loadAsset(
    `https://www.google.com/recaptcha/api.js?render=${siteKey}`
  );
}
