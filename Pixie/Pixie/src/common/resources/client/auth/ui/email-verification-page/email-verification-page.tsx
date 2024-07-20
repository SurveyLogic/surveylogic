import {useUser} from '../use-user';
import {Trans} from '../../../i18n/trans';
import mailSentSvg from './mail-sent.svg';
import {SvgImage} from '../../../ui/images/svg-image/svg-image';
import {Button} from '../../../ui/buttons/button';
import {useResendVerificationEmail} from '../../requests/use-resend-verification-email';
import {useIsDarkMode} from '../../../ui/themes/use-is-dark-mode';
import {useSettings} from '../../../core/settings/use-settings';

export function EmailVerificationPage() {
  const {data} = useUser('me');
  const resendEmail = useResendVerificationEmail();
  const {
    branding: {logo_light, logo_dark},
  } = useSettings();
  const isDarkMode = useIsDarkMode();
  const logoSrc = isDarkMode ? logo_light : logo_dark;

  return (
    <div className="flex flex-col items-center p-24 bg-alt w-full min-h-full">
      {logoSrc && (
        <img
          src={logoSrc}
          alt="Site logo"
          className="my-60 block h-42 w-auto"
        />
      )}
      <div className="bg-paper px-14 py-28 rounded shadow border max-w-580 flex flex-col items-center text-center">
        <SvgImage src={mailSentSvg} className="h-144" />
        <h1 className="text-3xl mt-40 mb-20">
          <Trans message="Verify your email" />
        </h1>
        <div className="mb-24 text-sm">
          <Trans
            message="We've sent an email to “:email“ to verify your email address and activate your account. The link in the the email will expire in 24 hours."
            values={{email: data?.user.email}}
          />
        </div>
        <div className="text-sm">
          <Trans message="If you did not receive an email, click the button below and we will send you another one." />
        </div>
        <Button
          className="mt-30"
          variant="flat"
          color="primary"
          disabled={resendEmail.isLoading || !data?.user.email}
          onClick={() => {
            resendEmail.mutate({email: data!.user.email});
          }}
        >
          <Trans message="Resend email" />
        </Button>
      </div>
    </div>
  );
}
