import {FormSelect, Option} from '../../../ui/forms/select/select';
import {SettingsPanel} from '../settings-panel';
import {useValueLists} from '../../../http/value-lists';
import {Section} from '../../../ui/forms/listbox/section';
import {FormRadio} from '../../../ui/forms/radio-group/radio';
import {FormRadioGroup} from '../../../ui/forms/radio-group/radio-group';
import {DateFormatPresets, FormattedDate} from '../../../i18n/formatted-date';
import {FormSwitch} from '../../../ui/forms/toggle/switch';
import {Trans} from '../../../i18n/trans';
import {FormComboBox} from '../../../ui/forms/combobox/form-combobox';
import {useCurrentDateTime} from '../../../i18n/use-current-date-time';

export function LocalizationSettings() {
  const {data} = useValueLists(['timezones', 'localizations']);
  const today = useCurrentDateTime();
  return (
    <SettingsPanel
      title={<Trans message="Localization" />}
      description={
        <Trans message="Configure global date, time and language settings." />
      }
    >
      <FormComboBox
        className="mb-30"
        required
        name="client.dates.default_timezone"
        openMenuOnFocus
        label={<Trans message="Default timezone" />}
        description={
          <Trans message="Which timezone should be selected by default for new users and guests." />
        }
      >
        <Option key="auto" value="auto">
          <Trans message="Auto" />
        </Option>
        {Object.entries(data?.timezones || {}).map(([groupName, timezones]) => (
          <Section key={groupName} label={groupName}>
            {timezones.map(timezone => (
              <Option key={timezone.value} value={timezone.value}>
                {timezone.text}
              </Option>
            ))}
          </Section>
        ))}
      </FormComboBox>
      <FormSelect
        name="client.locale.default"
        className="mb-30"
        selectionMode="single"
        label={<Trans message="Default language" />}
        description={
          <Trans message="Which localization should be selected by default for new users and guests." />
        }
      >
        <Option key="auto" value="auto">
          <Trans message="Auto" />
        </Option>
        {(data?.localizations || []).map(locale => (
          <Option key={locale.language} value={locale.language} capitalizeFirst>
            {locale.name}
          </Option>
        ))}
      </FormSelect>
      <FormRadioGroup
        required
        className="mb-30"
        size="sm"
        name="client.dates.format"
        orientation="vertical"
        label={<Trans message="Date verbosity" />}
        description={
          <Trans message="Default verbosity for all dates displayed across the site. Month/day order and separators will be adjusted automatically, based on user's locale." />
        }
      >
        <FormRadio key="auto" value="auto">
          <Trans message="Auto" />
        </FormRadio>
        {Object.entries(DateFormatPresets).map(([format, options]) => (
          <FormRadio key={format} value={format}>
            <FormattedDate date={today} options={options} />
          </FormRadio>
        ))}
      </FormRadioGroup>
      <FormSwitch
        name="client.i18n.enable"
        description={
          <Trans message="If disabled, site will always be shown in default language and user will not be able to change their locale." />
        }
      >
        <Trans message="Enable translations" />
      </FormSwitch>
    </SettingsPanel>
  );
}
