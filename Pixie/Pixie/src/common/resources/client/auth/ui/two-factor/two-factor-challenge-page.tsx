import {useForm} from 'react-hook-form';
import {FormTextField} from '../../../ui/forms/input-field/text-field/text-field';
import {Button} from '../../../ui/buttons/button';
import {Form} from '../../../ui/forms/form';
import {AuthLayout} from '../auth-layout/auth-layout';
import {Trans} from '../../../i18n/trans';
import {StaticPageTitle} from '../../../seo/static-page-title';
import {
  TwoFactorChallengePayload,
  useTwoFactorChallenge,
} from '@common/auth/ui/two-factor/requests/use-two-factor-challenge';
import {useState} from 'react';

export function TwoFactorChallengePage() {
  const [usingRecoveryCode, setUsingRecoveryCode] = useState(false);

  const form = useForm<TwoFactorChallengePayload>();
  const completeChallenge = useTwoFactorChallenge(form);

  return (
    <AuthLayout>
      <StaticPageTitle>
        <Trans message="Two factor authentication" />
      </StaticPageTitle>
      <Form
        form={form}
        onSubmit={payload => {
          completeChallenge.mutate(payload);
        }}
      >
        <div className="mb-32 text-sm">
          <Trans message="Confirm access to your account by entering the authentication code provided by your authenticator application." />
        </div>
        <div className="mb-4">
          {usingRecoveryCode ? (
            <FormTextField
              name="recovery_code"
              minLength={21}
              maxLength={21}
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
              label={<Trans message="Recovery code" />}
              autoFocus
              required
            />
          ) : (
            <FormTextField
              name="code"
              minLength={6}
              maxLength={6}
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
              label={<Trans message="Code" />}
              autoFocus
              required
            />
          )}
        </div>
        <div className="mb-32">
          <Button
            variant="link"
            color="primary"
            size="sm"
            onClick={() => setUsingRecoveryCode(!usingRecoveryCode)}
          >
            <Trans message="Use recovery code instead" />
          </Button>
        </div>
        <Button
          className="block w-full"
          type="submit"
          variant="flat"
          color="primary"
          size="md"
          disabled={completeChallenge.isLoading}
        >
          <Trans message="Continue" />
        </Button>
      </Form>
    </AuthLayout>
  );
}
