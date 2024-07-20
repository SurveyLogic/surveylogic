import {useMemo} from 'react';
import {useSettings} from '@common/core/settings/use-settings';
import {CustomDomain} from '@common/custom-domains/custom-domain';

export function useDefaultCustomDomainHost(
  allDomains?: CustomDomain[]
): string {
  const {custom_domains, base_url} = useSettings();
  return useMemo(() => {
    const selectedHost = custom_domains?.default_host;
    if (selectedHost) {
      const host = allDomains?.find(d => d.host === selectedHost)?.host;
      if (host) return host;
    }
    return base_url.replace(/\/$/, '').replace(/(^\w+:|^)\/\//, '');
  }, [custom_domains, base_url, allDomains]);
}
