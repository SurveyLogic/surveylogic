import {Link, Navigate, useLocation, useSearchParams} from 'react-router-dom';
import {useForm} from 'react-hook-form';
import {FormTextField} from '../../ui/forms/input-field/text-field/text-field';
import {Button} from '../../ui/buttons/button';
import {Form} from '../../ui/forms/form';
import {LinkStyle} from '../../ui/buttons/external-link';
import {RegisterPayload, useRegister} from '../requests/use-register';
import {SocialAuthSection} from './social-auth-section';
import {AuthLayout} from './auth-layout/auth-layout';
import {Trans} from '../../i18n/trans';
import {FormCheckbox} from '../../ui/forms/toggle/checkbox';
import {CustomMenuItem} from '../../menus/custom-menu';
import {useRecaptcha} from '../../recaptcha/use-recaptcha';
import {StaticPageTitle} from '../../seo/static-page-title';
import {useSettings} from '../../core/settings/use-settings';

export function RegisterPage() {
  const {
    branding,
    registration: {disable},
    social,
  } = useSettings();
  const {verify, isVerifying} = useRecaptcha('register');

  const {pathname} = useLocation();
  const [searchParams] = useSearchParams();

  const isWorkspaceRegister = pathname.includes('workspace');
  const isBillingRegister = searchParams.get('redirectFrom') === 'pricing';
  const searchParamsEmail = searchParams.get('email') || undefined;

  const form = useForm<RegisterPayload>({
    defaultValues: {email: searchParamsEmail},
  });
  const register = useRegister(form);

  if (disable) {
    return <Navigate to="/login" replace />;
  }

  let heading = <Trans message="Create a new account" />;
  if (isWorkspaceRegister) {
    heading = (
      <Trans
        values={{siteName: branding?.site_name}}
        message="To join your team on :siteName, create an account"
      />
    );
  } else if (isBillingRegister) {
    heading = <Trans message="First, let's create your account" />;
  }

  const message = (
    <Trans
      values={{
        a: parts => (
          <Link className={LinkStyle} to="/login">
            {parts}
          </Link>
        ),
      }}
      message="Already have an account? <a>Sign in.</a>"
    />
  );

  return (
    <AuthLayout heading={heading} message={message}>
      <StaticPageTitle>
        <Trans message="Login" />
      </StaticPageTitle>
      <Form
        form={form}
        onSubmit={async payload => {
          const isValid = await verify();
          if (isValid) {
            register.mutate(payload);
          }
        }}
      >
        <FormTextField
          className="mb-32"
          name="email"
          type="email"
          disabled={!!searchParamsEmail}
          label={<Trans message="Email" />}
          required
        />
        <FormTextField
          className="mb-32"
          name="password"
          type="password"
          label={<Trans message="Password" />}
          required
        />
        <FormTextField
          className="mb-32"
          name="password_confirmation"
          type="password"
          label={<Trans message="Confirm password" />}
          required
        />
        <PolicyCheckboxes />
        <Button
          className="block w-full"
          type="submit"
          variant="flat"
          color="primary"
          size="md"
          disabled={register.isLoading || isVerifying}
        >
          <Trans message="Create account" />
        </Button>
        <SocialAuthSection
          dividerMessage={
            social.compact_buttons ? (
              <Trans message="Or sign up with" />
            ) : (
              <Trans message="OR" />
            )
          }
        />
      </Form>
    </AuthLayout>
  );
}

function PolicyCheckboxes() {
  const {
    registration: {policies},
  } = useSettings();

  if (!policies) return null;

  return (
    <div className="mb-32">
      {policies.map(policy => (
        <FormCheckbox
          key={policy.id}
          name={policy.id}
          className="block mb-4"
          required
        >
          <Trans
            message="I accept the :name"
            values={{
              name: (
                <CustomMenuItem
                  unstyled
                  className={() => LinkStyle}
                  item={policy}
                />
              ),
            }}
          />
        </FormCheckbox>
      ))}
    </div>
  );
}
