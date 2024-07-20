import {Fragment, ReactNode} from 'react';
import {Trans} from '@common/i18n/trans';

interface Props {
  title: ReactNode;
  subtitle?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
}
export function TwoFactorStepperLayout({
  title,
  subtitle,
  description,
  actions,
  children,
}: Props) {
  if (!subtitle) {
    subtitle = (
      <Trans message="When two factor authentication is enabled, you will be prompted for a secure, random token during authentication. You may retrieve this token from your phone's Google Authenticator application." />
    );
  }
  return (
    <Fragment>
      <div className="text-base font-medium mb-16">{title}</div>
      <div className="text-sm mb-24">{subtitle}</div>
      <p className="text-sm font-medium my-16">{description}</p>
      {children}
      <div className="flex items-center gap-12">{actions}</div>
    </Fragment>
  );
}
