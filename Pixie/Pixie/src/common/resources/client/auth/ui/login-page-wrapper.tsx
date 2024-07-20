import {useState} from 'react';
import {TwoFactorChallengePage} from '@common/auth/ui/two-factor/two-factor-challenge-page';
import {LoginPage} from '@common/auth/ui/login-page';

export function LoginPageWrapper() {
  const [isTwoFactor, setIsTwoFactor] = useState(false);
  if (isTwoFactor) {
    return <TwoFactorChallengePage />;
  } else {
    return <LoginPage onTwoFactorChallenge={() => setIsTwoFactor(true)} />;
  }
}
