import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import {Settings} from '../core/settings/settings';
import {useMemo} from 'react';
import {Navbar} from '../ui/navigation/navbar/navbar';
import {Footer} from '../ui/footer/footer';
import {useSettings} from '../core/settings/use-settings';

export default function SwaggerApiDocsPage() {
  const settings = useSettings();

  const plugins = useMemo(() => {
    return getPluginsConfig(settings);
  }, [settings]);

  return (
    <div className="overflow-y-auto h-full bg-alt">
      <Navbar size="sm" />
      <div className="container mx-auto">
        <SwaggerUI
          url={`${settings.base_url}/swagger.yaml`}
          plugins={plugins}
        />
        <Footer className="px-20" />
      </div>
    </div>
  );
}

function getPluginsConfig(settings: Settings) {
  return [
    {
      statePlugins: {
        spec: {
          wrapActions: {
            updateSpec: (oriAction: any) => {
              return (spec: any) => {
                // Replace site name
                spec = spec.replaceAll(
                  'SITE_NAME',
                  settings.branding.site_name
                );
                // Replace site url
                spec = spec.replaceAll('SITE_URL', settings.base_url);
                return oriAction(spec);
              };
            },
            // Add current server url to docs
            updateJsonSpec: (oriAction: any) => {
              return (spec: any) => {
                spec.servers = [{url: `${settings.base_url}/api/v1`}];
                return oriAction(spec);
              };
            },
          },
        },
      },
    },
  ];
}
