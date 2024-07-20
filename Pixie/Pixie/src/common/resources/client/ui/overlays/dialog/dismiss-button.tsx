import React from 'react';
import {useTrans} from '../../../i18n/use-trans';
import {message} from '../../../i18n/message';

interface DismissButtonProps {
  onDismiss?: () => void;
}
export function DismissButton({onDismiss}: DismissButtonProps) {
  const {trans} = useTrans();

  const onClick = () => {
    if (onDismiss) {
      onDismiss();
    }
  };

  return (
    <button
      className="sr-only"
      aria-label={trans(message('Dismiss'))}
      tabIndex={-1}
      onClick={onClick}
    />
  );
}
