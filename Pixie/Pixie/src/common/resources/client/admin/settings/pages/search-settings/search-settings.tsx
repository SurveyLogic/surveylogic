import {FormSelect, Select} from '@common/ui/forms/select/select';
import {SettingsPanel} from '../../settings-panel';
import {Trans} from '@common/i18n/trans';
import {useFormContext} from 'react-hook-form';
import {AdminSettingsWithFiles} from '@common/admin/settings/requests/update-admin-settings';
import {Item} from '@common/ui/forms/listbox/item';
import {SectionHelper} from '@common/ui/section-helper';
import {SettingsErrorGroup} from '@common/admin/settings/settings-error-group';
import {Fragment, useState} from 'react';
import {FormTextField} from '@common/ui/forms/input-field/text-field/text-field';
import {useSearchModels} from '@common/admin/settings/pages/search-settings/requests/use-search-models';
import {Button} from '@common/ui/buttons/button';
import {useImportSearchModels} from '@common/admin/settings/pages/search-settings/requests/use-import-search-models';

export function SearchSettings() {
  return (
    <SettingsPanel
      title={<Trans message="Search" />}
      description={
        <Trans message="Configure search method used on the site as well as related 3rd party integrations." />
      }
    >
      <SearchMethodSelect />
      <ImportRecordsPanel />
    </SettingsPanel>
  );
}

function SearchMethodSelect() {
  const {watch} = useFormContext<AdminSettingsWithFiles>();
  const selectedMethod = watch('server.scout_driver');

  return (
    <SettingsErrorGroup name="search_group" separatorBottom={false}>
      {isInvalid => (
        <Fragment>
          <FormSelect
            invalid={isInvalid}
            name="server.scout_driver"
            selectionMode="single"
            label={<Trans message="Search method" />}
            description={
              <Trans message="Which method should be used for search related functionality across the site." />
            }
          >
            <Item value="mysql">Mysql</Item>
            <Item value="meilisearch">Meilisearch</Item>
            <Item value="tntsearch">TNTSearch</Item>
            <Item value="Matchish\ScoutElasticSearch\Engines\ElasticSearchEngine">
              Elasticsearch
            </Item>
            <Item value="algolia">Algolia</Item>
          </FormSelect>
          {selectedMethod === 'mysql' && <MysqlFields />}
          {selectedMethod === 'meilisearch' && <MeilisearchFields />}
          {selectedMethod === 'algolia' && <AlgoliaFields />}
          {selectedMethod ===
            'Matchish\\ScoutElasticSearch\\Engines\\ElasticSearchEngine' && (
            <ElasticsearchField />
          )}
        </Fragment>
      )}
    </SettingsErrorGroup>
  );
}

function MysqlFields() {
  const {clearErrors} = useFormContext<AdminSettingsWithFiles>();
  return (
    <FormSelect
      className="mt-24"
      name="server.scout_mysql_mode"
      selectionMode="single"
      label={<Trans message="MySQL mode" />}
      onSelectionChange={() => {
        clearErrors();
      }}
    >
      <Item value="basic">
        <Trans message="Basic" />
      </Item>
      <Item value="extended">
        <Trans message="Extended" />
      </Item>
      <Item value="fulltext">
        <Trans message="Fulltext" />
      </Item>
    </FormSelect>
  );
}

function MeilisearchFields() {
  return (
    <SectionHelper
      className="mt-24"
      color="warning"
      title={<Trans message="Important!" />}
      description={
        <Trans
          message="<a>Meilisearch</a> needs to be installed and running for this method to work."
          values={{
            a: parts => (
              <a
                href="https://www.meilisearch.com"
                target="_blank"
                rel="noreferrer"
              >
                {parts}
              </a>
            ),
          }}
        />
      }
    />
  );
}

function ElasticsearchField() {
  return (
    <SectionHelper
      className="mt-24"
      color="warning"
      title={<Trans message="Important!" />}
      description={
        <Trans
          message="<a>Elasticsearch</a> needs to be installed and running for this method to work."
          values={{
            a: parts => (
              <a href="https://www.elastic.co" target="_blank" rel="noreferrer">
                {parts}
              </a>
            ),
          }}
        />
      }
    />
  );
}

function AlgoliaFields() {
  return (
    <Fragment>
      <FormTextField
        className="mt-24"
        name="server.algolia_app_id"
        label={<Trans message="Algolia app ID" />}
        required
      />
      <FormTextField
        className="mt-24"
        name="server.algolia_secret"
        label={<Trans message="Algolia app secret" />}
        required
      />
    </Fragment>
  );
}

function ImportRecordsPanel() {
  const {getValues} = useFormContext<AdminSettingsWithFiles>();
  const {data} = useSearchModels();
  const importModels = useImportSearchModels();
  const [selectedModel, setSelectedModel] = useState('*');
  return (
    <SectionHelper
      className="mt-34"
      color="neutral"
      title={<Trans message="Import records" />}
      description={
        <span>
          <Trans message="Whenever a new search method is enabled, records that already exist in database need to be imported into the index. All records created after search method is enabled will be imported automatically." />
          <br />
          <br />
          <Trans message="Depending on number of records in database, importing could take some time. Don't close this window while it is in progress." />
        </span>
      }
      actions={
        <div className="pt-14 mt-10 border-t">
          <Select
            selectionMode="single"
            label={<Trans message="What to import?" />}
            selectedValue={selectedModel}
            onSelectionChange={newValue => {
              setSelectedModel(newValue as string);
            }}
          >
            <Item value="*">
              <Trans message="Everything" />
            </Item>
            {data?.models.map(item => (
              <Item value={item.model} key={item.model}>
                <Trans message={item.name} />
              </Item>
            ))}
          </Select>
          <Button
            variant="flat"
            color="primary"
            className="mt-24 mb-8"
            disabled={importModels.isLoading}
            onClick={() => {
              importModels.mutate({
                model: selectedModel,
                driver: getValues('server.scout_driver')!,
              });
            }}
          >
            <Trans message="Import now" />
          </Button>
        </div>
      }
    />
  );
}
