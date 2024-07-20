import React from 'react';
import {QueryClientProvider} from '@tanstack/react-query';
import {domAnimation, LazyMotion} from 'framer-motion';
import {queryClient} from '../http/query-client';
import {SiteConfigContext} from './settings/site-config-context';
import {SiteConfig} from '@app/site-config';
import deepMerge from 'deepmerge';
import {BaseSiteConfig} from './settings/base-site-config';
import {ThemeProvider} from './theme-provider';
import {BootstrapDataProvider} from './bootstrap-data/bootstrap-data-provider';

interface ProvidersProps {
  children: any;
}

const mergedConfig = deepMerge(BaseSiteConfig, SiteConfig);

export function CommonProvider({children}: ProvidersProps) {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <LazyMotion features={domAnimation}>
          <SiteConfigContext.Provider value={mergedConfig}>
            <BootstrapDataProvider>
              <ThemeProvider>{children}</ThemeProvider>
            </BootstrapDataProvider>
          </SiteConfigContext.Provider>
        </LazyMotion>
      </QueryClientProvider>
    </React.StrictMode>
  );
}
