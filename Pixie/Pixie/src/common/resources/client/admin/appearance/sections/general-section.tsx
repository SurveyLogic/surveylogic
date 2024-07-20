import {appearanceState, useAppearanceStore} from '../appearance-store';
import {FormImageSelector} from '@common/ui/images/image-selector';
import {FormTextField} from '@common/ui/forms/input-field/text-field/text-field';
import {Trans} from '@common/i18n/trans';
import {Fragment, ReactNode} from 'react';
import {Settings} from '../../../core/settings/settings';

export function GeneralSection() {
  return (
    <Fragment>
      <BrandingImageSelector
        label={<Trans message="Favicon" />}
        description={
          <Trans message="This will generate different size favicons. Image should be at least 512x512 in size." />
        }
        type="favicon"
      />
      <BrandingImageSelector
        label={<Trans message="Light logo" />}
        description={<Trans message="Will be used on dark backgrounds." />}
        type="logo_light"
      />
      <BrandingImageSelector
        label={<Trans message="Dark logo" />}
        description={
          <Trans message="Will be used on light backgrounds. Will default to light logo if left empty." />
        }
        type="logo_dark"
      />
      <BrandingImageSelector
        label={<Trans message="Mobile light logo" />}
        description={
          <Trans message="Will be used on light backgrounds on mobile. Will default to desktop logo if left empty." />
        }
        type="logo_light_mobile"
      />
      <BrandingImageSelector
        label={<Trans message="Mobile dark logo" />}
        description={
          <Trans message="Will be used on dark backgrounds on mobile. Will default to desktop if left empty." />
        }
        type="logo_dark_mobile"
      />
      <SiteNameTextField />
      <SiteDescriptionTextArea />
    </Fragment>
  );
}

interface ImageSelectorProps {
  label: ReactNode;
  description: ReactNode;
  type: keyof Settings['branding'];
}
function BrandingImageSelector({label, description, type}: ImageSelectorProps) {
  const defaultValue = useAppearanceStore(
    s => s.defaults?.settings.branding[type]
  );
  return (
    <FormImageSelector
      name={`settings.branding.${type}`}
      className="border-b pb-30 mb-30"
      label={label}
      description={description}
      diskPrefix="branding_media"
      defaultValue={defaultValue}
      onChange={() => {
        appearanceState().preview.setHighlight('[data-logo="navbar"]');
      }}
    />
  );
}
function SiteNameTextField() {
  return (
    <FormTextField
      name="appearance.env.app_name"
      required
      className="mt-20"
      label={<Trans message="Site name" />}
    />
  );
}

function SiteDescriptionTextArea() {
  return (
    <FormTextField
      name="settings.branding.site_description"
      className="mt-20"
      inputElementType="textarea"
      rows={4}
      label={<Trans message="Site description" />}
    />
  );
}
