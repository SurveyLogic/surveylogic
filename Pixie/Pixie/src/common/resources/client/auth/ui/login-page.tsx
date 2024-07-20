import {Link, useLocation, useSearchParams} from 'react-router-dom';
import {useForm} from 'react-hook-form';
import {FormTextField} from '../../ui/forms/input-field/text-field/text-field';
import {Button} from '../../ui/buttons/button';
import {Form} from '../../ui/forms/form';
import {LoginPayload, useLogin} from '../requests/use-login';
import {FormCheckbox} from '../../ui/forms/toggle/checkbox';
import {LinkStyle} from '../../ui/buttons/external-link';
import {SocialAuthSection} from './social-auth-section';
import {AuthLayout} from './auth-layout/auth-layout';
import {Trans} from '../../i18n/trans';
import {StaticPageTitle} from '../../seo/static-page-title';
import {useContext} from 'react';
import {
  SiteConfigContext,
  SiteConfigContextValue,
} from '../../core/settings/site-config-context';
import {useSettings} from '../../core/settings/use-settings';

interface Props {
  onTwoFactorChallenge: () => void;
}
export function LoginPage({onTwoFactorChallenge}: Props) {
  const [searchParams] = useSearchParams();
  const {pathname} = useLocation();

  const isWorkspaceLogin = pathname.includes('workspace');
  const searchParamsEmail = searchParams.get('email') || undefined;

  const {branding, registration, site, social} = useSettings();
  const siteConfig = useContext(SiteConfigContext);

  const demoDefaults =
    site.demo && !searchParamsEmail ? getDemoFormDefaults(siteConfig) : {};
  const form = useForm<LoginPayload>({
    defaultValues: {remember: true, email: searchParamsEmail, ...demoDefaults},
  });
  const login = useLogin(form);

  const heading = isWorkspaceLogin ? (
    <Trans
      values={{siteName: branding?.site_name}}
      message="To join your team on :siteName, login to your account"
    />
  ) : (
    <Trans message="Sign in to your account" />
  );

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

  const isInvalid = !form.formState.isValid;

  return (
    <AuthLayout heading={heading} message={message}>
      <StaticPageTitle>
        <Trans message="Login" />
      </StaticPageTitle>
      <Form
        form={form}
        onSubmit={payload => {
          login.mutate(payload, {
            onSuccess: response => {
              if (response.two_factor) {
                onTwoFactorChallenge();
              }
            },
          });
        }}
      >
        <FormTextField
          className="mb-32"
          name="email"
          type="email"
          label={<Trans message="Email" />}
          disabled={!!searchParamsEmail}
          invalid={isInvalid}
          required
        />
        <FormTextField
          className="mb-12"
          name="password"
          type="password"
          label={<Trans message="Password" />}
          invalid={isInvalid}
          labelSuffix={
            <Link className={LinkStyle} to="/forgot-password" tabIndex={-1}>
              <Trans message="Forgot your password?" />
            </Link>
          }
          required
        />
        <FormCheckbox name="remember" className="block mb-32">
          <Trans message="Stay signed in for a month" />
        </FormCheckbox>
        <Button
          className="block w-full"
          type="submit"
          variant="flat"
          color="primary"
          size="md"
          disabled={login.isLoading}
        >
          <Trans message="Continue" />
        </Button>
      </Form>
      <SocialAuthSection
        dividerMessage={
          social.compact_buttons ? (
            <Trans message="Or sign in with" />
          ) : (
            <Trans message="OR" />
          )
        }
      />
    </AuthLayout>
  );
}

function getDemoFormDefaults(siteConfig: SiteConfigContextValue) {
  if (siteConfig.demo.loginPageDefaults === 'randomAccount') {
    // random number between 0 and 100, padded to 3 digits
    const number = Math.floor(Math.random() * 100) + 1;
    const paddedNumber = String(number).padStart(3, '0');
    return {
      email: `admin@demo${paddedNumber}.com`,
      password: 'admin',
    };
  } else {
    return {
      email: 'admin@admin.com',
      password: 'admin',
    };
  }
}
