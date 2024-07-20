import {Fragment, memo} from 'react';
import {prettyBytes} from './utils/pretty-bytes';

interface FormattedBytesProps {
  bytes?: number;
}
export const FormattedBytes = memo(({bytes}: FormattedBytesProps) => {
  return <Fragment>{prettyBytes(bytes)}</Fragment>;
});
