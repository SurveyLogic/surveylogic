import {ReactNode} from 'react';
import {isMac} from '@react-aria/utils';

interface Props {
  children: ReactNode;
  modifier?: boolean;
  separator?: string;
}
export function Keyboard({children, modifier, separator = '+'}: Props) {
  const modKey = isMac() ? (
    <span className="text-base align-middle">⌘</span>
  ) : (
    'Ctrl'
  );
  return (
    <kbd className="text-xs text-muted">
      {modifier && (
        <>
          {modKey}
          {separator}
        </>
      )}
      {children}
    </kbd>
  );
}
