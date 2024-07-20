import {Link, useSearchParams} from 'react-router-dom';
import {useForm} from 'react-hook-form';
import {FormTextField} from '../../ui/forms/input-field/text-field/text-field';
import {Button} from '../../ui/buttons/button';
import {Form} from '../../ui/forms/form';
import {LinkStyle} from '../../ui/buttons/external-link';
import {AuthLayout} from './auth-layout/auth-layout';
import {
  SendPasswordResetEmailPayload,
  useSendPasswordResetEmail,
} from '../requests/send-reset-password-email';
import {Trans} from '../../i18n/trans';
import {StaticPageTitle} from '../../seo/static-page-title';
import {useSettings} from '../../core/settings/use-settings';

export function ForgotPasswordPage() {
  const {registration} = useSettings();

  const [searchParams] = useSearchParams();
  const searchParamsEmail = searchParams.get('email') || undefined;

  const form = useForm<SendPasswordResetEmailPayload>({
    defaultValues: {email: searchParamsEmail},
  });
  const sendEmail = useSendPasswordResetEmail(form);

  const message = !registration.disable && (
    <Trans
      values={{
        a: parts => (
          <Link className={LinkStyle} to="/register">
            {parts}
          </Link>
        ),
      }}
      message="Don't have an account? <a>Sign up.</a>"
    />
  );

  return (
    <AuthLayout message={message}>
      <StaticPageTitle>
        <Trans message="Forgot Password" />
      </StaticPageTitle>
      <Form
        form={form}
        onSubmit={payload => {
          sendEmail.mutate(payload);
        }}
      >
        <div className="mb-32 text-sm">
          <Trans message="Enter your email address below and we will send you a link to reset or create your password." />
        </div>
        <FormTextField
          disabled={!!searchParamsEmail}
          className="mb-32"
          name="email"
          type="email"
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
          label={<Trans message="Email" />}
          required
        />
        <Button
          className="block w-full"
          type="submit"
          variant="flat"
          color="primary"
          size="md"
          disabled={sendEmail.isLoading}
        >
          <Trans message="Continue" />
        </Button>
      </Form>
    </AuthLayout>
  );
}
