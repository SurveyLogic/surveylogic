import {Navbar} from '@common/ui/navigation/navbar/navbar';
import {useUser} from '../use-user';
import {ProgressCircle} from '@common/ui/progress/progress-circle';
import {SocialLoginPanel} from './social-login-panel';
import {BasicInfoPanel} from './basic-info-panel/basic-info-panel';
import {ChangePasswordPanel} from './change-password-panel/change-password-panel';
import {LocalizationPanel} from './localization-panel';
import {AccessTokenPanel} from './access-token-panel/access-token-panel';
import {DangerZonePanel} from './danger-zone-panel/danger-zone-panel';
import {Trans} from '@common/i18n/trans';
import {StaticPageTitle} from '@common/seo/static-page-title';
import {AccountSettingsPanel} from '@common/auth/ui/account-settings/account-settings-panel';
import {TwoFactorStepper} from '@common/auth/ui/two-factor/stepper/two-factor-auth-stepper';
import {
  AccountSettingsId,
  AccountSettingsSidenav,
} from '@common/auth/ui/account-settings/account-settings-sidenav';
import {SessionsPanel} from '@common/auth/ui/account-settings/sessions-panel/sessions-panel';

export function AccountSettingsPage() {
  const {data, isLoading} = useUser('me', {
    with: ['roles', 'social_profiles', 'tokens'],
  });
  return (
    <div className="bg-alt flex flex-col h-full">
      <StaticPageTitle>
        <Trans message="Account Settings" />
      </StaticPageTitle>
      <Navbar className="flex-shrink-0" menuPosition="account-settings-page" />
      <div className="flex-auto overflow-auto">
        <div className="container mx-auto my-24 px-24">
          <h1 className="text-3xl">
            <Trans message="Account settings" />
          </h1>
          <div className="mb-40 text-muted text-base">
            <Trans message="View and update your account details, profile and more." />
          </div>
          {isLoading || !data ? (
            <ProgressCircle
              className="my-80"
              aria-label="Loading user.."
              isIndeterminate
            />
          ) : (
            <div className="flex items-start gap-24">
              <AccountSettingsSidenav />
              <main className="flex-auto">
                <BasicInfoPanel user={data.user} />
                <SocialLoginPanel user={data.user} />
                <ChangePasswordPanel />
                <AccountSettingsPanel
                  id={AccountSettingsId.TwoFactor}
                  title={<Trans message="Two factor authentication" />}
                >
                  <div className="max-w-580">
                    <TwoFactorStepper user={data.user} />
                  </div>
                </AccountSettingsPanel>
                <SessionsPanel user={data.user} />
                <LocalizationPanel user={data.user} />
                <AccessTokenPanel user={data.user} />
                <DangerZonePanel />
              </main>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
