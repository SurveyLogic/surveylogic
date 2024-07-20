import {MessageDescriptor} from './message-descriptor';
import {Trans} from './trans';
import {Fragment} from 'react';

interface Props {
  value?: string | MessageDescriptor | null;
}
export function MixedText({value}: Props) {
  if (!value) {
    return null;
  }
  if (typeof value === 'string') {
    return <Fragment>{value}</Fragment>;
  }
  return <Trans {...value} />;
}
