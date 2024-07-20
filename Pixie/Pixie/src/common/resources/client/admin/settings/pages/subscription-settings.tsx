import {useFormContext} from 'react-hook-form';
import {SettingsPanel} from '../settings-panel';
import {FormSwitch} from '../../../ui/forms/toggle/switch';
import {SettingsSeparator} from '../settings-separator';
import {LearnMoreLink} from '../learn-more-link';
import {AdminSettings} from '../admin-settings';
import {FormTextField} from '../../../ui/forms/input-field/text-field/text-field';
import {SettingsErrorGroup} from '../settings-error-group';
import {JsonChipField} from '../json-chip-field';
import {Tabs} from '../../../ui/tabs/tabs';
import {TabList} from '../../../ui/tabs/tab-list';
import {Tab} from '../../../ui/tabs/tab';
import {TabPanel, TabPanels} from '../../../ui/tabs/tab-panels';
import {Trans} from '../../../i18n/trans';
import {useTrans} from '../../../i18n/use-trans';
import {Fragment} from 'react';

export function SubscriptionSettings() {
  const {trans} = useTrans();
  return (
    <SettingsPanel
      title={<Trans message="Subscriptions" />}
      description={
        <Trans message="Configure gateway integration, accepted cards, invoices and other related settings." />
      }
    >
      <Tabs>
        <TabList>
          <Tab>
            <Trans message="General" />
          </Tab>
          <Tab>
            <Trans message="Invoices" />
          </Tab>
        </TabList>
        <TabPanels className="pt-30">
          <TabPanel>
            <FormSwitch
              name="client.billing.enable"
              description={
                <Trans message="Enable or disable all subscription related functionality across the site." />
              }
            >
              <Trans message="Enable subscriptions" />
            </FormSwitch>
            <SettingsSeparator />
            <PaypalSection />
            <StripeSection />
            <SettingsSeparator />
            <JsonChipField
              name="client.billing.accepted_cards"
              placeholder={trans({message: 'Add new card...'})}
            />
          </TabPanel>
          <TabPanel>
            <FormTextField
              inputElementType="textarea"
              rows={5}
              label={<Trans message="Invoice address" />}
              name="client.billing.invoice.address"
              className="mb-30"
            />
            <FormTextField
              inputElementType="textarea"
              rows={5}
              label={<Trans message="Invoice notes" />}
              description={
                <Trans message="Default notes to show under `notes` section of user invoice. Optional." />
              }
              name="client.billing.invoice.notes"
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </SettingsPanel>
  );
}

function PaypalSection() {
  const {watch} = useFormContext<AdminSettings>();
  const paypalIsEnabled = watch('client.billing.paypal.enable');
  return (
    <div className="mb-30">
      <FormSwitch
        name="client.billing.paypal.enable"
        description={
          <div>
            <Trans message="Enable PayPal payment gateway integration." />
            <LearnMoreLink
              className="mt-6"
              link="https://support.vebto.com/help-center/articles/147/configuring-paypal"
            />
          </div>
        }
      >
        <Trans message="PayPal gateway" />
      </FormSwitch>
      {paypalIsEnabled && (
        <SettingsErrorGroup name="paypal_group">
          {isInvalid => (
            <Fragment>
              <FormTextField
                name="server.paypal_client_id"
                label={<Trans message="PayPal Client ID" />}
                required
                invalid={isInvalid}
                className="mb-20"
              />
              <FormTextField
                name="server.paypal_secret"
                label={<Trans message="PayPal Secret" />}
                required
                invalid={isInvalid}
                className="mb-20"
              />
              <FormTextField
                name="server.paypal_webhook_id"
                label={<Trans message="PayPal Webhook ID" />}
                required
                invalid={isInvalid}
                className="mb-20"
              />
              <FormSwitch
                name="client.billing.paypal_test_mode"
                invalid={isInvalid}
                description={
                  <div>
                    <Trans message="Allows testing PayPal payments with sandbox accounts." />
                  </div>
                }
              >
                <Trans message="PayPal test mode" />
              </FormSwitch>
            </Fragment>
          )}
        </SettingsErrorGroup>
      )}
    </div>
  );
}

function StripeSection() {
  const {watch} = useFormContext<AdminSettings>();
  const stripeEnabled = watch('client.billing.stripe.enable');
  return (
    <>
      <FormSwitch
        name="client.billing.stripe.enable"
        description={
          <div>
            <Trans message="Enable Stripe payment gateway integration." />
            <LearnMoreLink
              className="mt-6"
              link="https://support.vebto.com/help-center/articles/148/configuring-stripe"
            />
          </div>
        }
      >
        <Trans message="Stripe gateway" />
      </FormSwitch>
      {stripeEnabled && (
        <SettingsErrorGroup name="stripe_group" separatorBottom={false}>
          {isInvalid => (
            <Fragment>
              <FormTextField
                name="server.stripe_key"
                label={<Trans message="Stripe publishable key" />}
                required
                className="mb-20"
                invalid={isInvalid}
              />
              <FormTextField
                name="server.stripe_secret"
                label={<Trans message="Stripe secret key" />}
                required
                className="mb-20"
                invalid={isInvalid}
              />
              <FormTextField
                name="server.stripe_webhook_secret"
                label={<Trans message="Stripe webhook signing secret" />}
                className="mb-20"
                invalid={isInvalid}
              />
            </Fragment>
          )}
        </SettingsErrorGroup>
      )}
    </>
  );
}
