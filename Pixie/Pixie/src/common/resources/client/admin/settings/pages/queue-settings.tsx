import {useFormContext} from 'react-hook-form';
import {ComponentType} from 'react';
import {SettingsPanel} from '../settings-panel';
import {SettingsErrorGroup} from '../settings-error-group';
import {SectionHelper} from '../../../ui/section-helper';
import {AdminSettings} from '../admin-settings';
import {FormSelect, Option} from '../../../ui/forms/select/select';
import {FormTextField} from '../../../ui/forms/input-field/text-field/text-field';
import {Trans} from '../../../i18n/trans';

export function QueueSettings() {
  return (
    <SettingsPanel
      title={<Trans message="Queue" />}
      description={
        <Trans message="Select active queue method and enter related 3rd party API keys." />
      }
    >
      <SectionHelper
        color="positive"
        className="mb-30"
        description={
          <Trans message="Queues allow to defer time consuming tasks, such as sending an email, until a later time. Deferring these tasks can speed up web requests to the application." />
        }
      />
      <SectionHelper
        color="warning"
        className="mb-30"
        description={
          <Trans message="All methods except sync require additional setup, which should be performed before changing the queue method. Consult documentation for more information." />
        }
      />
      <DriverSection />
    </SettingsPanel>
  );
}

function DriverSection() {
  const {watch, clearErrors} = useFormContext<AdminSettings>();
  const queueDriver = watch('server.queue_driver');

  let CredentialSection: ComponentType<CredentialProps> | null = null;
  if (queueDriver === 'sqs') {
    CredentialSection = SqsCredentials;
  }
  return (
    <SettingsErrorGroup
      separatorTop={false}
      separatorBottom={false}
      name="queue_group"
    >
      {isInvalid => {
        return (
          <>
            <FormSelect
              invalid={isInvalid}
              onSelectionChange={() => {
                clearErrors();
              }}
              selectionMode="single"
              name="server.queue_driver"
              label={<Trans message="Queue method" />}
              required
            >
              <Option value="sync">
                <Trans message="Sync (Default)" />
              </Option>
              <Option value="beanstalkd">Beanstalkd</Option>
              <Option value="database">
                <Trans message="Database" />
              </Option>
              <Option value="sqs">
                <Trans message="SQS (Amazon simple queue service)" />
              </Option>
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
function SqsCredentials({isInvalid}: CredentialProps) {
  return (
    <>
      <FormTextField
        invalid={isInvalid}
        className="mb-30"
        name="server.sqs_queue_key"
        label={<Trans message="SQS queue key" />}
        required
      />
      <FormTextField
        invalid={isInvalid}
        className="mb-30"
        name="server.sqs_queue_secret"
        label={<Trans message="SQS queue secret" />}
        required
      />
      <FormTextField
        invalid={isInvalid}
        className="mb-30"
        name="server.sqs_queue_prefix"
        label={<Trans message="SQS queue prefix" />}
        required
      />
      <FormTextField
        invalid={isInvalid}
        className="mb-30"
        name="server.sqs_queue_name"
        label={<Trans message="SQS queue name" />}
        required
      />
      <FormTextField
        invalid={isInvalid}
        className="mb-30"
        name="server.sqs_queue_region"
        label={<Trans message="SQS queue region" />}
        required
      />
    </>
  );
}
