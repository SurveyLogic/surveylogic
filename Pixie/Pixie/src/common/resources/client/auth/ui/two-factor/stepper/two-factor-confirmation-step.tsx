import {AnimatePresence, m} from 'framer-motion';
import {opacityAnimation} from '@common/ui/animation/opacity-animation';
import {ReactNode} from 'react';
import {useTwoFactorQrCode} from '@common/auth/ui/two-factor/requests/use-two-factor-qr-code';
import {useForm} from 'react-hook-form';
import {
  ConfirmTwoFactorPayload,
  useConfirmTwoFactor,
} from '@common/auth/ui/two-factor/requests/use-confirm-two-factor';
import {TwoFactorStepperLayout} from '@common/auth/ui/two-factor/stepper/two-factor-stepper-layout';
import {Trans} from '@common/i18n/trans';
import {Skeleton} from '@common/ui/skeleton/skeleton';
import {Form} from '@common/ui/forms/form';
import {queryClient} from '@common/http/query-client';
import {FormTextField} from '@common/ui/forms/input-field/text-field/text-field';
import {useDisableTwoFactor} from '@common/auth/ui/two-factor/requests/use-disable-two-factor';
import {usePasswordConfirmedAction} from '@common/auth/ui/confirm-password/use-password-confirmed-action';
import {Button} from '@common/ui/buttons/button';

interface Props {
  onCancel: () => void;
  onConfirmed: () => void;
}
export function TwoFactorConfirmationStep(props: Props) {
  const {data} = useTwoFactorQrCode();

  return (
    <TwoFactorStepperLayout
      title={<Trans message="Finish enabling two factor authentication." />}
      description={
        <Trans message="To finish enabling two factor authentication, scan the following QR code using your phone's authenticator application or enter the setup key and provide the generated OTP code." />
      }
    >
      <AnimatePresence initial={false}>
        {!data ? (
          <QrCodeLayout
            animationKey="svg-skeleton"
            svg={<Skeleton variant="rect" size="w-full h-full" />}
            secret={<Skeleton variant="text" className="max-w-224" />}
          />
        ) : (
          <QrCodeLayout
            animationKey="real-svg"
            svg={<div dangerouslySetInnerHTML={{__html: data.svg}} />}
            secret={
              <Trans message="Setup key: :key" values={{key: data.secret}} />
            }
          />
        )}
      </AnimatePresence>
      <CodeForm {...props} />
    </TwoFactorStepperLayout>
  );
}

function CodeForm({onCancel, onConfirmed}: Props) {
  const form = useForm<ConfirmTwoFactorPayload>();
  const confirmTwoFactor = useConfirmTwoFactor(form);
  const disableTwoFactor = useDisableTwoFactor();
  const {withConfirmedPassword, isLoading: confirmPasswordIsLoading} =
    usePasswordConfirmedAction();
  const isLoading =
    confirmTwoFactor.isLoading ||
    disableTwoFactor.isLoading ||
    confirmPasswordIsLoading;

  return (
    <Form
      form={form}
      onSubmit={values =>
        withConfirmedPassword(() => {
          confirmTwoFactor.mutate(values, {
            onSuccess: () => {
              queryClient.invalidateQueries(['users']);
              onConfirmed();
            },
          });
        })
      }
    >
      <FormTextField
        required
        name="code"
        label={<Trans message="Code" />}
        autoFocus
      />
      <div className="flex items-center gap-12 mt-24">
        <Button
          type="button"
          variant="outline"
          disabled={isLoading}
          onClick={() => {
            withConfirmedPassword(() => {
              disableTwoFactor.mutate(undefined, {onSuccess: onCancel});
            });
          }}
        >
          <Trans message="Cancel" />
        </Button>
        <Button
          type="submit"
          variant="flat"
          color="primary"
          disabled={isLoading}
        >
          <Trans message="Confirm" />
        </Button>
      </div>
    </Form>
  );
}

interface QrCodeLayoutProps {
  animationKey: string;
  svg: ReactNode;
  secret: ReactNode;
}
function QrCodeLayout({animationKey, svg, secret}: QrCodeLayoutProps) {
  return (
    <m.div key={animationKey} {...opacityAnimation}>
      <div className="w-192 h-192 mb-16">{svg}</div>
      <div className="text-sm font-medium mb-16">{secret}</div>
    </m.div>
  );
}
