import {useFormContext} from 'react-hook-form';
import {ComponentType} from 'react';
import {SettingsPanel} from '../../settings-panel';
import {FormSelect, Option} from '../../../../ui/forms/select/select';
import {SettingsErrorGroup} from '../../settings-error-group';
import {FormTextField} from '../../../../ui/forms/input-field/text-field/text-field';
import {AdminSettings} from '../../admin-settings';
import {useClearCache} from './clear-cache';
import {Button} from '../../../../ui/buttons/button';
import {SectionHelper} from '../../../../ui/section-helper';
import {Trans} from '../../../../i18n/trans';

export function CacheSettings() {
  const clearCache = useClearCache();
  return (
    <SettingsPanel
      title={<Trans message="Cache settings" />}
      description={
        <Trans message="Select cache provider and manually clear cache." />
      }
    >
      <CacheSelect />
      <Button
        type="button"
        variant="outline"
        size="xs"
        color="primary"
        disabled={clearCache.isLoading}
        onClick={() => {
          clearCache.mutate();
        }}
      >
        <Trans message="Clear cache" />
      </Button>
      <SectionHelper
        color="warning"
        className="mt-30"
        description={
          <Trans
            message={
              '"File" is the best option for most cases and should not be changed, unless you are familiar with another cache method and have it set up on the server already.'
            }
          />
        }
      />
    </SettingsPanel>
  );
}

function CacheSelect() {
  const {watch, clearErrors} = useFormContext<AdminSettings>();
  const cacheDriver = watch('server.cache_driver');

  let CredentialSection: ComponentType<CredentialProps> | null = null;
  if (cacheDriver === 'memcached') {
    CredentialSection = MemcachedCredentials;
  }

  return (
    <SettingsErrorGroup separatorTop={false} name="cache_group">
      {isInvalid => {
        return (
          <>
            <FormSelect
              invalid={isInvalid}
              onSelectionChange={() => {
                clearErrors();
              }}
              selectionMode="single"
              name="server.cache_driver"
              label={<Trans message="Cache method" />}
              description={
                <Trans message="Which method should be used for storing and retrieving cached items." />
              }
            >
              <Option value="file">
                <Trans message="File (Default)" />
              </Option>
              <Option value="array">
                <Trans message="None" />
              </Option>
              <Option value="apc">APC</Option>
              <Option value="memcached">Memcached</Option>
              <Option value="redis">Redis</Option>
            </FormSelect>
            {CredentialSection && (
              <div className="mt-30">
                <CredentialSection isInvalid={isInvalid} />
              </div>
            )}
          </>
        );
      }}
    </SettingsErrorGroup>
  );
}

interface CredentialProps {
  isInvalid: boolean;
}
function MemcachedCredentials({isInvalid}: CredentialProps) {
  return (
    <>
      <FormTextField
        invalid={isInvalid}
        className="mb-30"
        name="server.memcached_host"
        label={<Trans message="Memcached host" />}
        required
      />
      <FormTextField
        invalid={isInvalid}
        type="number"
        name="server.memcached_port"
        label={<Trans message="Memcached port" />}
        required
      />
    </>
  );
}
